import express from "express";
import {
  createDriver,
  getDriverByEmail,
  getDriverById,
  getDriverByUsername,
} from "../db/drivers";
import { authentication, random } from "../helpers";

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

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Missing required fields",
        })
        .end();
    }

    const driverEmailVerification = await getDriverByEmail(email);
    if (driverEmailVerification) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Email already exists",
        })
        .end();
    }

    const driverUsernameVerification = await getDriverByUsername(fullName);
    if (driverUsernameVerification) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Username already exists",
        })
        .end();
    }

    const passwordRegex = /.{8,}/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Password must contain at least 8 characters.",
        })
        .end();
    }

    const salt = random();
    const hashedPassword = authentication(password, salt);
    const driver = await createDriver({
      username: fullName,
      email,
      authentication: {
        hashedPassword,
        salt,
      },
    });

    res
      .status(200)
      .json({
        driver: {
          id: driver._id.toString(),
          fullName: driver.username,
          email: driver.email,
          createdAt: driver.createdAt,
        },
      })
      .end();
  } catch (err) {
    handleServerError(res, err);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "Missing required fields",
        })
        .end();
    }

    const driver = await getDriverByEmail(email).select(
      "+authentication.hashedPassword +authentication.salt +authentication.sessionToken"
    );
    if (!driver) {
      return res
        .status(404)
        .send({
          status: "error",
          message: "Driver not found",
        })
        .end();
    }

    const hashedPassword = authentication(password, driver.authentication.salt);
    if (hashedPassword !== driver.authentication.hashedPassword) {
      return res
        .status(401)
        .send({
          status: "error",
          message: "Incorrect password",
        })
        .end();
    }

    const salt = random();
    const sessionToken = authentication(salt, driver._id.toString());
    driver.authentication.sessionToken = sessionToken;

    await driver.save();

    res
      .status(200)
      .send({ token: sessionToken, id: driver._id.toString() })
      .end();
  } catch (err) {
    handleServerError(res, err);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const { driverId } = req.body;
    const driver = await getDriverById(driverId).select(
      "+authentication.sessionToken"
    );
    driver.authentication.sessionToken = null;
    await driver.save();

    res
      .status(200)
      .send({
        status: "success",
        message: "Logged out successfully",
      })
      .end();
  } catch (err) {
    handleServerError(res, err);
  }
};
