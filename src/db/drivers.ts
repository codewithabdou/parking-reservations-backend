import mongoose from "mongoose";

const AuthenticationSchema = new mongoose.Schema(
  {
    hashedPassword: {
      type: String,
      required: true,
      select: false,
    },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false, default: null },
  },
  { _id: false }
);

const DriverSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  authentication: { type: AuthenticationSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DriverModel = mongoose.model("Driver", DriverSchema);

export const getDrivers = () => DriverModel.find();
export const getDriverById = (id: string) => DriverModel.findById(id);
export const getDriverByEmail = (email: string) =>
  DriverModel.findOne({ email });
export const getDriverByUsername = (username: string) =>
  DriverModel.findOne({ username });
export const getDriverBySessionToken = (sessionToken: string) =>
  DriverModel.findOne({ "authentication.sessionToken": sessionToken });
export const createDriver = (values: Record<string, any>) =>
  new DriverModel(values).save().then((doc) => doc.toObject());
export const deleteDriverById = (id: string) =>
  DriverModel.findByIdAndDelete(id);
export const updateDriverById = (id: string, values: Record<string, any>) =>
  DriverModel.findByIdAndUpdate(id, values, { new: true });
