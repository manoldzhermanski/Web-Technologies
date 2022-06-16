const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./DBConnection.js");
const UserSchema = require("./models/userSchema.js");
const PictureSchema = require("./models/pictureSchema.js");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors')

app.use(cors({
    origin: ['http://localhost:3000']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(sessions({
  maxAge: 1000*64*50,
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: 1000*64 },
  resave: false
}))

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

app.get('/login/:username', async (request, response) => {
  const username = request.params.username;
  console.log(username);

  if (!username) {
      return response.status(400).json({ error: "Invalid username." });
  }

  let session=request.session;
  session.userid=request.body.username;
  console.log(request.session)

  const user = await (await UserSchema.find({})).filter(user => user.username == username);

  if (user.length == 0) {
      return response.status(404).send("User not found.");
  }

  try {
      response.send(user);
  } catch (error) {
      response.status(500).send(error);
  }
});

app.post('/register', async (req, res) => {
  const existingUser = await UserSchema.find({}).where('username').equals(req.body.username);
    console.log(existingUser);
    if (existingUser.length != 0) {
        return res.status(409).json({ error: "Conflict. User with this username already exists." });
    }

    const user = new UserSchema({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      pictures: req.body.pictures
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    try {
      res.status(201).send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.patch('/users/:id/pictures', async (req, res) => {
  const id = req.params.id;

  if (!id) {
      return response.status(400).json({ error: "Invalid id." });
  }

  const user = await (await UserSchema.find({})).filter(user => user._id == id);

  if (user.length == 0) {
      return res.status(404).send("Entity not found.");
  }

  const picture = new PictureSchema({
    userId: id,
    name: req.body.pictures[0].name,
    url: req.body.pictures[0].url
});

const updatedPictures = user[0].pictures
  if (!picture){
    return res.status(400).send("No picture URL specified.");
  }
  updatedPictures.push(picture);

  const filter = { '_id': id };
  const update = {
      'pictures': updatedPictures
  };
  
  let updatedUser = await UserSchema.findOneAndUpdate(filter, update, {
      new: true
  });

  return res.status(200).send(updatedUser);
});

app.use(express.Router);