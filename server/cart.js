const express = require('express');
const fs = require('fs');
const router = express.Router();
const moment = require('moment');


router.get('/', (req, res) => {
  fs.readFile('db/cart.json', 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else { 
      res.send(data)
    }
  })
});

router.all('/*', (req, res, next) => {
  fs.readFile('db/stats.json', 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      let stats = JSON.parse(data);
      fs.readFile('db/products.json', 'utf-8', (err, data) => {
        stats.push({
          action: req.method,
          name: req.method === 'POST' ? req.body.product_name : JSON.parse(data).find(el => el.id_product === +req.params.id).product_name,
          time: moment(),
        });
        fs.writeFile('db/stats.json', JSON.stringify(stats, null, 4), (err) => {
          if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
          }
        })
      });
    }
  });
  next();
});

router.post('/', (req, res) => {
  handler(req, res, cart => {
    cart.contents.push(req.body);
  });
});

router.put('/:id', (req, res) => {
  handler(req, res, cart => {
    let product = cart.contents.find(el => el.id_product === +req.params.id);
    product.quantity += req.body.quantity;
  });
});

router.delete('/:id', (req, res) => {
  handler(req, res, cart => {
    let product = cart.contents.find(el => el.id_product === +req.params.id);
    if (product.quantity > 1) {
      product.quantity--;
    } else {
      cart.contents.splice(cart.contents.indexOf(product), 1);
    }
  });
});

const handler = (req, res, func) => {
  let file = 'db/cart.json';
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      let cart = JSON.parse(data);
      func(cart);
      fs.writeFile(file, JSON.stringify(cart, null, 4), (err) => {
        if (err) {
          res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
          res.send('{"result": 1}');
        }
      })
    }
  })
};

module.exports = router;
