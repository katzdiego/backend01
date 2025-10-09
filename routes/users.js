const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error en GET /users:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) return res.status(403).json({ error: 'Acceso denegado' });
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(`Error en GET /users/${req.params.id}:`, err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) return res.status(403).json({ error: 'Acceso denegado' });

    const allowedFields = ['first_name', 'last_name', 'age', 'password'];
    const update = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    });

    if (update.password) {
      update.password = bcrypt.hashSync(update.password, 10);
    }

    if (req.body.role && req.user.role === 'admin') update.role = req.body.role;

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario actualizado', user });
  } catch (err) {
    console.error(`Error en PUT /users/${req.params.id}:`, err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) return res.status(403).json({ error: 'Acceso denegado' });

    const user = await User.findByIdAndDelete(id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado', user });
  } catch (err) {
    console.error(`Error en DELETE /users/${req.params.id}:`, err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;