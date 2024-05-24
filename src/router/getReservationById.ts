import { getSingleReservation } from "../controllers/reservations";
import express from "express";

export default (router: express.Router) => {
  router.get("/reservations/:id", getSingleReservation);
};
