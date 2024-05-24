import express from "express";

import { logout } from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/logout", logout);
};
