import api from "./axios";

// Get All Announcements
export const getAnnouncements = async () => {
  const response = await api.get("/announcements");
  return response.data.announcements;
};

// Add Announcement
export const addAnnouncement = async (announcementData) => {
  const response = await api.post("/announcements", announcementData);
  return response.data;
};

// Update Announcement
export const updateAnnouncement = async (id, announcementData) => {
  const response = await api.put(`/announcements/${id}`, announcementData);
  return response.data;
};

// Delete Announcement
export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};