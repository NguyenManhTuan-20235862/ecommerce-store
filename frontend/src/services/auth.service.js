import api from "./api";

export const authService = {
  signUp(payload) {
    return api.post("/auth/signup", payload);
  },
  signIn(payload) {
    return api.post("/auth/signin", payload);
  },
  signOut() {
    return api.post("/auth/signout");
  },
  me() {
    return api.get("/users/me");
  },
};
