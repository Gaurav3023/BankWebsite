const router = require('express').Router();
let BankAccount = require('../models/bank-account.model');
let User = require('../models/user.model');

// Pushes a brand new BankAccount (chequings, savings, credit-card, etc) to the user that has the matching email.
router.route('/new').post(async (req, res) =>
{
    if (req.body === null || req.body === undefined) return;

    const email = req.body.email;
    const accountID = req.body.accType === "credit-card" ? 3990000000000000 + Math.floor(100000000000 + Math.random() * 900000000000) : Math.floor(100000 + Math.random() * 900000)
    const newBankAccount = new BankAccount({id: accountID, accType: req.body.accType});

    await User.findOne({email: email})
    .then(user =>
        {
            user.accounts.push(newBankAccount);

            user.save().then(() => res.json("Added " + req.body.accType + " account to the user!"))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

// Grab all the user's current BankAccounts.
router.route('/get/:email').get((req, res) =>
{
    User.findOne({email: req.params.email})
    .then(user => res.json(user.accounts))
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;