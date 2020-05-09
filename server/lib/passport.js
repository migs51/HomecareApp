const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const localOptions = {
    usernameField: 'email',
    passwordField: 'password'
};

const localLogin = new LocalStrategy(localOptions,function(email, password, done) {
    User.findOne({ email }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            //No user with that email address.. Cannot proceed
            done(null, null, {
                code: 'GLOBAL_ERROR',
                field: 'email',
                message: 'Your login credentials could not be verified. Please try agian.'
            })
            return;
        }

        
            //proceed with password validation
            user.comparePassword (password, function (err, isMatch) {
                if (err) {
                    return done(err);
                }
                //if password matches calling done and passing the user
                if (!isMatch) {
                    //if password doesn't match calling done and passing error object
                    done(null, null, {
                        code: 'GLOBAL_ERROR',
                        message: 'Your login details could not be verified. Please try again'
                    })
                    return;
                 }
        
                done(null, user);
                return;
                
            })
    });
}); 

passport.use(localLogin)