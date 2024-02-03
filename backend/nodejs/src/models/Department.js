const { DataTypes } = require('sequelize')
const { db } = require('../config')

module.exports = db.define(
  'department',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: db.fn('uuid_generate_v4')
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent_department_id: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: db.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: db.fn('now')
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)