const  router = require('express').Router()
const helper = require('../helper')
const User = require("../models/User")
const bcrypt = require('bcryptjs')
router.get('/register',(req,res)=>{
	res.render('register',{title : "Register"})
})

router.post('/register',async (req,res)=>{
	var email = helper.safe(req.body.email).toLowerCase()
	// var username = helper.safe(req.body.username).toLowerCase()
	var password = helper.safe(req.body.password)
	var rpassword = helper.safe(req.body.rpassword)
	var fname = helper.safe(req.body.fname)
	var lname = helper.safe(req.body.lname)
	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(String(email))
	}
	var eex = await User.findOne({email})
	// var uex = await User.findOne({username})


	if(email == "" ||  password == "" || fname == "" || lname == ""){
		req.flash('info',{type : "error",msg : 'Donot Leave any fields empty'})
		res.redirect('/register')
	}
	// else if (username.length<3 || username.length>30){
	// 	req.flash('info',{type : "error",msg : 'Username must be of 3-30 characters'})
	// 	res.redirect('/register')
	// }
	else if (password.length<6){
		req.flash('info',{type : "error",msg : 'Password must be of at least 6 characters'})
		res.redirect('/register')
	}
	else if  (!validateEmail(email)){
		req.flash('info',{type : "error",msg : 'Invalid E-mail'})
		res.redirect('/register')
	}
	else if (password!=rpassword){
		req.flash('info',{type : "error",msg : 'Repeat Password donot match'})
		res.redirect('/register')
	}
	else if (eex!=null){
		req.flash('info',{type : "error",msg : 'E-mail already exists , please choose another email'})
		res.redirect('/register')
	}
	// else if (uex!= null){
	// 	req.flash('info',{type : "error",msg : 'Username already exists , please choose another username'})
	// 	res.redirect('/register')
	// }
	else{
		var vcode = Math.random().toString(36).substr(2, 5);
		var pw = bcrypt.hashSync(password,8)
		var user = new User({
			// username,
			email,
			password : pw,
			date : new Date(),
			vcode,
			fname,
			lname
		})
		user.save((err)=>{
			if(err){console.log(err)}
			else{
				helper.send_mail(email,'Registration Successfull',`Hello ${fname} , <br />
				Thanks for joining us <br />
				Please confirm your email address by clicking  on the link below : 
					<br /><br />
					<a href="http://${req.headers.host}/verify?code=${vcode}&mail=${email}">http://${req.headers.host}/verify?code=${vcode}&mail=${email}</a>
					`)
				req.flash('info',{type : "success",msg : 'Successfully Signed Up , now you may SignIn !!'})
				res.redirect('/register')
			}
		})
	}
})
module.exports = router