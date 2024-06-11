import express from "express";

import logout from "./logout";
import register from "./register";
import login from "./login";
import getAllParkings from "./getAllParkings";
import getParkingById from "./getParkingById";
import createParking from "./createParking";
import getReservationsByUserId from "./getReservationsByUserId";
import getReservationById from "./getReservationById";
import createReservation from "./createReservation";
import createToken from "./createToken";
import googleAuth from "./googleAuth";

const router = express.Router();

export default (): express.Router => {
  register(router);
  login(router);
  logout(router);
  getAllParkings(router);
  getParkingById(router);
  createParking(router);
  getReservationsByUserId(router);
  getReservationById(router);
  createReservation(router);
  createToken(router);
  googleAuth(router);

  router.get("/", (_, res) => {
    res.send("Parking Reservations API is running!");
  });
  return router;
};
