/*
*   Used in the bank-account.model.js schema. This is not meant to be used alone!
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema
({
    email:
    {
        type: String,
        lowercase: true,
        required: true,
        unique: false,
        trim: true,
        minlength: 5
    },
    accType:
    {
        type: String,
        lowercase: true,
        required: false,
        trim: true,
        default: 'chequings',
        enum: ['chequings', 'savings', 'credit-card', 'business', 'student']
    },
    date:
    {
        type: Date,
        required: false,
        unique: false,
        min: '2000-01-01',
        max: '2999-12-31',
        default: Date.now
    },
    transType:
    {
        type: String,
        lowercase: true,
        required: false,
        trim: true,
        default: 'deposit',
    },
    isDeduct:
    {
        type: Boolean,
        required: false,
        default: false
    },
    amount:
    {
        type: Number,
        required: false,
        unique: false,
        min: -99999999,
        max: 999999999,
        default: 0,
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;