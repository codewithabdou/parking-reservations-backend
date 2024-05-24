import express from "express";

import { getAllParkings } from "../controllers/parkings";

export default (router: express.Router) => {
  router.get("/parkings", getAllParkings);
};
