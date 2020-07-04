var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var uniqid = require('uniqid');

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    const db = client.db('jokester');
    const usersCollection = db.collection('users');
    const jokesCollection = db.collection('jokes');

    app.use(cors());
    
    app.use(bodyParser.json());

    
    app.post('/jokes', function(req, res){
        console.log('Posting joke!')
        const newJoke = {_id: uniqid.time(),username: req.body.username ,setup : req.body.setup, punchline: req.body.punchline, likedBy : [], dislikedBy : []}
        jokesCollection.insertOne(newJoke)
        .then((result) => {
            res.send()
        })
        .catch((error) => res.status(400).send());
    });


    
    app.post('/:username', function(req, res) {
        console.log('Logging user in!')
        usersCollection.findOne({_id : req.params.username})
        .then((result) => {
            if(req.body.password === result.password){
                res.send({currentUser : req.params.username})
            }
            res.status(400).send();
        })
        .catch((error) => res.status(400).send());
    });

    app.post('/users', function(req, res) {
        console.log('Creating user account!')
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
