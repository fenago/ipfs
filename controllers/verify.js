const router = require('express').Router()
const helper = require('../helper')
const User = require('../models/User')
router.get('/verify', async (req,res)=>{
	if(req.query.mail && req.query.code){
		var email = helper.safe(req.query.mail)
		var code = helper.safe(req.query.code)
		const count = await User.findOne({ $and : [{'email' : email },{'vcode' : code}]})
		if(email == "" || code == ""){
			res.send("Empty response")
		}
		else if (count == null){
			res.send("Invalid credentials")
		}
		else if (count.isVerified == true){
			res.send("Already Verified")
		}
		else {
			User.findOne({  $and : [{'email' : email },{'vcode' : code}] } , (err,succ)=>{
				if(err) res.send(err)
				if(succ){
					succ.isVerified = true
					succ.save(()=>{
						res.send('successfully verified !! . <a href = "/login">SignIn Now</a>')
					})
				}
			})
		}
	}
	else{
		res.send("error")
	}
})
module.exports = router