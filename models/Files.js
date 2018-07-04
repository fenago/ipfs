const mongoose = require('mongoose')
const ai = require('mongoose-auto-increment')
const schema = mongoose.Schema
const filesSchema = new schema({
	email : {type : String},
	file : {type : String},
	date : {type : Date},
	type : {type : String},
	original : {type : String},
	hash : {type : String},
	key : {type : String},
	admin : {type : Boolean  , default : false},
	assign : {type : Boolean,default : false},
	by : String,
	aid : Number

})
ai.initialize(mongoose.connection)
filesSchema.plugin(ai.plugin , {
	model : 'filesModel',
	field : 'id',
	startAt : 1,
	incrementBy : 1,
})
const filesModel = mongoose.model('filesModel',filesSchema)
module.exports = filesModel