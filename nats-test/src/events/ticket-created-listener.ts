import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from './ticket-created-event';
import { Listener } from './base-listener';
import { Subjects } from './subjects';

//generic type for listener <TicketCreatedEvent>
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // type annotaition as => subject:Subjects.TitcketCreated prevent as to re assign values to subject
  // itself it's good for typization it's suppose to be always to TicketCreated
  //also we can add  type of project readonly we can read docs here: https://www.typescriptlang.org/docs/handbook/classes.html#readonly-modifier
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    msg.ack();
  }
}
