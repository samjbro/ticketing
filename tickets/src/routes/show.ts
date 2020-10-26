import { NotFoundError } from "@samcorp/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new NotFoundError();
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  res.send(ticket);
});

export { router as showTicketRouter };
