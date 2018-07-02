const router = require('express').Router()
const helper = require('../helper')
const Files = require('../models/Files')
const fs = require('fs')
const path = require('path')
const IPFSecret = require('ipfsecret'),
    ipfsecret = new IPFSecret(ipfsconfig2);
router.get("/decrypt/:id",helper.isLogged,async(req,res)=>{
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

			var hash = check.hash
			var gkey = check.key
			ipfsecret.get(hash, gkey)
		    .then((stream) => { stream.on('data', (obj) => {
		        if (obj.content) {
		            var filename = path.basename(obj.path),
		                writeable = fs.createWriteStream('public/files/decrypted/'+check.file);
		             var dfile = '/files/decrypted/'+check.file
		            obj.content.pipe(writeable);
		            obj.content.on('finish', () => {
		                req.flash('info',{type : "success",msg : `File decrypted , Click <a href="${dfile}" download>here</a> to download your file`})
						res.redirect('back')
		            });
		            obj.content.on('error', (err) => {
		                console.log('Error: ',err);
		            });
		        }
		    });})
		    .catch(err => {
		        console.log(err);
		    });



					// var fname = check.file.substr(10)
					// var todo = "/files/decrypted/decrypted-"+fname
					// decrypt(fname,check.original)
					

		}
	}
})
module.exports = router