import express from "express";

import {
  getReservationsByUserId,
  getReservationById,
  createReservation,
} from "../db/reservations";
import { getDriverById } from "../db/drivers";
import { getParkingById } from "../db/parkings";

const handleServerError = (res: express.Response, err: any) => {
  console.log(err);
  res
    .status(500)
    .send({
      status: "error",
      message: "Internal Server Error",
    })
    .end();
};

export const getReservationsOfSpecifiedUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const reservations = await getReservationsByUserId(userId);
    res.status(200).send({
      status: "success",
      data: reservations,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getSingleReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const reservation = await getReservationById(req.params.id);
    if (!reservation) {
      return res
        .status(404)
        .send({
          status: "error",
          message: "Reservation not found",
        })
        .end();
    }
    res.status(200).send({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const createNewReservation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { parkingId, driverId, startTime, endTime } = req.body;
    const reservation = await createReservation({
      parkingId,
      driverId,
      startTime,
      endTime,
    });

    const driver = await getDriverById(driverId);
    const parking = await getParkingById(parkingId);
    if (!driver || !parking) {
      return res
        .status(404)
        .send({
          status: "error",
          message: "Driver or Parking does not exist",
        })
        .end();
    }

    res.status(201).send({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};
