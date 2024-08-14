const jwt = require("jsonwebtoken");

const authRoutes = async (req, res, next) => {

  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }

  try {
    req.user = jwt.verify(token, process.env.SECRET);
    console.log(req.user)//debugging
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized request denied!" });
  }
}

module.exports = authRoutes;
