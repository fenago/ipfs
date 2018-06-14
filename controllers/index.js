const router = require('express').Router()
router.get('/',(req,res)=>{
	res.send(`Welcome Home , <a href="/login">Login</a> or <a href="/register">Register</a> `)
})

module.exports = router