const router = require('express').Router()
const helper = require("../helper")
const Files = require('../models/Files')
const path = require('path')
const multer = require('multer')
var encryptor = require('file-encryptor')
var fs = require('fs')



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/')
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substr(2, 10)+file.originalname)
  }
})
var upload = multer({ storage })
router.post('/post-files',upload.array('files', 120),helper.isLogged,async (req,res)=>{
	var type = helper.safe(req.body.type)
	if(type == "unencrypted"){
		req.files.forEach(datas=>{
			let data = new Files({
				email : req.session.email,
				file : datas.path,
				date : new Date(),
				type,
				original : datas.path
			})
			data.save(()=>{
				
			})
		})

		req.flash('info',{type : "success",msg : "Your file has been uploaded successfully without encryption !! "})
		res.redirect('back')
	}
	else{

		var encrypt = function(input) {
		  encryptor.encryptFile(
		    input,
		    input + '.data',
		    key,
		    function(err) {
		      // console.log(input + ' encryption complete.');
		    }
		  );
		};
		req.files.forEach(datas=>{
			encrypt(datas.path)
			let data = new Files({
				email : req.session.email,
				file : datas.filename,
				date : new Date(),
				type,
				original : datas.path+'.data'
			})
			data.save(()=>{
				
			})
			fs.unlinkSync(datas.path)
		})

		req.flash('info',{type : "success",msg : "Your file has been uploaded successfully with encryption !! "})
		res.redirect('back')


	}
})

module.exports = router