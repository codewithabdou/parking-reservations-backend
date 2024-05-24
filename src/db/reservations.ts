import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  parkingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

export const ReservationModel = mongoose.model(
  "Reservation",
  ReservationSchema
);

export const getReservations = () => ReservationModel.find();

export const getReservationById = (id: string) => ReservationModel.findById(id);

export const createReservation = (values: Record<string, any>) =>
  new ReservationModel(values).save().then((doc) => doc.toObject());

export const getReservationsByUserId = (driverId: string) =>
  ReservationModel.find({ driverId });

export const getReservationsByParkingId = (parkingId: string) =>
  ReservationModel.find({ parkingId });
