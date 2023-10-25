const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const {defaultImagePath} = require("../secret");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is required'],
        trim: true,
        minlength: [3, ' The length of user name can be minimum 3 characters'],
        maxlength: [31, ' The length of user name can be maximum 31 characters']
    },
    email: {
        type: String,
        required: [true, 'user email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v)  {
                return /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
        },
        password: {
            type: String,
            required: [true, 'User password is required'],
            minlength: [6, ' The length of user name can be minimum 6 characters'],
            set: (v) =>  bcrypt.hashSync(v, bcrypt.genSaltSync(10));

            //123456
        },
        image: {
            type: String,

            default:
                defaultImagePath,
        },

        address: {
            type: String,
            required: [true, 'User address is required'],
        },
        phone : {
            type: String,
            required: [true, 'User address is required'],
        },
        isAdmin : {
            type: Boolean,
            default: false
        },
        isBanned : {
            type: Boolean,
            default: false
        }
    }
    
, {timestamp: true});

const User = model('Users', userSchema);
module.exports = User;
