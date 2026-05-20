import api from "./api";

export const saleConfigService = {
  getTiers() {
    return api.get("/sale-config");
  },
  updateTiers(tiers) {
    return api.put("/sale-config/tiers", { tiers });
  },
};
