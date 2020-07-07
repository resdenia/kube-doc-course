import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { NotFoundError, errorHandler } from '@restickets/common';

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//async logic
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
