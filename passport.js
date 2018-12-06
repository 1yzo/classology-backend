const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/user');
const secretOrKey = require('./secrets').secret;

module.exports = (passport) => {
    const options = { };
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.secretOrKey = secretOrKey;
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload._id, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
