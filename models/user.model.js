
/*
* The structure of all the information being stored into the database. When viewing the data in the database, it will take the following format:
*   "_id": "63c49cff5cc36d8b2fb0523e",
		"firstName": "react",
		"lastName": "component",
		"email": "react-component@hotmail.com",
		"password": "123456789abcd",
		"accounts": [
			{
				"id": 971734,
				"accType": "chequings",
				"balance": 0,
				"_id": "63c49cff5cc36d8b2fb0523d"
			}
		],
		"createdAt": "2023-01-16T00:40:31.313Z",
		"updatedAt": "2023-01-16T00:40:31.313Z",
		"__v": 0
	},
*/
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema
({
    firstName:
    {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 2
    },
    lastName:
    {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 2
    },
    email:
    {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password:
    {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 8
    },
    accounts:
    {
        // References the bank-account.model.js schema.
        type: Schema.Types.Array,
        ref: 'BankAccount'
    }
    
},
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;