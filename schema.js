const Joi  = require('joi');
module.exports.listingSchema = Joi.object({
    //inside the schema enter what you want in the request andnhow they should be
    listing : Joi.object(   {           //means inside the listing object what fields you want to be in request and how they should be
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        // Define 'image' as an object to match your template (<%- item.image.url %>)
            image: Joi.object({
            url: Joi.string()
                .allow("", null) 
                .empty("")       
                .default("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT1DflnlW9CQWyZhnX-ev_Fm-sb8SQWAHKIMJqj3cAk1IRKyP-Cj0vvWo&s=10")
        }).default({
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT1DflnlW9CQWyZhnX-ev_Fm-sb8SQWAHKIMJqj3cAk1IRKyP-Cj0vvWo&s=10"
        })
    }) //means there must be a object called listing in the request sent everytime
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object( { 
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    } ).required()
}) 