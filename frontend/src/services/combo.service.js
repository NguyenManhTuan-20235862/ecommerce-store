import api from "./api";

export const comboService = {
  getAll() {
    return api.get("/combos");
  },
  getAdmin() {
    return api.get("/combos/admin");
  },
  create(data) {
    return api.post("/combos", data);
  },
  update(id, data) {
    return api.put(`/combos/${id}`, data);
  },
  remove(id) {
    return api.delete(`/combos/${id}`);
  },
};
