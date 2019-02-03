const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    days: {type: mongoose.Schema.Types.Number, require: true},
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car'},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Rent = mongoose.model('Rent', rentSchema);

module.exports = Rent;