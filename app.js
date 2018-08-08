const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static/css')));
app.set('views', path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// ------------ MONGOOSE SCHEMA -----------------
mongoose.connect('mongodb://localhost:27017/message_dashboard', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var CommentSchema = new mongoose.Schema({
    content: String,
    title: String,
    creator: String
}, {timestamps: true});

var MessageSchema = new mongoose.Schema({
    content: String,
    comment: [CommentSchema]
}, {timestamps: true});

var UserSchema = new mongoose.Schema({
    first_name: {type: String, required: true, minlength: 1},
    last_name: {type: String, required: true, minlength: 1},
    message: [MessageSchema]
}, {timestamps: true})

    // User Model
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

// Message Model
mongoose.model('Message', MessageSchema);
var Message = mongoose.model('Message');

// Comment Model
mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');

// ---------- ROUTES AND LOCATIONS BELOW ---------------
app.get('/', function(req, res){
    Message.find({}, function(errs, messages){
        if(errs){
            console.log(errs);
        } else {
            res.json(messages)
        }
    })
})

app.post('/user', function(req, res){
    User.create({
        first_name: "Anton",
        last_name: "Huang",
    }, function(errs, data){
        if(errs){
            console.log(errs);
        } else{
            res.json(data);
        }
    })
});

app.post('/message', function(req, res){
        // initiated/Hardcode userData & MessageData
    var userData = {first_name: "Sher", last_name: "Her"};
    var comment_data = {content: "Who would like to sleep as well?"};

    Message.create({
        content: "Hello World",
        comment: comment_data,
    }, function(errs, comment){
        if(errs){
            console.log(errs);
        } else {
            res.json(comment);
        }
    });
});

app.post('/comment', function(req, res){
    var userData = {first_name: "Anton", last_name: "Huang"};
    var message_data = {content: "I like pink panthers!"};

    Comment.create({
        content: "I dont like your message!",
        title: "Dislike message Yo!",
        creator: userData
    }, function(errs, message){
        if(errs){
            console.log(errs);
        } else {
            res.json(message);
        }
    });
});



// ---------- PORT LISTENER --------------------
app.listen(8000,()=> 
console.log("Now serving on localhost:8000")
);