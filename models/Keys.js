const mongoose = require('mongoose')
const ai = require('mongoose-auto-increment')
const schema = mongoose.Schema
const keysSchema = new schema({
	key : String,
	date : Date,
	email : String

})
ai.initialize(mongoose.connection)
keysSchema.plugin(ai.plugin , {
	model : 'keysModel',
	field : 'id',
	startAt : 1,
	incrementBy : 1,
})
const keysModel = mongoose.model('keysModel',keysSchema)
module.exports = keysModel