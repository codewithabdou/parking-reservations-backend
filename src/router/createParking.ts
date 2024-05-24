import express from "express";

import { createNewParking } from "../controllers/parkings";

export default (router: express.Router) => {
  router.post("/parkings", createNewParking);
};
