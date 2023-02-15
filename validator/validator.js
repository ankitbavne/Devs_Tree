const { body } = require("express-validator")

const login = () => {
    return [
        body("email").isString().withMessage("Email is required for login."),
        body("password").isString().withMessage("Password is required for login."),
    ]
}

const registration = () => {
    return [
        body("fullName").isString().withMessage("Full name is required for registation."),
        body("dob").isString().withMessage("Date of birth is required for registation."),
        body("email").isString().withMessage("Email is required for registation."),
        body("phoneNumber").isString().withMessage("Phone number is required for registation."),
        body("password").isString().withMessage("Password is required for registation.")
    ]
}

module.exports = {
    login,
    registration
}