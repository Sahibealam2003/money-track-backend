const express =require('express')
const {protect} = require('../middleware/authMiddleware')
const {getDashboardData} = require('../controllers/getDashboardData')
const route = express.Router()

route.get('/',protect,getDashboardData);

module.exports=route