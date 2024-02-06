const { QueryTypes } = require("sequelize");
const jwt = require('jsonwebtoken');
const { db } = require("../config")
const { myres } = require("../helpers")
const { comparePassword } = require("../helpers/common")

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body
  
    // form validation
    if (!username) {
      return myres(res, 400, 'error at update', `Username is required`)
    }
  
    if (!password) {
      return myres(res, 400, 'error at update', `Password is required`)
    }
  
    if (username === 'admin') {
      try {
        if (password === process.env.ADM_PASS) {
          var token = jwt.sign({ sub: 'admin', emp_number: null, fullname: 'admin', position_id: '0', position_name: 'admin', is_head: true, department_id: '0', department_name: 'admin' }, process.env.JWT_SECRET, { expiresIn: '6h' });
          return myres(res, 200, 'authentication success', token)
        }
        return myres(res, 401, 'authentication failed', 'Invalid Password')
      } catch (error) {
        console.error('error auth.login', error);
        return myres(res, 401, 'authentication failed', error)
      }
    } else {
      const check = await db.query(`SELECT * FROM v_employee WHERE (emp_number = :username OR email = :username OR phone = :username) AND status = 'active'`, { replacements: { username }, type: QueryTypes.SELECT })
      if (check.length < 1) return myres(res, 401, 'authentication failed', `Username ${username} is not exist`)
      if (check.length > 1) return myres(res, 500, 'authentication failed', 'Multiple user found')
    
      try {
        const { id, emp_number, fullname, position_id, position_name, is_head, department_id, department_name, password: pwd } = check[0]
        let compare = await comparePassword(password, pwd)
        if (compare) {
          var token = jwt.sign({ sub: id, emp_number, fullname, position_id, position_name, is_head, department_id, department_name }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return myres(res, 200, 'authentication success', token)
        }
        return myres(res, 401, 'authentication failed', 'Invalid Password')
      } catch (error) {
        console.error('error auth.login', error);
        return myres(res, 401, 'authentication failed', error)
      }
    }
  }
}