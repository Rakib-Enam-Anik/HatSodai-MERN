const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../models/userModel');

const findWithId = async (Model, id, options = { } ) => {
    try {
    const options = { password: 0 };
    const item = await Model.findWithId(id, options);

    if (!item){
     throw createError(404, `${Model.modelName} does not exist with this id`);
    }
    return item;

        
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400, 'Invalid item Id');
          }
          throw error;
    }
   
};

module.exports = {findWithId}