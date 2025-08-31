import mongoose, { Schema, mongo } from "mongoose";

const addressesSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        default: ""
    },
    address: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    city: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    state: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    pinCode: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    phoneNumber: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        default: ""
    },
    locality: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    landmark: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: ""
    },
    alternatePhoneNumber: {
        type: String,
        required: false,
        lowercase: true,
        trim: true,
        default: ""
    },
    addressType: {
        type: String,
        required: true,
        // enum: ['Residential', 'Commercial'],
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Address = mongoose.model('Address', addressesSchema)

const userOtpSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            default: "unknown",
            index: true,
            validate: [/^\+[0-9]{1,3}[0-9\s.-]{7,15}$/, 'Invalid phone number']
        },
        otp:
        {
            otpCode: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            otpGeneratedTime: {
                type: Date,
                default: null
            },
            otpExpirationTime: {
                type: Date,
                default: null
            }
        }
    },
    { timestamps: true })

const UserOtp = mongoose.model('UserOtp', userOtpSchema)


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "unknown"
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "unknown"
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "unknown",
        index: true,
        // validate: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address']
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "unknown"
    },
    phone: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "unknown",
        index: true,
        validate: [/^\+[0-9]{1,3}[0-9\s.-]{7,15}$/, 'Invalid phone number']
    },
    otp: [
        {
            otpCode: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            otpGeneratedTime: {
                type: Date,
                default: null
            },
            otpExpirationTime: {
                type: Date,
                default: null
            }
        }
    ],
    // otpAndPhone: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: UserOtp,

    //     }
    // ],
    updatedAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        default: "user"
    },
    refreshToken: {
        type: String,    //cloudinary url
    },
    address: [
        // {
        //     type: Schema.Types.ObjectId,
        //     ref: Address
        // }
        {
            name: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                index: true,
                default: ""
            },
            address: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            city: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            state: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            pinCode: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            phoneNumber: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                index: true,
                default: ""
            },
            locality: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            landmark: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                default: ""
            },
            alternatePhoneNumber: {
                type: String,
                required: false,
                lowercase: true,
                trim: true,
                default: ""
            },
            addressType: {
                type: String,
                required: true,
                default: ''
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    cart: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            productName: {
                type: String,
                required: true,
                trim: true,
                default: ""
            },
            price: {
                type: Number,
                required: true,
                default: 0
            },
            discount: {
                type: String,
                required: false,
                default: ""
            },
            size: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },
            color: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },
            TagId: {
                type: String,  // store as string if it's a code, not an ObjectId
                required: false,
                trim: true,
                default: ''
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            image: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },
            expectedDelivery: {
                type: Date,   // ✅ New field
                required: false,
                default: null
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // wishlist field also need
    wishlist: [
        // {
        //     productId: {
        //         type: Schema.Types.ObjectId,
        //         required: true,
        //         ref: 'Product'
        //     },
        //     productName: {
        //         type: String,
        //         required: true,
        //         trim: true,
        //         default: ""
        //     },
        //     price: {
        //         type: Number,
        //         required: true,
        //         default: 0
        //     },
        //     size: {
        //         type: String,
        //         required: false,
        //         trim: true,
        //         default: ""
        //     },
        //     color: {
        //         type: String,
        //         required: false,
        //         trim: true,
        //         default: ""
        //     },
        //     TagId: {
        //         type: Schema.Types.ObjectId,
        //         required: false,
        //         ref: 'Tag'
        //     },
        //     quantity: {
        //         type: Number,
        //         required: true,
        //         default: 1
        //     },
        //     image: {
        //         type: String,
        //         required: false,
        //         trim: true,
        //         default: ""
        //     }
        // }
    ],
    saveForLater: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            productName: {
                type: String,
                required: true,
                trim: true,
                default: ""
            },
            price: {
                type: Number,
                required: true,
                default: 0
            },
            discount: {
                type: String,
                required: false,
                default: ""
            },
            size: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },

            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            image: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },
            expectedDelivery: {       // ✅ Add this field
                type: Date,
                required: false,
                default: null
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true })


const User = mongoose.model('User', userSchema)


export { User, Address }