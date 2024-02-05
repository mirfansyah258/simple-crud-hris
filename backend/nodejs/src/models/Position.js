const { DataTypes } = require('sequelize')
const { db } = require('../config')

module.exports = db.define(
  'position',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: db.fn('uuid_generate_v4')
    },
    position_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_head: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
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