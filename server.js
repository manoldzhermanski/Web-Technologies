const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./DBConnection.js");
const UserSchema = require("./models/models.js");
const app = express();
const cors = require('cors')

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
  const users = await UserSchema.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users/:username", async (request, response) => {
  const username = req.body.username;
  const users = await UserSchema.find({});
  const user = users.find(user => user.username == username);
  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/register', async (req, res) => {
  console.log(req.body);
      user = new UserSchema({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          pictures: req.body.pictures
      });
      await user.save();
      res.send(user);
});

app.use(express.Router);
