const router = require('express').Router()
const helper = require('../helper')
const Files = require('../models/Files')
const fs = require('fs')
router.get("/delete-file/:id",helper.isLogged,async(req,res)=>{
	var id = helper.safe(req.params.id)
	if(isNaN(id)){
		req.flash('info',{type : "error",msg : 'Invalid Id'})
		res.redirect('back')
	}
	else{
		var check = await Files.findOne({id})
		if(check == null){
			req.flash('info',{type : "error",msg : 'Invalid FileId ! File doesnot exists'})
			res.redirect('back')
		}
		else if (check.email!=req.session.email){
			req.flash('info',{type : "error",msg : 'This is not your file!!'})
			res.redirect('back')
		}
		else{
			// fs.unlinkSync(check.original)
			Files.remove({$and : [{email : req.session.email},{id}]},(err,succ)=>{
				if(err){console.log(err)}
				if(succ){
					req.flash('info',{type : "success",msg : 'Your file have been removed successfully !!'})
					res.redirect('back')
				}
			})
		}
	}
})
module.exports = router