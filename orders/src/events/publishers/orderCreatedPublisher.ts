import { OrderCreatedEvent, Publisher, Subjects } from "@samcorp/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
