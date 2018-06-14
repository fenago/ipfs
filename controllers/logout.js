const router = require('express').Router()
const helper = require('../helper')
router.get('/logout',(req,res)=>{
	req.session.destroy(err=>{
		if(err){console.log(err)}
		res.redirect("/login")
	})
})

module.exports = router