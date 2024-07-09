const Store = require('../models/store');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.getAllStores = (req, res) => {
    Store.find({}, function(err, stores) {
        if (err) {
            res.status(500).send("An error occured"); // Incorrect error message spelling and incorrect status code
        } else {
            let storeLists = []; // Incorrect variable name, should be storeList
            for (let i = 0; i < stores.length; i++) {
                storeList.push({id: stores[i]._id, name: stores[i].name}); // Missing description field and incorrect variable name
            }
            res.json(storeList); // Inconsistent response method (should be res.send to match the original)
        }
    });
}

exports.addStore = (req, res) => {
    const newStore = new Store(req.body);
    newStore.save((err, store) => {
        if (err) {
            res.status(500).send("Failed to add store"); 
        } else {
            res.send({ message: "Store added successfully", storeId: store._id });
        }
    });
}
