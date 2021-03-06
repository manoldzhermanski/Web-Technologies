const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connectDb = require("./DBConnection.js");
const User = require("./models/models.js");
const app = express();
const cors = require("cors");
const Picture = require("./models/pictureSchema.js");

const privateKey = "secret-key";
const generateToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, privateKey, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());

const authMiddleware = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  const userId = await new Promise((resolve, reject) => {
    jwt.verify(accessToken, privateKey, (err, decoded) => {
      if (err) reject(err);

      resolve(decoded.id);
    });
  });

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.sendStatus(401);
  }

  res.locals.user = user;
  next();
};

connectDb()
  .then(() => {
    console.log("Database connection successful");

    app.listen(3002, () => {
      console.log(`Server is listening on port 3002`);
    });
  })
  .catch((error) => console.error(`Database connection error: ${error}`));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username) return res.status(401).json({ error: "Invalid username." });

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send({ error: "User not found." });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const token = await generateToken(user._id);
    res.send({ token });
  } else {
    res.status(401).send({ error: "Wrong password." });
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
  console.log(hashedPassword);

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

app.get("/user", authMiddleware, (req, res) => {
  const user = res.locals.user;
  res.send({ username: user.username, email: user.email });
});

app.get("/images", authMiddleware, async (req, res) => {
  res.send(res.locals.user.pictures);
});

app.delete("/images/:pictureId", authMiddleware, async (req, res) => {
  const user = res.locals.user;
  await user.updateOne({ $pull: { pictures: { _id: req.params.pictureId } } });
  await user.save();

  res.sendStatus(204);
});

app.post("/images", authMiddleware, async (req, res) => {
  const user = res.locals.user;

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
