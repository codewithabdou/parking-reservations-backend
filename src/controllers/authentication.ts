import express from "express";
import {
  createDriver,
  getDriverByEmail,
  getDriverById,
  getDriverByUsername,
} from "../db/drivers";
import { authentication, random } from "../helpers";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID =
  "868166821322-q3qeajtaosbno62in98kqa715jf9fac2.apps.googleusercontent.com";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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

async function verifyToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const googleAuthController = async (
  req: express.Request,
  res: express.Response
) => {
  const { tokenId } = req.body;

  try {
    const userInfo = await verifyToken(tokenId);

    if (userInfo) {
      const newEmail = userInfo.email + "googleAuth";
      const driverEmailVerification = await getDriverByEmail(newEmail);
      if (driverEmailVerification) {
        try {
          const salt = random();
          const sessionToken = authentication(
            salt,
            driverEmailVerification._id.toString()
          );
          driverEmailVerification.authentication.sessionToken = sessionToken;

          await driverEmailVerification.save();

          res
            .status(200)
            .send({
              token: sessionToken,
              id: driverEmailVerification._id.toString(),
            })
            .end();
        } catch (err) {
          handleServerError(res, err);
        }
      } else {
        try {
          const fullName = userInfo.name;
          const email = newEmail;
          const password = tokenId;

          const salt = random();
          const hashedPassword = authentication(password, salt);
          await createDriver({
            username: fullName,
            email,
            authentication: {
              hashedPassword,
              salt,
            },
          });
          const driverEmailVerificationNew = await getDriverByEmail(newEmail);

          const sessionToken = authentication(
            salt,
            driverEmailVerificationNew._id.toString()
          );
          driverEmailVerificationNew.authentication.sessionToken = sessionToken;

          await driverEmailVerificationNew.save();

          res
            .status(200)
            .send({
              token: sessionToken,
              id: driverEmailVerificationNew._id.toString(),
            })
            .end();
        } catch (err) {
          handleServerError(res, err);
        }
      }
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
