const express = require("express");
const router = express.Router();
//import in the FORMS
const {bootstrapField, createProductForm} = require ('../forms');

// #1 import in the Product Model 
const {Product, Category} = require('../models')

router.get('/', async (req, res) => {
// #2 - fetch all the products (ie. select * from products)
let products = await Product.collection().fetch();
res.render('products/index',{
    'products': products.toJSON() //#3 convert collection to JSON
})
})

// function to render the Form 
router.get('/create',async(req,res)=> {
   const productForm = createProductForm();
   res.render('products/create',{
       'form': productForm.toHTML(bootstrapField)
   })
})

//function to process the submitted form 
router.post('/create', async(req,res)=>{
   const productForm = createProductForm(); 
   productForm.handle(req,{
        'success': async (form) => {
         const product = new Product();
         product.set('name', form.data.name);
         product.set('cost', form.data.cost);
         product.set('description', form.data.description);
         await product.save();
         res.redirect('/products'); 
        }, 
        'error': async (form) => {
            res.render('products/create',{
                'forms':form.toHTML(bootstrapField)
            })
        }
   })
})

//Update an existing product 
router.get('/:product_id/update',async (req,res)=>{
    //retrieve the product 
    const productId = req.params.product_id
    const product = await Product.where({
        'id' : productId}).fetch({
            require:true
        });

   const productForm = createProductForm();
   
//  Fill in existing values 
productForm.fields.name.value = product.get('name');
productForm.fields.cost.value = product.get('cost');
productForm.fields.description.value = product.get('description');

res.render('products/update',{
'form': productForm.toHTML(bootstrapField),
'product': product.toJSON()
})
})

//Route to process the submitted form 
router.post ('/:product_id/update', async (req, res) => {
//fetch the product that we want to update
const product = await Product.where({
    'id':req.params.product_id
}).fetch({
    require: true
})

//Process the form 
const productForm = createProductForm();
productForm.handle(req,{
    'success':async(form) => {
        product.set(form.data);
        product.save();
        res.redirect('/products');
    },
    'error': async(form) => {
        res.render('products/update',{
            'form': form.toHTML(bootstrapField),
            'product': product.toJSON()
        })
    }

}) //productForm
})//end of POST

//DELETE PRODUCT 
router.get('/:product_id/delete', async(req,res) => {
//fetch the product that we want to delete 
const product = await Product.where({
    'id': req.params.product_id
}).fetch({
    require: true
});

res.render('products/delete',{
'product': product.toJSON()
})
});

router.post('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
    
    // res.render('products/delete', {
    //     'products':product.toJSON()
    // })

}) //end of post 

router.post('create', async (req,res) => {
const all Categories = await (await Category.fetchAll()).invokeMap((category) => {
    return [category.get('id'), category.get('name')];
})
const productForm = createProductForm(allCategories);
}) //allow the user to select the category which their product belongs to 

router.post('create', async(req,res)=>{
//1. Read in all the categories 
const allCategories = await (await Category.fetchAll()).invokeMap((category) => {
return [category.get('id'), category.get('name')];
}
) //end of post

const productForm = createProductForm(allCategories);
productForm.handle(req, {
    //2. Save data from form into the new product instance 
    const product = new Product(form.data);
    await product.save();
    res.redirect('/products');
}, 
'error': async (form) =>{
res.render('products/create',{
    'form':form.toHTML(bootstrapField)
})
}
})
})//end for productForm.handle

module.express = router;
