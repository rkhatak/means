const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var OplogWatcher = require('mongo-oplog-watcher');
var oplog = new OplogWatcher({
    host:"mongodb://localhost:27017" ,ns: "search.brand"
  });

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/shoppingcart', (err, db) => {
        if (err) return console.log(err);
        console.log('db connected');
        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/products', (req, res) => {
    connection((db) => {
        db.collection('product').find({'addcart':false}).toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
router.get('/cartaddedproduct', (req, res) => {
   connection((db) => {
       db.collection('product').find({'addcart':true}).toArray()
           .then((users) => {
               response.data = users;
               res.json(response);
           })
           .catch((err) => {
               sendError(err, res);
           });
   });
});


router.put('/products/:pid', (req, res) => {
   connection((db) => {
      let pid=new ObjectID(req.params.pid);
      db.collection('product').find({'_id':pid}).toArray()
          .then((users) => {
             console.log(req.body);
            db.collection('product').update({'_id':pid},{"$set" :{'addcart':req.body.addcart}}).then((d) => {
               response.data = d;
               res.json(response);
           })
          })
          .catch((err) => {
              sendError(err, res);
          });
  });
   
});


   
  oplog.on('insert', function(doc) {
      console.log(doc);
  });
// watcher.watch.query(
//     { collName: 'brand' },   //mydb.mycollection
//     function(err, query) {
//         if (err) console.log('Error: ', err);
//         query.on('data', function(event) {
//             console.log('something changed:', event) });
//     }
// );
module.exports = router;