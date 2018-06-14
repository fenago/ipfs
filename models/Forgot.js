const mongoose = require('mongoose')
const ai = require('mongoose-auto-increment')
const schema = mongoose.Schema
const forgotSchema = new schema({
	email : {type : String},
	code : {type : String}

})
ai.initialize(mongoose.connection)
forgotSchema.plugin(ai.plugin , {
	model : 'forgotModel',
	field : 'id',
	startAt : 1,
	incrementBy : 1,
})
const forgotModel = mongoose.model('forgotModel',forgotSchema)
module.exports = forgotModel