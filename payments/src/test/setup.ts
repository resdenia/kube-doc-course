import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      // <> resolve(return value of string[])
      signin(id?: string): string[];
    }
  }
}
jest.mock('../nats-wrapper'); //redirects to __mocks__/nats-wrapper.ts
process.env.STRIPE_KEY =
  'sk_test_51Gz5N6FwSSqkBSAclqa7WC6gbRGE8H2XWnuAI4LdXWNcUJsFXtYfeLwjUO3PGTd57oO71OtX9LdCSTk8KmDFhbzK00LqL4ygYx';
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'sdsdasdsa';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();

  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a JWT payload {id,email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(), // || mean that we are will you ID if it's declared if not to create new one from mongoose
    email: 'test@test.com',
  };
  //create JWT

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object {jwt: MY_JWT}
  const session = { jwt: token };
  //turn that session into JSON

  const sessionJSON = JSON.stringify(session);

  //take JSON and encode it as base64

  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return a string a cookie with encoded data
  return [`express:sess=${base64}`];
};
