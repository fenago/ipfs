const xss = require('xss')
const sanitize = require('mongo-sanitize')
const User = require('./models/User')
var safe = (unsafe)=>{
	var safed = xss(sanitize(unsafe))
	return safed
}
const isLogged = (req,res,next)=>{
	if(req.session.user){
		res.locals.user = req.session.user
		next()
	}
	else{
		req.flash('info',{type : 'error',msg : 'You must be logged in to continue!'})
		res.redirect('/login')
	}
}

const isAdmin = async (req,res,next)=>{
	if(req.session.user){
		var cu = await User.findOne({email : req.session.user.email})
		if(cu.isAdmin){
			res.locals.user = req.session.user
			next()
		}
		else{
			req.flash('info',{type : 'error',msg : 'You must be admin to continue!'})
			res.redirect('back')
		}
	}
	else{
		req.flash('info',{type : 'error',msg : 'You must be logged in to continue!'})
		res.redirect('/login')
	}
}


const notLogged = (req,res,next)=>{
	if(!req.session.user){
		next()
	}
	else{
		res.redirect('/dashboard')
	}
}


const nodemailer = require('nodemailer')
 
const send_mail =  (email,subject,text)=>{
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: global.emailusername,
	    pass: global.emailpassword
	  }
	});

	var mailOptions = {
	  from: global.emailusername,
	  to: email,
	  subject: subject,
	  html: text
	}

	transporter.sendMail(mailOptions, function(error, info){
	  
	});
}

module.exports = {
	safe,
	isLogged,
	notLogged,
	send_mail,
	isAdmin
}