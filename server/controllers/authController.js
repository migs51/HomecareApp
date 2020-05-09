exports.register = (req, res, next) => {
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

    const isEmailValid = email && validateEmail(email);
    if (email && !isEmailValid) {
        validationErrors.push({
            code: 'VALIDATION_ERROR',
            field: 'email',
            message: 'Not a valid email'
        });
    }

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

    res.status(200).send();
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
