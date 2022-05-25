const express = require("express");
const mongoose = require("mongoose");
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
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/register", (request, response) => {
  try {
    response.sendFile('E:/WebTechnologies/CloudPaint/Web-Technologies/register.html');
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/register', async (req, res) => {
      user = new UserSchema({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          pictures: req.body.pictures
      });
      await user.save();
      res.send(user);
      res.sendFile(index_html);
});


app.use(express.Router);

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});