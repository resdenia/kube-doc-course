import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@restickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
