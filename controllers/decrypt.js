const router = require('express').Router()
const helper = require('../helper')
const Files = require('../models/Files')
const fs = require('fs')
const path = require('path')
var encryptor = require('file-encryptor')
router.get("/decrypt/:id",helper.isLogged,async(req,res)=>{
	var decrypt = function(original, encrypted) {
	  encryptor.decryptFile(
	    encrypted,
	    'public/files/decrypted/decrypted-' + original,
	    key,
	    function(err) {
	      // console.log(original + ' decryption complete.');
	    }
	  );
	};

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
		else if (check.type!= "encrypted"){
			req.flash('info',{type : "error",msg : 'This file is not encrypted!!'})
			res.redirect('back')
		}
		else if (check.email!=req.session.email){
			req.flash('info',{type : "error",msg : 'This is not your file!!'})
			res.redirect('back')
		}
		else{
					var fname = check.file.substr(10)
					var todo = "/files/decrypted/decrypted-"+fname
					decrypt(fname,check.original)
					req.flash('info',{type : "success",msg : `File decrypted , Click <a href="${todo}" download>here</a> to download decrypted file!`})
					res.redirect('back')

		}
	}
})
module.exports = router