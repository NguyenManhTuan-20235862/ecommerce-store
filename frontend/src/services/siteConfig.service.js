import api from "./api";

export const siteConfigService = {
  getConfig() {
    return api.get("/about-config");
  },
  updateConfig(data) {
    return api.put("/about-config", data);
  },
};
