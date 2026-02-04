import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let client = null;

export const initializeStreamVideoClient = async (user, token) => {
  // If already existing client then just return same
  if (client && client?.user?.id === user?.id) return client;

  if (client) {
    await disconnectClient();
  }

  if (!apiKey) throw new Error("Stream API Key doesn't exist.");

  client = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  return client;
};

export const disconnectClient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
      client = null;
    } catch (error) {
      console.error("Error while disconnecting Stream client:" + error);
    }
  }
};
