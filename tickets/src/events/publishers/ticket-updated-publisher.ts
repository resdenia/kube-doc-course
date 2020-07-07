import { Publisher, Subjects, TicketUpdatedEvent } from '@restickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

// new TicketCreatedPublisher()
