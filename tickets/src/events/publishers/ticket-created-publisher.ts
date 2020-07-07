import { Publisher, Subjects, TicketCreatedEvent } from '@restickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

// new TicketCreatedPublisher()
