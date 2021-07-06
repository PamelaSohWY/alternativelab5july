//import in caolan forms 
const forms = require("forms");

//create some shortcuts 
const fields = forms.fields;
const validators = forms.validators; 

var bootstrapField = function (name,object){
if(!Array.isArray(object.widget.clases)){object.eidget.classes=[]}

if(object.widget.classes.indexOf('form-control') === -1) {
object.widget.classes.push('form-control');
}

var validationclass = object.value && !object.error ? 'isvalid':'';
validationclass = object.error ? 'is-invalid' : validationclass;
if (validationclass){
    object.widget.classes.push(validationclass);
}

var label = object.labelHTML(name);
var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>':'';

var widget = object.widget.toHTML(name, object);
return '<div class="form-group">'+ label + widget + error + '</div>';

};//bootstrap component

const createProductForm = () => {
return forms.create({
'name': fields.string({
required: true,
errorAfterField:true,
cssClasses:{
    label:['form-label']
}
}),
'cost': fields.string({
required: true,
errorAfterField: true,
cssClasses:{
label:['form-label']
},
'validators':[validators.integer()]
}),
 //return
'description': fields.string({
    required: true,
    errorAfterField: true,
    cssClasses:{
    label:['form-label']
},

}),

})
};

module.exports = {createProductForm, bootstrapField};

// https://github.com/caolan/forms 
// refer to other validators