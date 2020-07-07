import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../services/password';
import { BadRequestError, validateRequest } from '@restickets/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You musy apply password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //we added middleware thats why we don't need to check errors in that stage
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    //Generate JWT
    //https://www.npmjs.com/package/jsonwebtoken
    // if(!process.env.JWT_KEY){
    //   throw new Error('jwt_key do not dispaly');
    // }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // !- explanaition to typescript that we already check in index.ts that variable already existing
    );

    //Store it on session object
    //@ts-ignore
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
