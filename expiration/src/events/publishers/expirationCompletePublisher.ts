import { ExpirationCompleteEvent, Publisher, Subjects } from "@samcorp/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
