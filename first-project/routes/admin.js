const express = require('express');
const router = express.Router();

// /admin/add-product : ngầm định
router.get('/add-product', (req, res, next) => {
    res.send("<form action='/admin/product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form>");
});

// /admin/product
router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;