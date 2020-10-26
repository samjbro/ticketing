import { OrderCancelledEvent, Publisher, Subjects } from "@samcorp/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
