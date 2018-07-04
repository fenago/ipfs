const router = require('express').Router()
const helper = require('../helper')
const User = require('../models/User')
const Keys = require('../models/Keys')
const moment = require('moment')
const Assign = require('../models/Assign')
const Files = require('../models/Files')


//get list of users

router.get('/admin/get-users/:id',helper.isAdmin,async(req,res)=>{
	var id = req.params.id
	id = parseInt(id)
	var us = []
	var users = await User.find({}).sort("-id")
	for(u of users){
		var ass = await Assign.findOne({$and : [{fid : id},{email : u.email}]})
		if(ass == null){
			us.push(u.email)
		}
	}
	res.send(us)
})


//list of assigned users
router.get('/admin/get-assigned-users/:id',helper.isAdmin,async(req,res)=>{
	var id = req.params.id
	id = parseInt(id)
	var at = []
	var ass = await Assign.find({fid : id})
	for (a of ass){
		at.push(a.email)
	}
	res.send(at)
})

//assign a file

router.post("/admin/assign/:id",helper.isAdmin,async(req,res)=>{
	var id = req.params.id
	var users = req.body.users
	if(isNaN(id)){
		res.send({
			type : "error",
			msg : "Invalid Id"
		})
	}
	else{
		id = parseInt(id)
		if(users.length>0){

			Files.findOne({id},(err,succ)=>{
				if(err){console.log(err)}
				if(succ){
					users.forEach(data=>{
						new Files({
							email : data,
							file : succ.file,
							date : new Date(),
							type : succ.type,
							original : succ.original,
							hash : succ.hash,
							key : succ.key,
							assign : true,
							by : req.session.email,
							aid : id
						}).save(()=>{})
					})
				}
			})

			users.forEach(data=>{
				new Assign({
					email : data,
					from : req.session.email,
					fid : id,
					date : new Date()
				}).save(()=>{})

			})
			res.send({
				type : 'success',
				msg : "Successfully assigned the doc !!"
			})
		}
	}
})

router.get('/be-admin',helper.isLogged,async(req,res)=>{
	var che = await User.count({isAdmin : true})
	if(che>0){
		res.send("There is already an admin")
	}
	else{
		User.findOne({email : req.session.email},(err,succ)=>{
			if(err){console.log(err)}
			if(succ){
				succ.isAdmin = true
				succ.save(()=>{
					res.redirect('/admin')
				})
			}
		})
	}
})
router.get('/admin',helper.isAdmin,async(req,res)=>{
	var files = await Files.find({admin : true}).sort('-id')
	res.render('admin/index',{title : "Admin Panel",files,moment})
})


//change keys

router.get('/admin/change-keys',helper.isAdmin,async (req,res)=>{
	var key = await Keys.findOne({}).sort('-id')
	res.render('admin/change-keys',{title : "Change Encryption/Decryption Keys",key})
})

router.post('/admin/change-keys',helper.isAdmin,async(req,res)=>{
	var key = helper.safe(req.body.key)
	if(key.length<5){
		req.flash('info',{type : "error",msg : "Key should be of atleast 5 characters"})
		res.redirect('back')
	}
	else{
		new Keys({
			email : req.session.email,
			date : new Date(),
			key
		})
		.save((err,succ)=>{
			if(err){console.log(err)}
			if(succ){
				req.flash('info',{type : "success",msg : "Successfully updated the secret key"})
				res.redirect('back')
			}
		})
	}
})

//upload file by admin

const IPFS = require('ipfs-api')
const node = new IPFS(ipfsconfig)
const IPFSecret = require('ipfsecret'),
    ipfsecret = new IPFSecret(ipfsconfig2);

const fs = require('fs')
const path = require('path')


const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/')
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substr(2, 10)+file.originalname)
  }
})
var upload = multer({ storage })



router.post('/admin/post-files',upload.array('files', 120),helper.isAdmin,async(req,res)=>{
	//key for encrypting
	var keyt = await Keys.findOne({}).sort('-id')
	var key
	if(keyt==null){
		key = "Super secret key"
	}
	else{
		key = keyt.key
	}
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
								key,
								admin : true
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
					key,
					admin : true
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


//admin see all list of uploaded files by users

router.get('/admin/all',helper.isAdmin,async(req,res)=>{
	var files = await Files.find({$and : [{admin : false},{assign : false}]})
	res.render('admin/all',{title : "Files by Users",files,moment})
})

//get users list by admin

router.get('/admin/users',helper.isAdmin,async(req,res)=>{
	var users = await User.find({}).sort('-id')
	res.render('admin/users',{title : "Users Management System",users})
})

router.post('/admin/users',helper.isAdmin,async(req,res)=>{
	var email = helper.safe(req.body.email)
	var fname = helper.safe(req.body.fname)
	var lname = helper.safe(req.body.lname)
	var isAdmin = helper.safe(req.body.isAdmin)
	var ad
	if(isAdmin == true || isAdmin == "true"){
		ad = true
	}
	else{
		ad = false
	}
	if(email == req.session.email){
		req.flash("info",{msg : "You cannot edit your own details",type : 'error'})
		res.redirect('back')	
	}
	else{
		User.findOne({email},(err,succ)=>{
			if(err){console.log(err)}
			if(succ){
				succ.fname = fname
				succ.lname = lname
				succ.isAdmin = ad
				succ.save(()=>{
					req.flash("info",{msg : "Successfully edited the user details",type : 'success'})
					res.redirect('back')
				})
			}
		})
	}
})

module.exports = router