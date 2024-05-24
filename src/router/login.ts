import { login } from "../controllers/authentication";
import express from "express";

export default (router: express.Router) => {
  router.post("/auth/login", login);
};
