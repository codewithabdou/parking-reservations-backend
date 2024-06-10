import { getDrivers } from "../db/drivers";
import { getToken } from "../db/token";
import { getReservationsByUserId } from "../db/reservations";
import { getParkingById } from "../db/parkings";

var admin = require("firebase-admin");

export const sendNotification = ({
  token,
  title,
  body,
}: {
  token: string;
  title: string;
  body: string;
}) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
  };

  admin
    .messaging()
    .send(message)
    .then((response: any) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error: any) => {
      console.log("Error sending message:", error);
    });
};

export const checkAndSendNotifications = async () => {
  const token = await getToken();
  if (!token) {
    return;
  }
  const drivers: Array<any> = await getDrivers();

  drivers.forEach(async (driver: any) => {
    const reservations = await getReservationsByUserId(driver._id);
    if (reservations) {
      reservations.forEach(async (reservation: any) => {
        const now = new Date();
        const reservationDate = new Date(reservation.startDate);
        const diff = reservationDate.getTime() - now.getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        if (minutes <= 10 && minutes >= 0) {
          const parking: any = await getParkingById(reservation.parkingId);
          sendNotification({
            token: token.token,
            title: "Reservation reminder",
            body: `Your reservation at ${parking.name} is about to start`,
          });
        }
      });
    }
  });
};
