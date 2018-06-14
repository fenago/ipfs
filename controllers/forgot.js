const router = require('express').Router()
const helper = require('../helper')
const User = require('../models/User')
const Forgot = require('../models/Forgot')
router.get('/forgot',(req,res)=>{
	res.render('forgot',{title : "Forgot Password"})
})

router.post('/forgot',async (req,res)=>{
	var email = helper.safe(req.body.email).toLowerCase()
	var check_email = await User.findOne({email})
	if(email == ""){
		req.flash('info',{type : "error",msg : "Empty email address"})
		res.redirect('/forgot')
	}
	else if (check_email == null){
		req.flash('info',{type : "error",msg : "No user exists with such email"})
		res.redirect('/forgot')	
	}
	else{
		var code = Math.random().toString(36).substr(2, 10)
		var forpw = new Forgot({
			email,
			code
		})
		forpw.save((err)=>{
			if(err){
				console.log(err)
			}
			else{
				helper.send_mail(email,"Reset your password",`
					Hello ${check_email.fname}, <br /> <br />
					Please click on the link below to reset your password:  <br />
					<a href="http://${req.headers.host}/reset?email=${email}&code=${code}">http://${req.headers.host}/reset?email=${email}&code=${code}</a>
					<br /><br />
					Thanks`)
				
				req.flash('info',{type : "success",msg : "An email has been sent to your email address. <br /> Please, click on the link to reset your password."})
				res.redirect('/forgot')
			}
		})
	}
})
module.exports  = router