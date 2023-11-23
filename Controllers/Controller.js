const { Category, Course, User } = require('../models');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

class Controller{

    static landing(req, res){
        res.render("landing");
    }

    static SignUpForm(req, res){
        res.render('signUp');
    }

    static async SignUpRegister(req, res){
        const {username, email, password, role} = req.body;
        try {
            await User.create({username, email, password, role});
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            res.send(error.message);
        } 
    }

    static login(req, res){
        const {error}  = req.query
        res.render('login', {error});
    }

    static async postLogin(req, res){
        try {
        const {username, password} = req.body; 
        const user = await User.findOne({where: {username}});
        if(user){
            const isPasswordTrue = bcrypt.compareSync(password, user.password);
            if(isPasswordTrue){

                req.session.role = user.role;
                req.session.UserId = user.id;

                res.redirect('/home'); //ke class page
            }else{
                const error = "invalid username/password";
                res.redirect(`/login?error=${error}`);
            }
        }else{
            const error = "invalid username/password";
            res.redirect(`/login?error=${error}`);
        }
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }


    static async home(req, res){
        const {CourseTitle, CourseDesc} = req.query;
        const { search } = req.query; 
        try {
            const categories = await Category.searchByName(search);
            res.render("home", {categories, CourseTitle, CourseDesc});
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

// ini belum di konekin
static async coursePage(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id, {
        attributes: ["id", "title", "duration", "description", "image", "CategoryId", "createdAt", "updatedAt"],
      });
      
      res.render("coursePage", { course });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

    static async editForm(req, res){
        const {errors} = req.query;
        let err;

        if(errors){
            err = errors.split(',');
            console.log(err);
        }

        try {
            const {id} = req.params;
            const course = await Course.findByPk(id);
            res.render("editForm", {course, err});
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

    static async updateForm(req, res){
        const {id} = req.params;
        
        try {
            const {title, duration, description, CategoryId} = req.body;
            await Course.update({title, duration, description, CategoryId}, 
                {where: 
                    {id: id}
                });
            res.redirect("/home");
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                let errors = error.errors.map((er) => {
                 return er.message
                }); 
                // res.send(errors);
                res.redirect(`/course/edit/${id}?errors=${errors}`); 
             } else {
                 res.send(error);
             }
        }
    }
    
    static async deleteCourse(req, res){
        try {
            const deleted = await Course.findByPk(req.params.id)
            await Course.destroy({where: {id: req.params.id}});
            res.redirect(`/home?CourseTitle=${deleted.title}&CourseDesc=${deleted.description}`);
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
    }

    static getLogout(req, res){
        req.session.destroy((err) => {
            if(err){
                console.log(err)
            }else{
                res.redirect('/login');
            }
        });
    }

}

module.exports = Controller;