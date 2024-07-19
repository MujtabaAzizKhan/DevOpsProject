const { Product, CartItem } = require('../models/product'); 
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => { 
  Product.findById(id) 
    .populate('products.product', 'name price')
    .exec((err, product) => { 
      if (err || !product) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.product = product; 
      next();
    });
};

exports.create = (req, res) => {

  req.body.product.user = req.profile; 
  const product = new Product(req.body.product); 
  product.save((error, data) => { 
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json(data);
  });
};

exports.listProducts = (req, res) => { 
  Product.find() 
    .populate('user', '_id name address')
    .sort('-created')
    .exec((err, products) => { 
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(products); 
    });
};

exports.getStatusValues = (req, res) => {
  res.json(Product.schema.path('status').enumValues); 
};

exports.updateProductStatus = (req, res) => { 
  Product.update( 
    { _id: req.body.productId }, 
    { $set: { status: req.body.status } },
    (err, product) => { 
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(product); 
    }
  );
};

exports.deleteProduct = (req, res) => { 
  Product.remove({ _id: req.params.productId }) 
    .exec((error, result) => {
      if (error) {
        return res.status(200).json({ 
          success: "Product deletion failed", 
        });
      }
      res.send("Product successfully deleted");
    });
};