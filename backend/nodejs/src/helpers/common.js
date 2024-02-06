const fs = require('fs');
const { Op } = require("sequelize")
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 13;

module.exports = {
  myPagination: (q, sqInc) => {
    const { searchQuery, sort, page, perPage } = q

    var param = {}
    var order = { order: [['created_at', 'desc']] }
    var limit = 10
    var offset = 0
    // search query condition
    if (searchQuery) {
      param = {
        [Op.or]: sqInc.map(x => {
        return { [x]: { [Op.iLike]: `%${searchQuery}%` } }
      })
      }
    }
    // sort condition
    if (sort) {
      var split = sort.split(",")

      if (split.length > 1) {
        if (split[0] && split[1]) {
          if (['ASC', 'DESC'].includes(split[1].toUpperCase())) {
            order.order = [[split[0], split[1]]]
          }
        }
      } else {
        if (split[0]) {
          order.order = [[split[0]]]
        }
      }
    }
    // perPage condition
    if (perPage) {
      if (isNaN(parseInt(perPage))) {
        limit = 10
      } else {
        limit = perPage
      }
    }
    // pagination condition
    if (page) {
      if (isNaN(parseInt(page))) {
        offset = 0
      } else {
        offset = (parseInt(page) - 1) * perPage
      }
    }

    return {
      param,
      order,
      limit,
      offset
    }
  },
  myPaginationQuery: (q, query, order, sqInc, soInc) => {
    const { searchQuery, sort, page, perPage } = q

    query = query || '1=1 '
    order = order || 'ORDER BY created_at DESC'
    var param = {}
    var pagination = ''
    var offset = 0
    var limit = 10
    // search query condition
    if (searchQuery) {
      let sqInc2 = sqInc.map(i => `${i} ILIKE :searchQuery`)
      var qCond = sqInc2.join(' OR ')
      query += `AND (${qCond})`
      param.searchQuery = `%${searchQuery}%`
    }
    // sort condition
    if (sort) {
      var split = sort.split(',')

      soInc = soInc || sqInc
      if (soInc.includes(split[0])) {
        if (split.length > 1) {
          if (split[0] && split[1]) {
            if (['ASC', 'DESC'].includes(split[1].toUpperCase())) {
              order = `ORDER BY ${split[0]} ${split[1]}`
            }
          }
        } else {
          if (split[0]) {
            order = `ORDER BY ${split[0]}`
          }
        }
      }
    }
    // perPage condition
    if (perPage) {
      if (isNaN(parseInt(perPage))) {
        limit = 10
      } else {
        limit = perPage
      }
      pagination += `LIMIT ${limit}`
    }
    // pagination condition
    if (page) {
      if (isNaN(parseInt(page))) {
        offset = 0
      } else {
        offset = (parseInt(page) - 1) * perPage
      }
      pagination += ` OFFSET ${offset}`
    }

    return {
      queryAll: `${query} ${order} ${pagination}`,
      queryCount: query,
      limit,
      param
    }
  },
  myErrorHandling: (error) => {
    if ('name' in error) {
      const { name, errors, parent, original, fields, sql } = error
      if (name == 'SequelizeValidationError') {
        if (Array.isArray(errors)) {
          return errors.map(e => {
            let message = e.message.split('.')
            return message[1]
          })
        }
      } else if (name == 'SequelizeDatabaseError') {
        if (original) {
          switch (original.code) {
            case '22001':
              return 'value too long'
          
            default:
              break;
          }
        }
      } else if (['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError'].includes(name)) {
        return original.detail
      }
    }
    return error
  },
  isDataExist: async (model, id, is_deleted) => {
    if (is_deleted) {
      return await model.count({ where: { id, is_deleted: false } })
    } else {
      return await model.count({ where: { id } })
    }
  },
  myFileExt: (filename) => /(?:\.([^.]+))?$/.exec(filename)[1],
  myFileUploader: (file, dir) => {
    const ext = /(?:\.([^.]+))?$/.exec(file.name)[1]
    profile_picture = `${moment().valueOf()}.${ext}`

    // const dir = `./src/assets/uploads/${id}/profile-picture`
    fs.mkdirSync(dir, { recursive: true })
    const path = `${dir}/${profile_picture}`;

    // Move the file to the specified destination
    file.mv(path, async (err) => {
      if (err) {
        return myres(res, 400, 'error while moving file', err)
      }
    });
    return profile_picture
  },
  hashPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  },
  comparePassword: async (password, hashedPassword) => {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }
}