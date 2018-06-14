const  router = require('express').Router()
const User = require('../models/User')
const helper = require('../helper')
const bcrypt = require('bcryptjs')
router.get('/login',helper.notLogged,(req,res)=>{
	res.render('login',{title : "Login"})
})
router.post('/login',helper.notLogged,async (req,res)=>{
	var email = helper.safe(req.body.email)
	var password = helper.safe(req.body.password)
	var check = await User.findOne({email})
	if(email == "" || password == ""){
		req.flash('info',{type : "error",msg : 'Donot Leave any fields empty'})
		res.redirect('/login')
	}
	else if (check === null){
		req.flash('info',{type : "error",msg : 'No user exists with such email'})
		res.redirect('/login')
	}
	else if (!bcrypt.compareSync(password,check.password)){
		req.flash('info',{type : "error",msg : 'Invalid Password'})
		res.redirect('/login')
	}
	else{
		req.session.user = check
		req.session.email = check.email
		res.redirect('/dashboard')
	}
})
module.exports = router