import { PaymentCreatedEvent, Publisher, Subjects } from "@samcorp/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
