// This is how the front-end is communicating with the back-end. Different from front-end routes.
const jwt = require('jsonwebtoken');

const router = require('express').Router();
let BankAccount = require('../models/bank-account.model');
let User = require('../models/user.model');
let Cheqbook = require('../models/cheqbook.js');
let sendotp = require('./sendotp.js')

// Find all the users currently in the database.
router.route('/').get((req, res) => {
    User.find().then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

// This database route is used specifically for the Register Page (as seen in src/components/RegisterAccountPage.js).
// This is how the data is being pushed to the database.
router.route('/add').post(async (req, res) => {
    try {
console.log(req.body)
        const otptoken = req.header('otp-token')
        let otp;
        if (!otptoken) {
            return res.status(403).send({ message: "No token provided" });
        }

        otp = await jwt.verify(otptoken, 'moiz2194')
        console.log(otp)

        if (req.body.otp !== otp.otp) {
            return res.status(405).json({ message: "wrong or expired otp" })
        }
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const chequeId = Math.floor(100000 + Math.random() * 900000);
        const accounts =
            [
                new BankAccount({ id: Math.floor(100000 + Math.random() * 900000), chequeId: `${chequeId}-1` }),
                new BankAccount({ id: Math.floor(100000 + Math.random() * 900000), chequeId: `${chequeId}-2`, accType: "savings" })
            ]

        const newUser = new User(
            {
                firstName,
                lastName,
                email,
                password,
                accounts
            }
        );
        newUser.save().then(async (newUser) => {
            const cheqbookPromises = Array.from({ length: 100 }, (_, i) => Cheqbook.create({
                user_id: newUser._id,
                used: false,
                page: i + 1,
                amount: "",
                firstName: "",
                lastName: ""
            }));
            await Promise.all(cheqbookPromises);
            res.json('User added!');
        })

            .catch(err => res.status(400).json('Error: ' + err));


    } catch (error) {
        res.status(500).json({ message: error.message })
    }

});
// get otp
router.post('/otp', async (req, res, next) => {
    try {
        const otp = otpGenerator.generate(6, { specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
        sendotp(otp, req.body.email)
        const token = jwt.sign({ otp }, 'moiz2194', { expiresIn: '1m' });
        res.status(200).send({ success: true, token })
    } catch (error) {
        res.status(200).send({ message: error.message })

    }

})

// Find a user by their specific MongoDB generated ID.
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a user that matches the specific MongoDB generated ID.
router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update').post((req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.accounts = req.body.accounts;

            user.save()
                .then(() => res.json("User updated!"))
                .catch((err) => res.status(400).json('Error: ' + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

// Transfer money from one account to another using ChequeID. 
router.route('/transfer').post(async (req, res) => {
    // Find the user whos account contains the chequeID.
    const senderUser = await User.find({ accounts: { $elemMatch: { chequeId: req.body.chequeId } } });
    // Find the user whos receiving the money by the account Id
    const receiverUser = await User.find({ accounts: { $elemMatch: { id: req.body.accountId } } });

    console.log(senderUser);
    console.log(receiverUser);

    if (senderUser.length === 0 || receiverUser.length === 0) {
        res.status(400).json('Error: User not found');
    }

    // Find the account that contains the chequeID.
    senderAccount = senderUser[0].accounts.find(account => account.chequeId === req.body.chequeId);
    // Find the account that contains the accountId.
    receiverAccount = receiverUser[0].accounts.find(account => account.id === req.body.accountId);

    if (senderAccount === undefined || receiverAccount === undefined) {
        res.status(400).json('Error: Account not found');
    }

    // Check if the sender has enough money to transfer.
    if (senderAccount.balance < req.body.amount) {
        res.status(400).json('Error: Insufficient funds');
    }
    else {
        const senderAccIndex = senderAccount.accType === "savings" ? 1 : 0;
        const receiverAccIndex = receiverAccount.accType === "savings" ? 1 : 0;

        senderUser[0].accounts[senderAccIndex] = new BankAccount(
            {
                id: senderAccount.id,
                chequeId: senderAccount.chequeId,
                accType: senderAccount.accType,
                balance: senderAccount.balance - req.body.amount
            }
        );

        receiverUser[0].accounts[receiverAccIndex] = new BankAccount(
            {
                id: receiverAccount.id,
                chequeId: receiverAccount.chequeId,
                accType: receiverAccount.accType,
                balance: receiverAccount.balance + req.body.amount
            }
        );

        // // Update the sender's account balance.
        // senderAccount.balance -= req.body.amount;
        // // Update the receiver's account balance.
        // receiverAccount.balance += req.body.amount;

        // Save the changes to the database.
        senderUser[0].save();
        receiverUser[0].save();

        res.json({ user: receiverUser[0] });
    }
});
module.exports = router;