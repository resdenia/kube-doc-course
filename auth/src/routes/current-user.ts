import express from 'express';
import { currentUser } from '@restickets/common';
// import { requireAuth } from '../middlewares/require-auth';
const router = express.Router();
//currentUser middleware
router.get('/api/users/currentuser', currentUser, (req, res) => {
  //--- we comment everythin cause we added middleware what was made out code easier(middleware-> currentUser) ----
  // //  if (!req.session || !req.session.jwt) {
  // //or
  // if (!req.session?.jwt) {
  //   //question mark shows as to do another check it's shortcut as we wrote in a top
  //   return res.send({ currentUser: null });
  // }
  // try {
  //   const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
  //   //we added try/catch to handle an error if jwt have some problems or JWT_KEY
  //   res.send({ currentUser: payload });
  // } catch (err) {
  //   res.send({ currentUser: null });
  // }
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
