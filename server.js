const express = require("express");
const mongoose = require("mongoose");
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

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users/:username", async (request, response) => {
  const username = req.body.username;
  const users = await User.find({});
  const user = users.find(user => user.username == username);
  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/register', async (req, res) => {
  console.log(req.body);
      user = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          pictures: req.body.pictures
      });
      await user.save();
      res.send(user);
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
