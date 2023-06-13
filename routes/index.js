const express = require('express');

const db = require('../db');
const productController = require('../controllers/productController');
const customerController = require('../controllers/customerController');
const router = express.Router();

const { demoCategories } = require('../controllers/constants');

const catchErrors = (fn) => (req, res, next) => {
  return fn(req, res, next).catch((error) => {
    console.error(error.message);
    res.status(500).send('Server error')
  })
}

// get all products
router.get('/products', catchErrors(productController.getAllProducts));

// get products by category
router.get('/products/cat/:category', catchErrors(productController.getProductsByCategory));

// search products
router.get('/products/search', catchErrors(productController.searchProducts));

// create a customer
router.post('/customer/new', catchErrors(customerController.createCustomer));

// get all available demographics for each category
router.get('/allDemos', catchErrors(customerController.getAllDemos));

// get demo counts and percentages
router.post('/customers/:product_id/', catchErrors(customerController.getDemoDataByProductId));

module.exports = router;
