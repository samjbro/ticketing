import { Publisher, Subjects, TicketUpdatedEvent } from "@samcorp/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
