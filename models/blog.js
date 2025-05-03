"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      // define association here
      // models.Blog.belongsTo(models.User,{
      //   as: 'user',
      //   foreignKey: 'user_id', //FK's blogs table
      //   sourceKey: 'id' //PK's users table
      // });
    }
  }
  Blog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING(200),
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Blog",
      tableName: "blogs",
      timestamps: false,
    }
  );
  return Blog;
};
