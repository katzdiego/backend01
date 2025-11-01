const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserDTO = require('../dto/UserDTO');

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password)
      return res.status(400).json({ error: 'Faltan datos requeridos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });

    const newUser = new User({ first_name, last_name, email, age, password });
    await newUser.save();

    const user = newUser.toObject();
    delete user.password;
    res.status(201).json({ message: 'Usuario creado', user });
  } catch (err) {
    console.error('Error en /register:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'No autorizado' });

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_dev', { expiresIn: '8h' });

    const userData = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    };

    res.json({ message: 'Login correcto', token, user: userData });
  })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    const userDTO = new UserDTO(req.user);
    res.json({ user: userDTO });
  } catch (err) {
    console.error('Error en /current:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;