const authMiddleware = (req, res, next) => {
    const { user } = req.headers;
    if (!user) {
        return res.status(403).send('No autorizado');
    }
    next();
};

module.exports = authMiddleware;
