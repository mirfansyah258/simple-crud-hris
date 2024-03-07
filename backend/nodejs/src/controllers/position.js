const { QueryTypes, Op } = require("sequelize");
const { db } = require("../config")
const { myres } = require("../helpers")
const { myPaginationQuery, myErrorHandling, isDataExist } = require("../helpers/common")
const { Position, Department } = require("../models");

module.exports = {
  create: async (req, res) => {
    const { position_name, department_id, is_head } = req.body
    try {
      if(is_head === true) {
        const check1 = await Position.findOne({ where: { department_id, is_head } })
        if (check1) return myres(res, 400, 'error at create', `Selected department in selected company already have a position head (${check1.toJSON().position_name})`)
      }
      
      const check2 = await isDataExist(Department, department_id, true)
      if (check2 < 1) return myres(res, 404, 'error at create', `Department with id ${department_id} is not found`) // or 'Selected department not found'

      const data = await Position.create({ position_name, department_id, is_head })
      return myres(res, 201, 'Position data created successfully', data)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at create', myErrorHandling(error))
    }
  },
  getAll: async (req, res) => {
    const { page = 1, perPage = 1 } = req.query
    const { queryAll, queryCount, param: replacements } = myPaginationQuery(req.query, 'is_deleted = false ', null, ['position_name', 'department_name'], ['position_name', 'department_name', 'is_head'])
    try {
      // get all record based on filter
      const rows = await db.query(`SELECT * FROM v_position WHERE ${queryAll}`, { replacements, type: QueryTypes.SELECT })

      // count all record based on filter
      const count = await db.query(`SELECT * FROM v_position WHERE ${queryCount}`, { replacements, type: QueryTypes.SELECT })
      const totalCount = count.length

      return myres(res, 200, null, { rows, totalCount, currentPage: parseInt(page), perPage: parseInt(perPage), totalPages: Math.ceil(totalCount / parseInt(perPage)) })
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getAll', error)
    }
  },
  getById: async (req, res) => {
    const { id } = req.params
    try {
      const data = await db.query(`SELECT * FROM v_position WHERE id = :id AND is_deleted = false`, { replacements: { id }, type: QueryTypes.SELECT })
      if (data.length) {
        return myres(res, 200, null, data[0])
      }
      return myres(res, 404, `Position with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at getById', error)
    }
  },
  update: async (req, res) => {
    const { id } = req.params
    const { position_name, department_id, is_head } = req.body

    try {
      // check if position id is exist
      const isExist = await isDataExist(Position, id, true)
      if (isExist) {
        // check if selected department in selected company already have a position head
        if (is_head === true) {
          const check1 = await Position.findOne({ where: { id: { [Op.ne]: id }, department_id, is_head } })
          if (check1) return myres(res, 400, `Selected department in selected company already have a position head (${check1.toJSON().position_name})`)
        }

        // check if department is exist
        const check2 = await isDataExist(Department, department_id, true)
        if (check2 < 1) return myres(res, 404, `Department with id ${department_id} is not found`)

        const data = await Position.update({ position_name, department_id, is_head }, { where: { id }, returning: true })
        return myres(res, 200, 'Position changed successfully', data[1][0])
      }
      return myres(res, 404, `Position with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at update', error)
    }
  },
  delete: async (req, res) => {
    const { id } = req.params
    try {
      const isExist = await isDataExist(Position, id, true)
      if (isExist) {
        const data = await Position.update({ is_head: false, is_deleted: true }, { where: { id }, returning: true })
        return myres(res, 200, 'Position data deleted successfully', data[1][0])
      }
      return myres(res, 404, `Position with id ${id} is not found`)
    } catch (error) {
      console.error('error', error);
      return myres(res, 400, 'error at delete', error)
    }
  },
}