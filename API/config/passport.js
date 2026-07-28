const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const Usuario = require("../models/Usuario");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(options, async (payload, done) => {

        try {

            const usuario = await Usuario.findById(payload.id);

            if (!usuario) {
                return done(null, false);
            }

            return done(null, usuario);

        } catch (error) {

            return done(error, false);

        }

    })
);