

let express = require('express');
const { MongoClient }= require('mongodb');
const ObjectId = require('mongodb').ObjectId;
let app = express();
let db
app.use(express.static('public'))
  //db = client.db()
  //app.listen(3000)
  //here we are updating our global database variable(db) to point towards our database

  const uri = "mongodb+srv://jkdyd:jkdyd@cluster0.ftjbo.mongodb.net/todo?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, 
    useUnifiedTopology: true ,
  
  });
  client.connect(err => {
     db = client.db();
    app.listen(3000)
  });


app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.get('/', function(req, res){
db.collection('items').find().toArray(function(err, items ){
  //console.log(items);
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input  name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul class="list-group pb-5">
    ${items.map(function(item){
      return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${item.text}</span>
      <div>
        <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
        <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
    </li>`
    }).join(' ')}
    </ul>
    
  </div>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
</body>
</html>`);
})

})

app.post('/create-item',function(req, res){
  //look inside the request object and then loook inside
  //the body object and then look for the item property
    //console.log(req.body.item);

    db.collection('items').insertOne({text: req.body.item}, function(){
      res.redirect('/')
    })
   
})

app.post('/update-item', function(req, res){
db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function(){
  res.send("success");
})
})

app.post('/delete-item', function(req, res){
db.collection('items').deleteOne({_id: new ObjectId(req.body.id)}, function(){
  res.send("success")
})
})

/*If we make a change in our app  and refresh the page 
we do not see that change. This is because, node is going to keep our app
running in memory not reloding or looking at our code file once a new request comes in.
This is why we need to keep launching the server every time.
Thus to automate that process, we use nodemon.
When we write nodemon server in our cmd, it watches
our file for us and any time it detects a change, 
it relaunches our app for us. 
To run nodemon locally we need to make a few changes in our
packages.json file while to run it globally, 
we use npm install nodemon. 

we can create our custom commands under the "scripts section"
in the server.js file

In order to let node work with mongodb database we need to install a package using npm install mongodb

*/