const {
  Schema,
  model,
  Types
} = require('mongoose');

const vaccineSchema = new Schema({
  types: {
    type: String,
    required: true,
    enum: ['bcg', 'hepatite b', 'penta', 'poliomielite 1', 'poliomielite 2', 'pneumococica 10', 'rotavirus humano', 'meningococica c', 'febre amarela', 'triplice viral', 'dtp', 'hepatite a', 'tetra viral', 'varicela atenuada', 'hpv', 'dupla adulto', 'pneumococica 23', 'influenza', 'dtpa']
  },
  date: {
    type: Date
  },
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true,
});

const Vaccine = model('Vaccine', vaccineSchema);

module.exports = Vaccine;