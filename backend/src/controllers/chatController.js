import { streamClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    //Using clerkId since that's what we used as Stream user ID
    const token = streamClient.createToken(req.user.clerkId);
    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profilePicture,
    });
  } catch (error) {
    console.error("Error in generating Stream token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}