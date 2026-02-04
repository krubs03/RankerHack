import instance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await instance.post("/api/sessions", data);
    return response.data;
  },
  getActiveSessions: async () => {
    const response = await instance.get("/api/sessions/active");
    return response.data;
  },
  getRecentSessions: async () => {
    const response = await instance.get("/api/sessions/recent");
    return response.data;
  },
  getSessionById: async (id) => {
    const response = await instance.get(`/api/sessions/${id}`);
    return response.data;
  },
  joinSession: async (id) => {
    const response = await instance.post(`/api/sessions/${id}/join`);
    return response.data;
  },
  endSession: async (id) => {
    const response = await instance.post(`/api/sessions/${id}/end`);
    return response.data;
  },
  getStreamToken: async () => {
    const response = await instance.get("/api/chat/token");
    return response.data;
  },
};
