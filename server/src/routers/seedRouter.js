const express = require("express");
const { seedUsser } = require('../controllers/seedController');
const seedRouter = express.Router();

seedRouter.get("/users", seedUser);

module.exports = seedRouter;