import express from "express";

import { getReservationsOfSpecifiedUser } from "../controllers/reservations";

export default (router: express.Router) => {
  router.get("/reservations/user/:userId", getReservationsOfSpecifiedUser);
};
