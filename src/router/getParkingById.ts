import express from "express";
import { getSingleParking } from "../controllers/parkings";

export default (router: express.Router) => {
  router.get("/parkings/:id", getSingleParking);
};
