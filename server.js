const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const connectDb = require("./DBConnection.js");
const User = require("./models/models.js");
const app = express();
const cors = require("cors");
const Picture = require("./models/pictureSchema.js");

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());

connectDb()
  .then(() => {
    console.log("Database connection successful");

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

app.get("/login/:username", async (request, response) => {
  const username = request.params.username;
  console.log(username);

  if (!username) {
    return response.status(400).json({ error: "Invalid username." });
  }

  let session = request.session;
  session.userid = request.body.username;
  console.log(request.session);

  const user = await (
    await User.find({})
  ).filter((user) => user.username == username);

  if (user.length == 0) {
    return response.status(404).send("User not found.");
  }
});

app.get("/users/:username", async (request, response) => {
  const username = req.body.username;
  const users = await User.find({});
  const user = users.find((user) => user.username == username);
  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "Conflict. User with this username already exists." });
  }

  let mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  let strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  let emailRegex = new RegExp("[^s@]+@[^s@]+.[^s@]+");

  if (
    (mediumRegex.test(password) === false) &
    (strongRegex.test(password) === false)
  ) {
    return res.status(400).send("Weak password");
  }

  if (emailRegex.test(email) === false) {
    return res.status(400).send("Invalid email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    pictures: [],
  });

  await user.save();
  try {
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/images/:id", async (req, res) => {
  const image = await Picture.findOne({ _id: req.params.id });

  res.send(image);
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    pictures: req.body.pictures,
  });
  await user.save();
  res.send(user);
});

app.get("/user/:username/images", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });

  res.send(user.pictures);
});

app.delete("/user/:username/images/:pictureId", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  await user.updateOne({ $pull: { pictures: { _id: req.params.pictureId } } });
  await user.save();

  res.sendStatus(204);
});

app.post("/images", async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });

  if (!user) res.sendStatus(401);

  const imageData = req.body.data;

  const picture = user.pictures.find((p) => p.name === req.body.name);
  if (!picture) {
    const newPicture = new Picture({
      userId: user._id,
      data: imageData,
      name: req.body.name,
    });

    await newPicture.save();
    user.pictures.push(newPicture);

    await user.save();
  } else {
    picture.data = imageData;
    await user.save();
  }

  res.sendStatus(204);
});

app.use(express.Router);
