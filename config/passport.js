const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/User');

function initPassport(passport) {
  passport.use('local', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return done(null, false, { message: 'Contraseña incorrecta' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret_dev'
  };

  passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select('-password');
      if (!user) return done(null, false, { message: 'Token inválido' });
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
}

module.exports = { initPassport };