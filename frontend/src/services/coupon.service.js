import api from "./api";

export const couponService = {
  validate(code, orderAmount) {
    return api.post("/coupons/validate", { code, orderAmount });
  },
  list() {
    return api.get("/coupons");
  },
  create(data) {
    return api.post("/coupons", data);
  },
  update(id, data) {
    return api.put(`/coupons/${id}`, data);
  },
  remove(id) {
    return api.delete(`/coupons/${id}`);
  },
};
