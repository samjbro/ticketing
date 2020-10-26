import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { currentUser } from "@samcorp/common";

const router = express.Router();

router.get("/api/users/currentUser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
