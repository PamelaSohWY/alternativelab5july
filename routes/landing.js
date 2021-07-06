const express = require("express");
const router = express.Router(); //creation of new express router

//#2 Add a new route to the express router
router.get("/", (req,res)=> {
    // res.send("welcome")
    res.render('landing/index')
})

router.get('/about-us', (req,res)=>{
    res.render('landing/about-us')
})

router.get('/contact-us', (req,res)=>{
    res.render('landing/contact-us')
})

module.exports= router; //#3 export out the router
