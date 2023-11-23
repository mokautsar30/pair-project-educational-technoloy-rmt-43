'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Course, {as: "Course"});
    }
    static async searchByName(value){
      let categories = await Category.findAll({
        include: {
                  association: "Course",
                  attributes: ["id", "title", "description", "CategoryId"]  
              }
      });
      if(value){
        categories = await Category.findAll({
          where:{
            category:{
              [Op.iLike] : `%${value}%`
            }
          },
          include: {
                    association: "Course",
                    attributes: ["id", "title", "description", "CategoryId"]  
                }
        })
      }

      return categories;
    }
  }
  Category.init({
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};