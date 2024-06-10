import express from "express";

import { createToken, deleteAllTokens } from "../db/token";

export const createTokenController = async (
  req: express.Request,
  res: express.Response
) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).send({ error: "Missing required fields" }).end();
    return;
  }

  try {
    await deleteAllTokens();
    await createToken({ token });
    res.status(201).send(token).end();
  } catch (err) {
    res.status(500).send({ error: err.message }).end();
  }
};
