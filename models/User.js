const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: 'string',
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: 'string',
      unique: true,
      required: true,
      validate: {
        validator: () => Promise.resolve(false),
        message: 'Email validation failed',
      },
    },
    thoughts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = mongoose.model('user', userSchema);

module.exports = User;
