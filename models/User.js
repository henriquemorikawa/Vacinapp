const {
  Schema,
  model
} = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  birthDate: {
    type: String
  },
  zipCode: {
    type: String
  },
  genre: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true,
});

const User = model('User', userSchema);

module.exports = User;