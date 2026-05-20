import api from "./api";

export const lookbookService = {
  getStories() {
    return api.get("/lookbook");
  },
  getAllStories() {
    return api.get("/lookbook/admin");
  },
  create(data) {
    return api.post("/lookbook", data);
  },
  update(id, data) {
    return api.put(`/lookbook/${id}`, data);
  },
  remove(id) {
    return api.delete(`/lookbook/${id}`);
  },
};
