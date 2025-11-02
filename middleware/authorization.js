function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Convertimos a array para permitir varios roles si se pasa más de uno
    const rolesPermitidos = Array.isArray(role) ? role : [role];

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
}

module.exports = { authorizeRole };