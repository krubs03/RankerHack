import { useEffect, useState } from "react";
import { sessionApi } from "../api/sessions";
import { StreamChat } from "stream-chat";
import { disconnectClient, initializeStreamVideoClient } from "../lib/stream";
import toast from "react-hot-toast";

export const useStreamClient = (
  session,
  sessionLoading,
  isHost,
  isParticipant,
) => {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      console.log("session:", session);
      if (!session?.sessionId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      console.log("Initializing call...");
      try {
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();
        const client = await initializeStreamVideoClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );

        setStreamClient(client);

        videoCall = client.call("default", session?.sessionId);
        await videoCall.join({ create: true });
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);
        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.sessionId,
        );
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video-call");
        console.error(error);
      } finally {
        setIsInitializingCall(false);
        console.log("isItializingCall set to false");
      }
    };

    if (session && !sessionLoading) initCall();

    // Cleanup => for performance reasons
    return () => {
      // iife => Immediately invoked function expression (Calls itself)
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, sessionLoading, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
};
