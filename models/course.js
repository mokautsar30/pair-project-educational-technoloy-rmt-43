'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category);
      Course.belongsTo(models.User); 
      Course.belongsToMany(models.User, {as: 'user', through: 'CourseUsers'});
    }
  }
  Course.init({
    title: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};