const router = require('express').Router()
const helper = require('../helper')
const Forgot = require('../models/Forgot')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
router.get('/reset',async (req,res)=>{
	if(!req.query.email || !req.query.code){
		res.send("Invalid Details")
	}
	else{
		var email = helper.safe(req.query.email)
		var code = helper.safe(req.query.code)
		var chk = await Forgot.findOne({$and:[{email},{code}]})
		if(chk == null){
			res.send("Invalid Credentials")
		}
		else{
			res.render('reset',{title : "Reset your password",email})
		}
	}
})

router.post('/reset',async (req,res)=>{
	if(!req.query.email || !req.query.code){
		res.send("Invalid Details")
	}
	else{
		var email = helper.safe(req.query.email)
		var code = helper.safe(req.query.code)
		var chk = await Forgot.findOne({$and:[{email},{code}]})
		if(chk == null){
			res.send("Invalid Credentials")
		}
		else{
			var pw = helper.safe(req.body.password)
			var rpw = helper.safe(req.body.rpassword)
			if(pw == "" || rpw == ""){
				req.flash('info',{type : "error",msg : "Donot leave any fields empty"})
				res.redirect("back")	
			}
			else if(pw!=rpw){
				req.flash('info',{type : "error",msg : "Repeat password donot match"})
				res.redirect("back")
			}
			else if (pw.length<6){
				req.flash('info',{type : "error",msg : "Password must be of at least 6 characters"})
				res.redirect("back")
			}
			else{
				User.findOne({email},(err,succ)=>{
					if(err){console.log(err)}
					if(succ){
						var ps = bcrypt.hashSync(pw,8)
						succ.password = ps
						succ.save((err)=>{
							if(err){console.log(err)}
							else{
								Forgot.remove({$and:[{email},{code}]},(err,succ)=>{

								})
								req.flash('info',{type : "success",msg : "Your password has been changed successfully !!"})
								res.redirect("/login")
							}
						})
					}
				})
			}
		}
	}
})
module.exports = router