const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization').split(' ')[1]; // Récupère le token de l'en-tête Authorization

  // Log du token reçu
  console.log('Token reçu :', token);

  if (!token) return res.status(401).json({ message: 'Auth Error' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Log du résultat de la validation du token
    console.log('Token validé pour l\'utilisateur :', req.userId);

    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Invalid Token' });
  }
};
