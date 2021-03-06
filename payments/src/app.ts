import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@restickets/common';

import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    //we are checking here if we are doing a test (testing via jest)
    secure: process.env.NODE_ENV !== 'test',
  })
);

//---old---
// app.get('/api/users/currentuser', (req, res) => {
//   res.send('Hi there!!');
// });
//-- new--
// we did router in routes folder of get logic

//async logic

//suppose to de declare after cookie session
app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
