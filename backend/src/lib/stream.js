import { StreamChat } from 'stream-chat';
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Missing Stream API Key or Secret");
}

export const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Upsert => Create + Update
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    console.log(`Upserted Stream user with ID: ${userData.id}`);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log(`Deleted Stream user with ID: ${userId}`);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};