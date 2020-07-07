import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
// ----moved to app.ts
// import express from 'express';
// import 'express-async-errors';
// import { json } from 'body-parser';
// import mongoose from 'mongoose';
// import cookieSession from 'cookie-session';
// import { currentUserRouter } from './routes/current-user';
// import { signupRouter } from './routes/signup';
// import { signinRouter } from './routes/signin';
// import { signoutRouter } from './routes/signout';
// import { errorHandler } from './middlewares/error-handler';
// import { NotFoundError } from './errors/not-found-error';
// const app = express();
// app.set('trust proxy', true);
// app.use(json());
// app.use(
//   cookieSession({
//     signed: false,
//     secure: true,
//   })
// );

// //---old---
// // app.get('/api/users/currentuser', (req, res) => {
// //   res.send('Hi there!!');
// // });
// //-- new--
// // we did router in routes folder of get logic

// app.use(currentUserRouter);
// app.use(signinRouter);
// app.use(signoutRouter);
// app.use(signupRouter);

// //async logic
// app.all('*', async (req, res) => {
//   throw new NotFoundError();
// });

// app.use(errorHandler);

const startUP = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY suppose to be define');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI suppose to be define');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID suppose to be define');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL suppose to be define');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID suppose to be define');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    //if we put name (example auth) mongo creates db automaticly
    await mongoose.connect(process.env.MONGO_URI, {
      //option from mongoose
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongoDB');
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

startUP();
