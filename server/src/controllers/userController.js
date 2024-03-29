const createError = require('http-errors');
const fs = require('fs').promises;


const User = require("../models/userModel");
const { findWithId } = require("../services/findItem");
const { successResponse } = require('./responseController');


const getUsers =  async (req, res, next )=>{
    try {
        const search = req.query.search || "";
        const page =  Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegExp = new RegExp('.*' + search + ".*", 'i');
        const filter = {
            isAdmin: {$ne: true},
            $or:[
                {name: {$regex: searchRegExp }},
                {email: {$regex: searchRegExp }},
                {phone: {$regex: searchRegExp }},

            ]
        };
        
        const options = { password: 0 };
        // 10 users
        const users = await User.find(filter, options).limit(limit)
        .skip(page -1 * limit);

        const count = await User.find().countDocuments();
        
        if(!users) throw createError(404, "no users found");

        res.status(200).send({
            message: 'users were returned',
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page-1 : null,
                nextPage: page + 1 > 0 <= Math.ceil(count / limit) ? page + 1 : null,

            }
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'users were returned successfully',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        })
        
    } catch (error) {
        next(error);
    }
   
};

const getUserById =  async (req, res, next )=>{
    try {
       
        const id = req.params.id;
        const options = { password: 0 }
        const user = await findWithId(User, id, options);

        const userImagePath = user.image;


        return successResponse(res, {
            statusCode: 200,
            message: 'users were returned successfully',
            payload: {user},
        })
        
    } catch (error) {
        next(error);
    }
   
};

const deleteUserById =  async (req, res, next )=>{
    try {
       
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);
        
        const userImagePath = user.image;
        deleteImage(userImagePath);

         await User.findByIdAndDelete({
            _id: id,
             isAdmin: false, 
        });

       

        return successResponse(res, {
            statusCode: 200,
            message: 'users were deleted successfully',
            payload: {user},
        });

        
    } catch (error) {
        next(error);
    }
   
};

module.exports = { getUsers, getUserById, deleteUserById };
