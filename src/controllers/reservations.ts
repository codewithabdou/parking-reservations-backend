import express from "express";

import {
  getReservationsByUserId,
  getReservationById,
  createReservation,
} from "../db/reservations";
import { getDriverById } from "../db/drivers";
import { getParkingById } from "../db/parkings";
import { compareDates, formatDate } from "../helpers";

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
    const { parkingId, driverId, startDate, endDate } = req.body;

    const validDates = compareDates(startDate, endDate);

    if (validDates !== -1) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Invalid dates",
        })
        .end();
    }

    const driver = await getDriverById(driverId);
    const parking = await getParkingById(parkingId);

    if (parking.freePlaces <= 0) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "No free places in this parking",
        })
        .end();
    }

    if (!driver || !parking) {
      return res
        .status(404)
        .send({
          status: "error",
          message: "Driver or Parking does not exist",
        })
        .end();
    }
    const data = await createReservation({
      parkingId,
      driverId,
      startDate,
      endDate,
    });

    const formattedStartDate = formatDate(data.startDate);
    const formattedEndDate = formatDate(data.endDate);

    const reservation = {
      id: data._id,
      parkingId: data.parkingId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      parkingName: parking.name,
      parkingPhotoUrl: parking.photoUrl,
      parkingAddress: parking.address,
      userId: driverId,
    };

    parking.freePlaces -= 1;
    await parking.save();

    res.status(201).send(reservation);
  } catch (error) {
    handleServerError(res, error);
  }
};
