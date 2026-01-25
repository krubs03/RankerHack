import { chatClient, streamClient } from "../lib/stream.js";
import { Session } from "../models/Session.js";

const STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
};

const CALL_TYPE = "default";
const CHAT_TYPE = "messaging";

export async function createNewSession(req, res) {
  try {
    const { problem, difficulty } = req.body;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ error: "Problem and difficulty are required" });
    }

    const hostId = req.user._id;
    const clerkId = req.user.clerkId;

    //Generate unique sessionId for Stream video-chat
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Create a new session in the database
    const newSession = await Session.create({
      problem,
      difficulty,
      host: hostId,
      sessionId,
    });

    //Setting up new video-call
    await streamClient.video.call(CALL_TYPE, sessionId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: newSession._id.toString(),
        },
      },
    });

    //Setting up new chat
    const channel = chatClient.channel(CHAT_TYPE, sessionId, {
      name: `${problem} Session Chat`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session: newSession });
  } catch (error) {
    console.error("Error creating session:", error.message);
    res.status(500).json({ error: "Failed to create session" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    // Find sessions on basis of status, populate host details, and return utmost 20 recent sessions
    const sessions = await Session.find({ status: STATUS.ACTIVE })
      .populate("host", "name email clerkId profilePicture")
      .populate("participant", "name email clerkId profilePicture") 
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching active sessions:", error.message);
    res.status(500).json({ error: "Failed to fetch active sessions" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("host", "name email clerkId profilePicture")
      .populate("participant", "name email clerkId profilePicture");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error fetching session:", error.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}

export async function getRecentSessions(req, res) {
  try {
    const userId = req.user._id;
    // Find sessions where the user is host or participant, sort by recent, limit to 20
    const sessions = await Session.find({
      status: STATUS.COMPLETED,
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching recent sessions:", error.message);
    res.status(500).json({ error: "Failed to fetch recent sessions" });
  }
}

export async function joinSession(req, res) {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== STATUS.ACTIVE) {
      return res
        .status(400)
        .json({ message: "You cannot join a completed session" });
    }

    //Not more than 2 people allowed in a session (host + participant)
    if (session.participant) {
      return res.status(409).json({ message: "Session is already full" });
    }

    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({
          message:
            "Hosts are not permitted to join their own session as a participant",
        });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel(CHAT_TYPE, session.sessionId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error while joining session:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function endSession(req, res) {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    //Check if user is host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only the host can end a session" });
    }

    if (session.status === STATUS.COMPLETED) {
      return res.status(400).json({ message: "Session has already ended" });
    }

    // Delete Stream video call and chat channel
    await streamClient.video
      .call(CALL_TYPE, session.sessionId)
      .delete({ hard: true });
    await chatClient.channel(CHAT_TYPE, session.sessionId).delete();

    //Update session status at the end
    session.status = STATUS.COMPLETED;
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending session:", error.message);
    res.status(500).json({ error: "Failed to end session" });
  }
}
