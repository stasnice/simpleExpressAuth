const mongoose = require('mongoose');
const { Types, Schema } = require('mongoose');

const ProductSchema = new Schema ({
    id: Number,
    name: String,
    price: Types.Decimal128,
})
const Product = mongoose.model('Product', ProductSchema);