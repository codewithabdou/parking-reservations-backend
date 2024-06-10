import express from "express";

import { createTokenController } from "../controllers/token";

export default (router: express.Router) => {
  router.post("/device-token", createTokenController);
};
