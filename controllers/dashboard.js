const router = require('express').Router()
const helper = require("../helper")
const Files = require('../models/Files')
const moment = require('moment')
router.get('/dashboard',helper.isLogged,async (req,res)=>{
	var my_files = await Files.find({$and : [{type : "unencrypted"},{email : req.session.email},{admin : false}]}).sort('-id')
	var my_enfiles = await Files.find({$and : [{type : "encrypted"},{email : req.session.email},{admin : false}]}).sort('-id')
	res.render("dashboard",{title : "Dashboard",my_files,my_enfiles,moment})
})

module.exports = router