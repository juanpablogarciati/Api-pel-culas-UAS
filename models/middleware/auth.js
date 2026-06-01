const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ mensaje: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, 'clave_secreta');
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}

module.exports = verificarToken;
