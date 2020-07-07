//import nats, { Message, Stan } from 'node-nats-streaming';
import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
//stan
// 123 it's name of client (made for scale horizontally we can add clients not cpu  for handeling events)
const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener  connected to NATS');

  client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  //setManuAckMode
  // where ACK is https://docs.nats.io/nats-concepts/acks
  //Acknowledgements - подтверждение
  //it mean that we need to make manual approve event
  // UPD: we added class that will handle that section
  // const options = client
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('accounting-service'); // build durable subscription that option help to recond all subscrptions on nat streaming

  // queue group second attribute in subscribe
  // UPD: we added class that will handle that section
  // const subscription = client.subscribe(
  //   'ticket:created',
  //   'queue-group-name',
  //   options
  // );
  // UPD: we added class that will handle that section

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`received event #${msg.getSequence()}, with data: ${data}`);
  //   }
  //   //approved event
  //   msg.ack();
  // });

  new TicketCreatedListener(client).listen();
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
