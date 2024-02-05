const { DataTypes } = require('sequelize')
const { db } = require('../config')

module.exports = db.define(
  'employee',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: db.fn('uuid_generate_v4')
    },
    emp_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_card_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: DataTypes.STRING,
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: { // m, f
      type: DataTypes.STRING,
      allowNull: false,
    },
    marital_status: DataTypes.BOOLEAN,
    profile_picture: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    emergency_contact_name: DataTypes.STRING,
    emergency_contact_phone: DataTypes.STRING,
    join_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    position_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: { // active, inactive, deleted, moved
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)