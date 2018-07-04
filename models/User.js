const mongoose = require('mongoose')
const ai = require('mongoose-auto-increment')
const schema = mongoose.Schema
const userSchema = new schema({
	username : {type : String},
	email : {type : String},
	password : {type : String},
	date : {type : Date},
	isVerified : {type : Boolean , default : false},
	vcode : {type : String},
	fname : {type : String},
	lname : {type : String},
	isAdmin : {type : Boolean,default : false}

})
ai.initialize(mongoose.connection)
userSchema.plugin(ai.plugin , {
	model : 'userModel',
	field : 'id',
	startAt : 1,
	incrementBy : 1,
})
const userModel = mongoose.model('userModel',userSchema)
module.exports = userModel