const validator = require('validator');

const validateRegisterPageInput = (user) =>
{
    let fieldInputErrors = {firstName: "", lastName: "", email: "", password: "", confirmPassword: ""};
    let isDataValid = true;

    if (validator.isEmpty(user.firstName))
    {
        fieldInputErrors.firstName = "Error! First name cannot be left blank.";
        isDataValid = false;
    }
    else if (!validator.isLength(user.firstName, {min: 2, max:20}))
    {
        fieldInputErrors.firstName = "Error! First name must be between 2 and 20 letters."
        isDataValid = false;
    }
    else if (!validator.isAlpha(user.firstName))
    {
        fieldInputErrors.firstName = "Error! First name must only contain letters."
        isDataValid = false;
    }


    if (validator.isEmpty(user.lastName))
    {
        fieldInputErrors.lastName = "Error! Last name cannot be left blank.";
        isDataValid = false;
    }
    else if (!validator.isLength(user.lastName, {min: 2, max:35}))
    {
        fieldInputErrors.lastName = "Error! Last name must be between 2 and 35 letters."
        isDataValid = false;
    }
    else if (!validator.isAlpha(user.lastName))
    {
        fieldInputErrors.lastName = "Error! Last name must only contain letters."
        isDataValid = false;
    }


    if (validator.isEmpty(user.email))
    {
        fieldInputErrors.email = "Error! Email address cannot be left blank.";
        isDataValid = false;
    }
    else if (!validator.isEmail(user.email))
    {
        fieldInputErrors.email = "Error! Invalid email.";
        isDataValid = false;
    }


    if (validator.isEmpty(user.password))
    {
        fieldInputErrors.password = "Error! Password cannot be left blank.";
        isDataValid = false;
    }
    else if (!validator.isLength(user.password, {min: 8, max:24}))
    {
        fieldInputErrors.password = "Error! Password must be between 8 and 24 characters."
        isDataValid = false;
    }
    else if (!validator.equals(user.password, user.confirmPassword))
    {
        fieldInputErrors.password = "Error! Passwords do not match."
        isDataValid = false;
    }


    if (validator.isEmpty(user.confirmPassword))
    {
        fieldInputErrors.confirmPassword = "Error! Plase confirm your password.";
        isDataValid = false;
    }
    else if (!validator.equals(user.password, user.confirmPassword))
    {
        fieldInputErrors.confirmPassword = "Error! Passwords do not match."
        isDataValid = false;
    }

    return {
        fieldInputErrors, 
        isDataValid
    };
};

module.exports = validateRegisterPageInput;