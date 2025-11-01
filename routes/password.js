const express = require('express');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const router = express.Router();
const userRepo = new UserRepository();

router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userRepo.getByEmail(email);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
     
        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

    
        res.json({ message: 'Correo enviado', token, resetLink });
    } catch (error) {
        console.error('Error en /forgot:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepo.getByEmail(decoded.email);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (await user.comparePassword(password))
            return res.status(400).json({ message: 'No puedes usar la misma contraseña anterior' });

        user.password = password;
        await user.save();

        res.json({ message: 'Contraseña actualizada' });
    } catch (error) {
        console.error('Error en /reset:', error);
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
});

module.exports = router;