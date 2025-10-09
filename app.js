require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const sessionsRouter = require('./routes/sessions');
const usersRouter = require('./routes/users');
const { initPassport } = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicializar Passport
initPassport(passport);
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// Conexión a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error Mongo:', err));

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
});

// Servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));