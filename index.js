const express = require('express')
const app = express()
const csv = require("fast-csv");
const fs = require("fs")
const stream = fs.createReadStream("public/products.csv");

const port = process.env.PORT

let products = {}
csv
 .fromStream(stream, {headers : true})
 .on("data", function(data){
          products[data.id] = data;
      });

const general_info = {
    pixel_id : process.env.PIXEL_ID,
    ga : process.env.GOOGLE_ANALYTICS,
    business_name : process.env.BUSINESS_NAME
}

app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/', function (req, resp) {
    const data = {
        products : products,
        general_info : general_info
    };
    resp.render('index', data);
})

app.get('/:id', function (req, resp) {
    if(! (req.params.id in products)){
        resp.redirect('/');
    }
    const data = {
        product : products[req.params.id],
        general_info : general_info
    };
    resp.render('product-detail', data);
})

app.post('/:id', function (req, resp) {
    if(! (req.params.id in products)){
        resp.redirect('/');
    }
    const data = {
        product : products[req.params.id],
        general_info : general_info
    };
    resp.render('purchased', data);
})

app.listen(port, function () {
      console.log('App listening on port ' + port + ' !')
})
