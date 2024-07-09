const Store = require('../models/store');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.getAllStores = (req, res) => {
    Store.find({}, function(err, stores) {
        if (err) {
            res.status(400).send("An error occurred");
        } else {
            let storeList = [];
            for (let i = 0; i < stores.length; i++) {
                storeList.push({id: stores[i]._id, name: stores[i].name, description: stores[i].description});
            }
            res.send(storeList);
        }
    });
}
