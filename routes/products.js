const express = require("express");
const router = express.Router();

// #1 import in the Product Model 
const {Product} = require('../models')

router.get('/', async (req, res) => {
// #2 - fetch all the products (ie. select * from products)
let products = await Product.collection().fetch();
res.render('products/index',{
    'products': products.toJSON() //#3 convert collection to JSON
})

})

module.express = router;
