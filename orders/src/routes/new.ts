import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@samcorp/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/orderCreatedPublisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const validation = [
  body("ticketId")
    .not()
    .isEmpty()
    // Remove this, as it assumes the ticket service is using mongodb
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided"),
];

router.post(
  "/api/orders",
  requireAuth,
  validation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
