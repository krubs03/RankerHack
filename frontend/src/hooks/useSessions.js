import { useQuery, useMutation } from "@tanstack/react-query";
import { sessionApi } from "../api/sessions";
import toast from "react-hot-toast";

// Tanstack => Better querying and flexibility
// Mutation => Post, Put, Delete
// Query => Get

export const useCreateSession = () => {
  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to created session."),
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });
};

export const useRecentSessions = () => {
  return useQuery({
    queryKey: ["recentSessions"],
    queryFn: sessionApi.getRecentSessions,
  });
};

export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session-", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id, // To run this only if id is present
  });
};

export const useJoinSession = () => {
  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to join session."),
  });
};

export const useEndSession = () => {
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to end session.")
  });
};
