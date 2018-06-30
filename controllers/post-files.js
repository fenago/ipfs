const router = require('express').Router()
const helper = require("../helper")
const Files = require('../models/Files')
const path = require('path')
const multer = require('multer')
var fs = require('fs')
const IPFS = require('ipfs-api')
const node = new IPFS(ipfsconfig)
const IPFSecret = require('ipfsecret'),
    ipfsecret = new IPFSecret(ipfsconfig2);
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
		req.files.forEach((datas,i)=>{
				var dd = fs.readFileSync(datas.path);
				 node.files.add(dd, (er, fil) => {
				 	if(er){console.log(er)}
				 	if(fil){
				 			let data = new Files({
								email : req.session.email,
								file : datas.path,
								date : new Date(),
								type,
								original : datas.path,
								hash : fil[0].hash,
								key
							})
							data.save(()=>{
								fs.unlinkSync(datas.path)
								if(i+1 == req.files.length){
									req.flash('info',{type : "success",msg : "Your file has been uploaded successfully without encryption !! "})
									res.redirect('back')
								}
							})
				 	}
				})
			
		})

		
	}
	else{

		req.files.forEach((datas,i)=>{
			ipfsecret.add(datas.path, key)
		    .then(results => {
		        	let data = new Files({
					email : req.session.email,
					file : datas.filename,
					date : new Date(),
					type,
					original : datas.path,
					hash : results[0].hash,
					key
				})
				data.save(()=>{
					fs.unlinkSync(datas.path)
					if(i+1 == req.files.length){
						req.flash('info',{type : "success",msg : "Your file has been uploaded successfully with encryption !! "})
						res.redirect('back')
					}
				})
		    })
		    .catch(err => {
		        console.error(err);
		    });
			
			})

	}
})
module.exports = router