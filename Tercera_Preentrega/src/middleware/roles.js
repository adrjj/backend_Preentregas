

const admin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next(); // Permite el acceso al siguiente middleware o ruta
    } else {
        res.status(403).send('Acceso denegado. Solo los administradores pueden realizar esta acción.');
    }
};

const user = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        next(); // Permite el acceso al siguiente middleware o ruta
    } else {
        res.status(403).send('Acceso denegado. Debes iniciar sesión como usuario para realizar esta acción.');
    }
};

module.exports = { admin, user };

