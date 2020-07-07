import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  //we should declare done if we should invoke manually if we want to specifically tell jest we are done with our test
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  //Save the ticket to the database
  await ticket.save();
  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  //make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 100 });
  secondInstance!.set({ price: 15 });
  //save the first fetched ticket
  await firstInstance!.save();
  //save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    //we should declare done if we should invoke manually if we want to specifically tell jest we are done with our test

    return done();
  }
  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'sss',
    price: 20,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
