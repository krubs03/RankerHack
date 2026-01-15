import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "rankerhack" });

const syncUserData = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();
      console.log("Event data:", event.data);

      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profilePicture: image_url || "",
      };

      await User.create(newUser);
      await upsertStreamUser({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        image: newUser.profilePicture,
      });
    } catch (err) {
      console.error("syncUserData failed:", err);
      // Prevent Inngest from marking as FUNCTION_INVOCATION_FAILED
      return { error: err.message };
    }
  }
);

const deleteUserData = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();
      console.log("Delete event data:", event.data);

      const { id } = event.data;
      if (!id) {
        throw new Error("Missing user ID in clerk/user.deleted event");
      }

      // Delete from Mongo
      const result = await User.deleteOne({ clerkId: id });
      console.log(`Mongo delete result:`, result);

      // Delete from Stream
      await deleteStreamUser(id.toString());

      return { success: true, deletedUserId: id };
    } catch (err) {
      console.error("deleteUserData failed:", err);
      // Return a safe object so Inngest doesn’t just mark it as FUNCTION_INVOCATION_FAILED
      return { error: err.message };
    }
  }
);

//TODO: Send email after user sign-up

export const functions = [syncUserData, deleteUserData];
