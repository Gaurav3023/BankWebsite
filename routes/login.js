const router = require('express').Router();
const jwt = require('jsonwebtoken');

let User = require('../models/user.model');
let sendotp = require('./sendotp.js')
const otpGenerator = require('otp-generator')

// This route is used specifically for the Login Page (as seen in src/components/LoginAccountPage.js).
router.route('/').post(async (req, res) => {
    const otptoken = req.header('otp-token')
    let otp;
    if (!otptoken) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(otptoken, 'moiz2194', async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: err.message });
        }
        otp = decoded.otp;
        if (req.body.otp !== otp) {
            return res.status(405).json({ message: "wrong or expired otp" })

        }
        const email = req.body.email;
        const password = req.body.password;
        // Wait until a user that matches the email/password provided is found.
        const user = await User.findOne({ email: email, password: password });

        // If a user is found in the database with the matching email/password.
        if (user) {
            // Choose what data you want to send, which will then be inputted and encrypted in the JSON Web Token (JWT).
            // This is so when we decode the JWT after logging in, it will provide the necessary information.
            const token = jwt.sign(
                {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    // accounts: user.accounts
                }, 'v6jmSuatYPw5Njr6r4ANWWQq')

            return res.json({ success: true, user: token })
        }
        else {
            return res.json({ success: false, user: false });
        }
    })
});
router.route('/otp').post(async (req, res) => {
    try {
        console.log("here")
        if (!req.body.register) {
            const email = req.body.email;
            const password = req.body.password;
            // Wait until a user that matches the email/password provided is found.
            const user = await User.findOne({ email: email, password: password });
            if (!user) {
                res.status(405).json({ success: false, user: false });
                return
            }
        }
        const otp = otpGenerator.generate(6, { specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
        sendotp(otp, req.body.email)
        const token = jwt.sign({ otp }, 'moiz2194', { expiresIn: '1m' });
        res.status(200).json({ success: true, token })
    } catch (error) {
        res.status(200).json({ message: error.message })

    }

})


module.exports = router;