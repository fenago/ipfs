const express = require('express')
const app = express()
const session = require('express-session')
app.use(session({
 secret: 'U^T&*&(TGKSGHS*T13974687tU@*&#^%87I*q63(@T@5tI@*@TghGi*@YghIH@8',
 resave: false,
 saveUninitialized: true,
}))
//for flash messages
const flash = require('express-flash')
app.use(flash())
//flashes
app.use((req,res,next)=>{
	res.locals.info = req.flash('info')
	next()
})
//using bodyparser
const bpraser = require('body-parser')
app.use(bpraser.urlencoded({extended : true}))
//using public folder
app.use(express.static('public'))
//database connection
require('./models/connection')
//using all routes at once
var normalizedPath = require("path").join(__dirname, "controllers");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
 app.use(require('./controllers/'+file));
});

//for email sending purpose
global.emailusername = 'deltatechdps@gmail.com'
global.emailpassword = 'Delta Tech Dipesh ####'


//key for encrypting
global.key = 'sh*dfhskh*YY@OYTGJFHBF<BG*TYHKFBAOWOY@#@($^@(YhJHry8whkOyr3ykhHoYR#hIHO@Y)YHFBjSKWGOr3y8oih&(^*%&^&gjGFIUW*fsjbgrei;dhsowea.sfissg'



//setting view enging
app.set('view engine','ejs')
const port = process.env.PORT || 3000
app.listen(port,(err)=>{
	if(err){console.log(err)}
	else{
		console.log("Up and running at port ",port)
	}
})