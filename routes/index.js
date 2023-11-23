const Controller = require('../Controllers/Controller');

const router = require('express').Router();

router.get('/', Controller.landing);

router.get('/register', Controller.SignUpForm);

router.post('/register', Controller.SignUpRegister);

router.get('/login', Controller.login);

router.post('/login', Controller.postLogin);

router.get('/logout', Controller.getLogout);

router.use(function (req, res, next) {
    if(req.session.UserId){
        next();
    }else{
        const error = "You must login first";
        res.redirect(`/login?error=${error}`);
    }
});
const isRole = function (req, res, next) {
    if(req.session.role === "admin"){
        next();
    }else{
        const error = "Sorry, You have no acces";
        res.redirect(`/login?error=${error}`);
    }
};



router.get("/home", Controller.home); 

router.get("/course/:id", Controller.coursePage); 

router.get("/course/edit/:id", isRole, Controller.editForm); 

router.post("/course/edit/:id", isRole, Controller.updateForm);

router.get("/course/delete/:id", isRole, Controller.deleteCourse);





module.exports = router;