const User = require("../models/userModel")
const seedRouter = async (req, res, next) => {
    try {
        // deleting all existing users
        await User.deleteMany({});

        // inserting all existing users
        const users = await User.insertMany(data.users);
        // successful response
        return res.status(201).json(users);

    } catch (error) {
        next(error);
        
    }
};

module.exports = { seedUser };