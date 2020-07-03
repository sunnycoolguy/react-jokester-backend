var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    const db = client.db('jokester');
    const usersCollection = db.collection('users');

    app.use(cors());
    
    app.use(bodyParser.json());

    app.post('/users', function(req, res) {
        console.log('Just got a post request to users!')
        const newUser = {_id : req.body.username, password: req.body.password};
        usersCollection.insertOne(newUser)
        .then((result) => {
            console.log(result);
            res.send({currentUser : req.body.username});
        })
        .catch((error) => res.status(400).send(error));
    });

    app.listen(4001, () => {
        console.log('I am listening!');
    })

});
