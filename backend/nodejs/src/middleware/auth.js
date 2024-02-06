const { QueryTypes } = require("sequelize");
const jwt = require('jsonwebtoken');
const { db } = require("../config")
const { myres } = require("../helpers")

module.exports = {
  introspect: async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return myres(res, 401, 'authorization failed', 'Authorization Token not found');
    }
    console.log('token', token);

    try {
      var decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET)
      console.log('decoded', decoded);

      const data = await db.query(`SELECT * FROM v_employee WHERE id = :id AND status = 'active'`, { replacements: { id: decoded.sub }, type: QueryTypes.SELECT })

      res.userData = data[0]
      next()
    } catch (error) {
      console.error('jwt.verify', error);
      return myres(res, 401, 'authorization failed', error);
    }
  }
}