const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product',{ 
    // creates a Product Model and store it in the Product Object 
    tableName:'products',
    //adjust tableName
    category(){
        return this.belongsTo('Category')
    }
})

const Category = bookshelf.model('Category',{
    tableName:'categories',
    products() {
        return this.hasMany('Product');
    }
})

module.exports = {Product, Category};
