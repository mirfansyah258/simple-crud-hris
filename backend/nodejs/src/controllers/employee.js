const { QueryTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const { db } = require("../config")
const { myres } = require("../helpers")
const { myPaginationQuery, myErrorHandling, isDataExist, myFileUploader, hashPassword } = require("../helpers/common")
const { Employee, Position } = require("../models");
const response = {}

response.create = async (req, res) => {
  const { emp_number, id_card_number, firstname, lastname, birthdate, gender, marital_status, address, phone, email, emergency_contact_name, emergency_contact_phone, join_date, end_date, position_id, password } = req.body
  const files = req.files
  const id = uuidv4()

  const transaction = await db.transaction()
  try {
    // check employee number availability
    const check1 = await Employee.findOne({ where: { [Op.or]: [{ emp_number }, { id_card_number }], status: 'active' } })
    if (check1) return myres(res, 400, 'error at create', `${check1.toJSON().emp_number == emp_number ? 'emp_number' : 'id_card_number'} already exists`)
    // check position availability
    const check2 = await isDataExist(Position, position_id, true)
    if (check2 < 1) return myres(res, 404, 'error at create', `Position with id ${position_id} is not found`)

    let profile_picture = ''
    if (files && files.profile_picture.size > 0) {
      profile_picture = myFileUploader(files.profile_picture, `./src/assets/uploads/${id}/profile-picture`)
    }

    const data = await Employee.create({ emp_number, id_card_number, firstname, lastname, birthdate, gender, marital_status, profile_picture, address, phone, email, emergency_contact_name, emergency_contact_phone, join_date, end_date, position_id, password: await hashPassword(password || emp_number) }, { transaction })
    
    await transaction.commit()
    return myres(res, 201, 'Employee data created successfully', data)
  } catch (error) {
    await transaction.rollback()
    console.error('error', error);
    return myres(res, 400, 'error at create', myErrorHandling(error))
  }
}

response.getAll = async (req, res) => {
  const { page = 1, perPage = 1, status } = req.query
  if (!['active', 'inactive', 'deleted', 'moved'].includes(status.toLowerCase())) return myres(res, 400, 'error at getAll', 'invalid status value')
  const { queryAll, queryCount, param: replacements } = myPaginationQuery(req.query, `status = '${status}' `, null, ['emp_number', 'fullname', 'position_name', 'department_name', 'status'])
  try {
    // get all record based on filter
    const rows = await db.query(`SELECT *, (CASE WHEN (profile_picture = '') IS NOT TRUE THEN '/uploads/' || id || '/profile-picture/' || profile_picture ELSE '' END) AS profile_picture_path FROM v_employee WHERE ${queryAll}`, { replacements, type: QueryTypes.SELECT })

    // count all record based on filter
    const count = await db.query(`SELECT * FROM v_employee WHERE ${queryCount}`, { replacements, type: QueryTypes.SELECT })
    const totalCount = count.length

    return myres(res, 200, null, { rows, totalCount, currentPage: parseInt(page), perPage: parseInt(perPage), totalPages: Math.ceil(totalCount / parseInt(perPage)) })
  } catch (error) {
    console.error('error', error);
    return myres(res, 400, 'error at getAll', error)
  }
}

response.getById = async (req, res) => {
  const { id } = req.params
  try {
    const data = await db.query(`SELECT *, (CASE WHEN (profile_picture = '') IS NOT TRUE THEN '/uploads/' || id || '/profile-picture/' || profile_picture ELSE '' END) AS profile_picture_path FROM v_employee WHERE id = :id`, { replacements: { id }, type: QueryTypes.SELECT })
    if (data.length) {
      return myres(res, 200, null, data[0])
    }
    return myres(res, 404, `Employee with id ${id} is not found`)
  } catch (error) {
    console.error('error', error);
    return myres(res, 400, 'error at getById', error)
  }
}

response.update = async (req, res) => {
  const { id } = req.params
  const files = req.files
  const update_param = req.body
  const { emp_number, id_card_number, position_id } = update_param
  delete update_param.password
  update_param.profile_picture = ''

  // check employee number availability
  const check1 = await Employee.findOne({ where: { id: { [Op.ne]: id }, [Op.or]: [{ emp_number }, { id_card_number }], status: 'active' } })
  if (check1) return myres(res, 400, 'error at update', `${check1.toJSON().emp_number == emp_number ? 'emp_number' : 'id_card_number'} already exists`)
  // check position availability
  const check2 = await isDataExist(Position, position_id, true)
  if (check2 < 1) return myres(res, 404, 'error at update', `Position with id ${position_id} is not found`)
  
  if (files && files.profile_picture.size > 0) {
    update_param.profile_picture = myFileUploader(files.profile_picture, `./src/assets/uploads/${id}/profile-picture`)
  }

  try {
    const isExist = await Employee.count({ where: { id } })
    if (isExist) {
      const data = await Employee.update(update_param, { where: { id }, returning: true })
      return myres(res, 200, 'Employee data changed successfully', data[1][0])
    }
    return myres(res, 404, `Data employee with id ${id} is not found`)
  } catch (error) {
    console.error('error employee.update', error);
    return myres(res, 400, 'error at update', error)
  }
}

response.delete = async (req, res) => {
  const { id } = req.params
  try {
    const isExist = await Employee.count({ where: { id, status: 'active' } })
    if (isExist) {
      const data = await Employee.update({ status: 'deleted' }, { where: { id }, returning: true })
      return myres(res, 200, 'Employee data deleted successfully', data[1][0])
    }
    return myres(res, 404, `Data employee with id ${id} is not found`)
  } catch (error) {
    console.error('error', error);
    return myres(res, 400, 'error at delete', error)
  }
}

module.exports = response