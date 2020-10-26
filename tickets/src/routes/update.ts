import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@samcorp/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

const validation = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
];

router.put(
  "/api/tickets/:id",
  requireAuth,
  validation,
  validateRequest,
  async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new NotFoundError();

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.orderId)
      throw new BadRequestError("Cannot edit a reserved ticket");

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
