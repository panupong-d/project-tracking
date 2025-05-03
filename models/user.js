'use strict';
const {
  Model,
  ForeignKeyConstraintError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // define association here
      // models.User.hashMany(models.Blog,{
      //   foreignKey: 'user_id', // FK's blogs table
      //   sourceKey: 'id' // PK's users table
      // })

      // models.User.hasMany(models.Blog, {
      //   as: 'blogs',
      //   foreignKey: 'user_id', //FK's blogs table
      //   sourceKey: 'id' //PK's users table
      // });
      // models.Blog.belongsTo(models.User);

      models.User.belongsTo(models.Role,{
        as: 'role',
        foreignKey: 'role_id', //FK's users table
        sourceKey: 'id' //PK's roles table
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};