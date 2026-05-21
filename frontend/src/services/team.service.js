import api from "./api";

export const teamService = {
  getMembers() {
    return api.get("/team");
  },
  getAllMembers() {
    return api.get("/team/admin");
  },
  create(data) {
    return api.post("/team", data);
  },
  update(id, data) {
    return api.put(`/team/${id}`, data);
  },
  remove(id) {
    return api.delete(`/team/${id}`);
  },
};
