import express from "express";

import { createNewReservation } from "../controllers/reservations";

export default (router: express.Router) => {
  router.post("/reservations", createNewReservation);
};
