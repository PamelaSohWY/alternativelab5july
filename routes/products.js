const express = require("express");
const router = express.Router();
//import in the FORMS
const {bootstrapField, createProductForm} = require ('../forms');

// #1 import in the Product Model 
const {Product, Category, Tag} = require('../models')

router.get('/', async (req, res) => {
// #2 - fetch all the products (ie. select * from products)
let products = await Product.collection().fetch({
    WithRelated:['category']
});
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
        let {tags, ...productData} = form.data;
         const product = new Product();
         product.set('name', form.data.name);
         product.set('cost', form.data.cost);
         product.set('description', form.data.description);
         await product.save();
         //save the many to many relationships 
         if (tags){
             await product.tags().attach(tags.split(","));
         }
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
        'id' : parseInt(productId)
    }).fetch({
            require:true,
            withRelated:['tags']
        });

//fetch all the tags 
const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')]);

//fetch all the categories 
const allCategories = await Category.fetchAll().map((category)=>{
    return [category.get('id'), category.get('name')];
})

   const productForm = createProductForm(allCategories, allTags);
   
//  Fill in existing values 
productForm.fields.name.value = product.get('name');
productForm.fields.cost.value = product.get('cost');
productForm.fields.description.value = product.get('description');
productForm.fields.category_id.value = product.get('category_id');

//fill in the multi-select for the tags 
let selectedTags = await product.related('tags').pluck('id');
productForm.fields.tags.value=selectedTags;

res.render('products/update',{
'form': productForm.toHTML(bootstrapField),
'product': product.toJSON()
})
})

//Route to process the submitted form 
router.post ('/:product_id/update', async (req, res) => {
// fetch all the categories
const allCategories = await (await Category.fetchAll()).map((category)=>{
    return [category.get('id'), category.get('name')]
})

//fetch the product that we want to update
const product = await Product.where({
    'id':req.params.product_id
}).fetch({
    required: true
})

//Process the form 
const productForm = createProductForm(allCategories);
productForm.handle(req,{
    'success':async(form) => {
        let (tags, ...productData) = form.data;
        product.set(form.data);
        product.save();

//update the tags
let tagIds = tags.split(',');
let existingTagIds = await product.related('tags').pluck('id');

//remove all the tags that arent selected anymore 
let toRemove = existingTagIds.filter(id => tagIds.includes(id) === false);
await product.tags().detach(toRemove);
//add in all the tags selected in the Form 
await product.tags().attach(tagIds);

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
const allCategories = await  Category.fetchAll().map((category) => {
    return [category.get('id'), category.get('name')];
})

const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

const productForm = createProductForm(allCategories, allTags);

res.render ('products/create',{
    'form': productForm.toHTML(bootstrapField)
})

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
