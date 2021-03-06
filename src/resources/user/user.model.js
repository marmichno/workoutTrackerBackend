import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    settings: {
      theme: {
        type: String,
        required: true,
        default: 'normal',
      },
    },
  },
  { timestamps: true }
);

userSchema.post('save', function (error, doc, next) {
  const fieldFail = Object.keys(error.keyPattern)[0];
  if (
    fieldFail === 'nickname' &&
    error.name === 'MongoServerError' &&
    error.code === 11000
  ) {
    next(new Error('Nickname already in use'));
  } else if (
    fieldFail === 'email' &&
    error.name === 'MongoServerError' &&
    error.code === 11000
  ) {
    next(new Error('Email already in use'));
  } else {
    next();
  }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = mongoose.model('user', userSchema);
