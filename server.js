const express = require("express");
const mongoose = require("mongoose");
<<<<<<< HEAD
const connectDb = require("./DBConnection.js");
const User = require("./models/models.js");
const app = express();
const cors = require('cors');
const Picture = require("./models/pictureSchema.js");

app.use(cors({
    origin: ['http://localhost:3000']
}));

app.use(express.json());

connectDb()
    .then(() => {
        console.log('Database connection successful');

        app.listen(3002, () => {
            console.log(`Server is listening on port 3002`);
        });
    })
    .catch((error) => console.error(`Database connection error: ${error}`));

app.get("/users", async (request, response) => {
  const users = await User.find({});

=======
const { join } = require("path");
const path = require('path');
const connectDb = require("./DBConnection.js");
const UserSchema = require("./models/models.js");
const app = express();
app.use(express.json());

const cwd = process.cwd();
const index_html = join(cwd, 'public' ,'register.html');

connectDb()
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((error) => console.error(`Database connection error: ${error}`));

app.get('/', (request, response) => {
  try {
  response.sendFile('E:/WebTechnologies/CloudPaint/Web-Technologies/index.html');
} catch (error) {
  response.status(500).send(error);
}
});
    
app.get("/users", async (request, response) => {
  const users = await UserSchema.find({});
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

<<<<<<< HEAD
app.get("/users/:username", async (request, response) => {
  const username = req.body.username;
  const users = await User.find({});
  const user = users.find(user => user.username == username);
  try {
    response.send(user);
=======
app.get("/register", (request, response) => {
  try {
    response.sendFile('E:/WebTechnologies/CloudPaint/Web-Technologies/register.html');
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/register', async (req, res) => {
<<<<<<< HEAD
  console.log(req.body);
      user = new User({
=======
      user = new UserSchema({
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          pictures: req.body.pictures
      });
      await user.save();
      res.send(user);
<<<<<<< HEAD
});

app.get('/images/:username', async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({username});
  
  res.send(user.pictures);
})

app.post('/images', async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({username});

  if(!user) res.sendStatus(401);

  const imageData = req.body.data;

  const picture = user.pictures.find(p => p.name === req.body.name)
  if(!picture) {
    const newPicture = new Picture({
      userId: user._id,
      data: imageData,
      name: req.body.name
    });
    
    await newPicture.save();
    user.pictures.push(newPicture);

    await user.save();
  }else {
    picture.data = imageData
    await user.save()
  }

  res.sendStatus(204);
})

app.use(express.Router);
=======
      res.sendFile(index_html);
});


app.use(express.Router);

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
