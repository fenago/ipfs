const mongoose = require('mongoose')
const ai = require('mongoose-auto-increment')
const schema = mongoose.Schema
const AssignSchema = new schema({
	email : String,
	from : String,
	fid : Number,
	date : Date

})
ai.initialize(mongoose.connection)
AssignSchema.plugin(ai.plugin , {
	model : 'AssignModel',
	field : 'id',
	startAt : 1,
	incrementBy : 1,
})
const AssignModel = mongoose.model('AssignModel',AssignSchema)
module.exports = AssignModel