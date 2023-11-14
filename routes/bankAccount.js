const router = require('express').Router();
const jwt = require('jsonwebtoken');
let BankAccount = require('../models/bank-account.model');
let Cheqbook = require('../models/cheqbook.js');

let User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

router.route('/sendMoney/:email').post(async (req, res) => {
    if (req.body === null || req.body === undefined) {
        return res.status(400).json("Error: No data in the body.");
    }

    const userEmailSendingMoney = req.params.email;
    const userEmailReceivingMoney = req.body.email;

    await User.findOne({ email: userEmailSendingMoney })
        .then(user => {
            if (user.accounts[0].balance < req.body.amount) {
                return res.status(400).json("Error: Not enough money in " + user.accounts[0].accType + " account.");
            }

            User.findOne({ email: userEmailReceivingMoney })
                .then(recipient => {
                    if (recipient.email === user.email) {
                        return res.status(400).json("Error: You cannot send money to yourself.");
                    }

                    user.accounts[0] = new BankAccount(
                        {
                            id: user.accounts[0].id,
                            chequeId: user.accounts[0].chequeId,
                            accType: user.accounts[0].accType,
                            balance: user.accounts[0].balance - req.body.amount
                        }
                    );

                    recipient.accounts[0] = new BankAccount(
                        {
                            id: recipient.accounts[0].id,
                            chequeId: recipient.accounts[0].chequeId,
                            accType: recipient.accounts[0].accType,
                            balance: recipient.accounts[0].balance + req.body.amount
                        }
                    );

                    user.save();
                    recipient.save().then(() => res.json(user.firstName + " has sent $" + req.body.amount + " to " + recipient.firstName))
                        .catch(err => res.status(400).json('Error: ' + err));

                }).catch(err => res.status(400).json('Error: ' + err));

        }).catch(err => res.status(400).json('Error: ' + err));
});


router.route('/addTrans').post(async (req, res) =>
{
    if (req.body === null || req.body === undefined) return;

    const email = req.body.email;
    const accType = req.body.accType;
    const transType = req.body.transType;
    const isDeduct = req.body.isDeduct;
    const amount = req.body.amount;

    const newTransaction = new Transaction({email: email, accType: accType, transType: transType, isDeduct: isDeduct, amount: amount})
    newTransaction.save().then(() => res.json("Added a " + transType + " transaction to the " + accType + " account."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route('/getTrans').get((req, res) => 
{
    Transaction.find().then(trans => res.json(trans))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/deleteTrans/:id').delete((req, res) => 
{
    Transaction.findByIdAndDelete(req.params.id)
        .then(() => res.json('Transaction deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/deleteTrans').delete((req, res) =>
{
    Transaction.deleteMany().then(() => res.json("All transaction data deleted!"))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/depositcheque').post(async (req, res) => {
    try {
        const token = req.header('token');
        const data = jwt.verify(token, 'v6jmSuatYPw5Njr6r4ANWWQq');
        console.log(data.id);
        const me = await User.findById(data.id);
        const { firstName, lastName, chequeId, amount, page, accountType } = req.body;
        console.log(req.body);
        const userone = await User.findOne({ 'accounts.chequeId': chequeId});
        if (!userone) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(userone.firstName!==firstName || userone.lastName!==lastName){
            console.log(userone.firstName,firstName)
            console.log(userone.lastName,lastName)
            return res.status(404).json({ message: 'User not verified' });
        }
        const Cheq=await Cheqbook.findOne({user_id:userone._id,page});
        if(Cheq.used===true){
            return res.status(404).json({ message: 'Cheque has already been deposited' });
        }
        let userAccount;
        userone.accounts.forEach(element => {
            if (element?.chequeId === chequeId) {
                userAccount = element
            }
        });
        if (!userAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (userAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance of account' });
        }
        userAccount.balance -= Number(amount);
        const myAccount = me.accounts.find(account => account?.accType === accountType);
        if (!myAccount) {
            console.log('my account not found', myAccount)
        } else {
            myAccount.balance += Number(amount);
        }
        
        const savedMe = await me.save();
        const savedUserone = await userone.save();
        await User.findByIdAndUpdate(savedMe._id,{
            accounts:savedMe.accounts
        })
        await User.findByIdAndUpdate(savedUserone._id,{
            accounts:savedUserone.accounts
        })
        await Cheqbook.findByIdAndUpdate(Cheq._id,{
            used:true,
            amount
        });

        res.status(200).json({ success: true, message: 'Successfully Deposited' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;