import { Publisher, OrderCreatedEvent, Subjects } from '@restickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

// new OrderCreatedPublisher(natsClient).publish({})
