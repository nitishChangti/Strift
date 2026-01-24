import mongoose, { Mongoose, Schema } from "mongoose";
import { Category } from "./category.js";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },
        TagId: {
            type: String,
            required: true
        },
        CategoryName: {
            type: String,
            required: true
        }
        ,
        CategoryTagId: {
            // type: Schema.Types.ObjectId,
            // ref: 'Category',
            type: String,
            required: true
        },
        subCategoryName: {
            type: String,
            // required: true
        }
        ,
        subCategoryTagId: {
            type: String,
            // required: true
        },
        gender: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        images: [{
            type: String,
            required: true
        }],
        price: {
            type: String,
            required: true,
            min: 0
        },
        discount: {
            type: String,
            required: true
        },
        //countInStock
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        ratings: {
            type: Number,
            // required: true,
        },
        reviews: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                comment: {
                    type: String,
                    // required: true
                },
                ratings: {
                    type: Number,
                    // required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        variants: {
            size: [{
                type: String,
                required: true
            }],
            color: [{
                type: String,
                required: true
            }],
            // stock: {
            //     type: Number,
            //     required: true
            // }
        },
        productDetails: {
            type: Schema.Types.Mixed, // Allows dynamic key-value pairs (flexible structure)
        }
    },
    {
        timestamps: true
    }
)



const product = mongoose.model("product", productSchema)

export { product }