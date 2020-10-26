import { requireAuth, validateRequest } from "@samcorp/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

const validation = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price")
    .not()
    .isEmpty()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
];

router.post(
  "/api/tickets",
  requireAuth,
  validation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
