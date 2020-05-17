const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

//register function that validates and registers user emails and passwords
exports.register = async (req, res, next) => {
    //destructing body object to pull out email and password
    const {
        email,
        password
    } = req.body;

    //Validate the input fields. sends back error object is email and password input fields are empty
    const validationErrors = [];

    if (!email) {
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'email',
            message: 'You must provide an email address'
        });
    }

    //validates email
    const isEmailValid = email && validateEmail(email);
    if (email && !isEmailValid) {
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'email',
            message: 'Not a valid email'
        });
    }

    // add password validation requirements

    if (!password){
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'password',
            message: 'You must provide a valid password'
        });
    }

    if(validationErrors.length) {
        const errorObject = {
            error: true,
            errors: validationErrors
        };

        res.status(422).send(errorObject);

        return;
    }

    // save user info to database and checks if the user already exists in the db.  If they already exist thi sends back the error object
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            const errorObject = {
                error: true,
                errors: [{
                    code: 'VALIDATION_ERROR',
                    field: 'Email',
                    message: 'Email already exists'
                }]
            };
            res.status(422).send(errorObject);


            return;
        }

    //if user doesn't already exist we create the new user here
        let user = new User({
            email,
            password,
            activated: false,
            activationToken: uuidv1(),
            activationTokenSentAt: Date.now()

        });

        const savedUser = await user.save();

        console.log('savedUser ', savedUser);

        res.status(200).send({
            user: User.toClientObject(savedUser)
        })

    } catch (e) {
        console.log('e ', e);

    }

    
}


exports.login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    const validationErrors = [];

    if (!email) {
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'email',
            message: 'You must provide an email address'
        });
    }

    //validates email
    const isEmailValid = email && validateEmail(email);
    if (email && !isEmailValid) {
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'email',
            message: 'Not a valid email'
        });
    }

    // add password validation requirements

    if (!password){
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'password',
            message: 'You must provide a valid password'
        });
    }

    if(validationErrors.length) {
        const errorObject = {
            error: true,
            errors: validationErrors
        };

        res.status(422).send(errorObject);

        return;
    }

    //using passport to authenticate user upon login
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.status(401).send(info)
            return;
        }
        const userObject = user.toObject();
        const tokenObject = {
            _id: userObject._id
        }

        const jwtToken = jwt.sign(tokenObject, process.env.JWT_SECRET || 'TEMP_JWT_SECRET', {
            expiresIn: 86400 //passing in the number of seconds in a day
        })

        res.status(200).send({
            token: jwtToken,
            user: userObject
        });
        return;
        
    })(req, res, next);
}

exports.accountActivate = async (req, res, next) => {
    const {
        activationToken
    } = req.body;

    if (!activationToken) {
        const errorObject = {
            error: true,
            errors: [{
                code: 'VALIDATION_ERROR',
                message: 'Invalid Activation Token. Perhaps you request a new token?'
            }]
        };

        res.status(422).send(errorObject);



        return;
    }

    try {
        const user = await User.findOne({
            activationToken
        });

        if (!user) {
            const errorObject = {
                error: true,
                errors: [{
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid Activation Token. Perhaps you request a new token?'
                }]
            };
    
            res.status(422).send(errorObject);
    
            return;
        }

        ///We found a user and change their stats activated = true
        user.activated = true;
        user.activationToken = undefined;
        user.activatedAt = Date.now();


        const savedUser = await user.save();

        return res.send({
            message: 'Your account has been activated. Please proceed to the Login page to Sign in'
        });


    } catch (e) {
        console.log ('e ', e);
        res.status(500).send({
            error:true
        })
    }
}

exports.testAuth = async (req, res, next) => {
    console.log('req.user', req.user);
    res.send({
        isLoggedIn: req.user ? true : false
    })
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
