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

export const useJoinSession = (id) => {
  return useMutation({
    mutationKey: ["joinSession-", id],
    mutationFn: () => sessionApi.joinSession(id),
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to join session."),
    enabled: !!id,
  });
};

export const useEndSession = (id) => {
  return useMutation({
    mutationKey: ["endSession-", id],
    mutationFn: () => sessionApi.endSession(id),
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to end session."),
    enabled: !!id,
  });
};
