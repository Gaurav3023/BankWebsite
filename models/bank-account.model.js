/*
*   Used in the user.model.js schema. This is not meant to be used alone!
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bankAccountSchema = new Schema
({
    id:
    {
        type: Number,
        required: true,
        unique: true,
        min: 0,
        max: 999999,
        validate: 
        {
            validator: Number.isInteger,
            message: 'Invalid ID. {VALUE} is not an integer.'
        }
    },
    chequeId:
    {
        type: String,
        required: true,
        unique: true,
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
    balance:
    {
        type: Number,
        required: false,
        unique: false,
        min: -99999999,
        max: 999999999,
        default: 0,
        validate: 
        {
            validator: Number.isInteger,
            message: 'Invalid balance. {VALUE} is not an integer.'
        }
    }
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
module.exports = BankAccount;