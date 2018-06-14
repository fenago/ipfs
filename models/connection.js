const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/encrypt',(err,succ)=>{
	if(err){console.log(err)}
	if(succ){
		console.log("Connection to database successfull !!")
	}
})