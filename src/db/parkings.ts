import mongoose from "mongoose";

const ParkingSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  totalPlaces: { type: Number, required: true },
  freePlaces: { type: Number, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  photoUrl: { type: String, required: true },
  description: { type: String, required: true },
});

export const ParkingModel = mongoose.model("Parking", ParkingSchema);

export const getParkings = () => ParkingModel.find();
export const getParkingById = (id: string) => ParkingModel.findById(id);
export const createParking = (values: Record<string, any>) =>
  new ParkingModel(values).save().then((doc) => doc.toObject());
