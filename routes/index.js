var express = require('express');
var router = express.Router();
const userModel = require("./users")
// const users = require("./users");
const passport = require('passport');
const localStrategy = require('passport-local'); // Important code

passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/profile', isLoggedIn, async function(req, res, next){
  let users = await userModel.find()
  res.render('users',{users});
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
      res.redirect("/")
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
  res.redirect("/")
}
router.get('/users', async function(req, res, next){
  const  allusers = await userModel.find()
  res.render('users', {allusers})
})
router.get('/like/:username', isLoggedIn, async function(req, res){
  let liked = await userModel.findOne({username:req.session.passport.user})
  liked.likes.push()
  await liked.save()
  res.redirect('/users')
})
module.exports = router;
