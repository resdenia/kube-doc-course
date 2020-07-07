import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';

import jwt from 'jsonwebtoken';
// import { RequestValidationError } from '../errors/request-validation-error';
// import { DatabaseConnectionError } from '../errors/database-connection-error';
import { BadRequestError, validateRequest } from '@restickets/common';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be betwenn 4 and 20 chars.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //---final desigion to remove errors cause we added middleware => validation error
    // fix errors for typization in ts
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   // automaticly using error-handler.ts cause we are declare it in index.ts (app.use(errorHandler))
    //   // throw new Error('Invalid email or password');
    //   throw new RequestValidationError(errors.array());
    // }
    // const { email, password } = req.body;
    // console.log('Create a user...');
    // throw new DatabaseConnectionError();
    // res.send({});

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log('Email in use');
      // return res.send({});
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    //Generate JWT
    //https://www.npmjs.com/package/jsonwebtoken
    // if(!process.env.JWT_KEY){
    //   throw new Error('jwt_key do not dispaly');
    // }
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // !- explanaition to typescript that we already check in index.ts that variable already existing
    );

    //Store it on session object
    //@ts-ignore
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
