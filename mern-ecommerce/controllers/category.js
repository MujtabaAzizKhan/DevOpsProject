const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category doesn't exist",
      });
    }
    req.category = category;
    next();
  });
};

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  // console.log('req.body', req.body);
  // console.log('category update param', req.params.categoryId);
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Category deleted',
    });
  });
};

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.addProductToCategory = (req, res) => {
  const { categoryId } = req.params;
  const { productId } = req.body;

  Category.findById(categoryId, (err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }

    Product.findById(productId, (err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found",
        });
      }

      // Add the product to the category's products list
      category.products.push(productId);

      category.save((err, updatedCategory) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(updatedCategory);
      });
    });
  });
};