const User = require('../models/User');

//register function that validates and registers user emails and passwords
exports.register = async (req, res, next) => {
    console.log('req.body: ' , req.body);
    //destructing body object to pull out email and password
    const {
        email,
        password
    } = req.body;

    //Validate the input fields
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

        res.send(errorObject);

        return;
    }

    // save user info to database
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


        let user = new User({
            email,
            password
        });

        const savedUser = await user.save();

        console.log('savedUser ', savedUser);

        res.status(200).send({
            user: savedUser
        })

    } catch (e) {
        console.log('e ', e);

    }

    
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
