const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(\+63|0)9\d{9}$/.test(v); // Philippine phone number format
      },
      message: props => `${props.value} is not a valid Philippine phone number!`
    }
  },
  streetAddress: {
    type: String,
    required: true
  },
  municipality: {
    type: String,
    required: true,
    enum: ['Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Santa Cruz', 'Torrijos']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v === this.password;
      },
      message: props => `Passwords don't match!`
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
