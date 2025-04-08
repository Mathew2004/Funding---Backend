const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.header('Authorization');
  if (token) {
    token = token.split(' ')[1]; // Remove 'Bearer ' prefix
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
