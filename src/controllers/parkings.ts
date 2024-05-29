import { createParking, getParkingById, getParkings } from "../db/parkings";
import express from "express";

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

export const getAllParkings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await getParkings();

    const parkings = data.map((parking) => {
      return {
        id: parking._id,
        name: parking.name,
        address: parking.address,
        latitude: parking.latitude,
        longitude: parking.longitude,
        totalPlaces: parking.totalPlaces,
        freePlaces: parking.freePlaces,
        price: parking.price,
        rating: parking.rating,
        photoUrl: parking.photoUrl,
        description: parking.description,
      };
    });

    res.status(200).send(parkings);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const getSingleParking = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await getParkingById(req.params.id);
    const parking = {
      id: data._id,
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      totalPlaces: data.totalPlaces,
      freePlaces: data.freePlaces,
      price: data.price,
      rating: data.rating,
      photoUrl: data.photoUrl,
      description: data.description,
    };
    if (!parking) {
      return res
        .status(404)
        .send({
          status: "error",
          message: "Parking not found",
        })
        .end();
    }
    res.status(200).send(parking);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const createNewParking = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      totalPlaces,
      freePlaces,
      price,
      rating,
      photoUrl,
      description,
    } = req.body;
    if (
      !name ||
      !address ||
      !latitude ||
      !longitude ||
      !totalPlaces ||
      !freePlaces ||
      !price ||
      !rating ||
      !photoUrl ||
      !description
    ) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Missing required fields",
        })
        .end();
    }
    const parking = await createParking({
      name,
      address,
      latitude,
      longitude,
      totalPlaces,
      freePlaces,
      price,
      rating,
      photoUrl,
      description,
    });
    res.status(201).send({
      status: "success",
      data: parking,
    });
  } catch (err) {
    handleServerError(res, err);
  }
};
