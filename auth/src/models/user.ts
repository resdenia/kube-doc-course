import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has (ex. build function)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a user Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      // in mongoose we suppose to declare type as 'String' with capital letter
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    //to edit user onject in better data ex from _id to id
    toJSON: {
      transform(doc, ret) {
        //we are makeing direct changes in json of registering users
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//hashing password with middleware function(pre) in mongoose
//and we suppose to use function in that middleware cause we want to use this reference.
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

//that way how we adding custom function to mongoose model
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
// INFO  <UserDoc, UserModel> this its generic typescript syntax it's mean types being provided to a
// functions as arguments and that model() return last element of types in our case it will be UserModel
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

//that little step helps as to prevent typo issue, we are checking now attrs via interface(with TS logic)
// but we will rewrite  that function after refactor we will include
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
