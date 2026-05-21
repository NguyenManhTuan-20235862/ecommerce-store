import api from "./api";

export const storeService = {
  getStores() {
    return api.get("/stores");
  },
  getAllStores() {
    return api.get("/stores/admin");
  },
  create(data) {
    return api.post("/stores", data);
  },
  update(id, data) {
    return api.put(`/stores/${id}`, data);
  },
  remove(id) {
    return api.delete(`/stores/${id}`);
  },
};
