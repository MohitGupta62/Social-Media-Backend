var express = require('express');
var router = express.Router();
const userModel = require("./users")
const users = require("./users");
const passport = require('passport');
const localStrategy = require('passport-local'); // Important code

passport.use(new localStrategy(userModel, passport.authenticate()));  // Important code

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/profile', isLoggedIn, function(req, res, next){
  res.send("profile page")
})
router.post('/register', function(req, res, next) {
  const userdets =  new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    picture: req.body.picture,
  })
  userModel.register(userdets, req.body.password)
  .then(function(user){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile")
    })
  })
});

router.post('/login', passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect: "/"
}), function(req, res, next){});

router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/')
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}
// router.get('/users', async function(req, res){
//   const allUsers = await users.find()
//   res.render('users', {allUsers})
// })
// router.get('/like/:_id', async function(req, res, next){
//   let liked = await users.findOne({_id : req.params._id})
//   liked.likes.push()
//   res.redirect('/users')
// })
module.exports = router;
