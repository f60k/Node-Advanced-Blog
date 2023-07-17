const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
const session = require("express-session");

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  })
);

mongoose
  .connect(
    "mongodb+srv://sales:tTu5GcaSNBIZZRmA@cluster0.zm326pv.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Success: Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB");
  });

const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const BlogModel = mongoose.model("Blog", BlogSchema);
const UserModel = mongoose.model("User", UserSchema);

app.get("/", async (req, res) => {
  const allBlogs = await BlogModel.find();

  res.render("index", { allBlogs: allBlogs, session: req.session.userId });
});

app.get("/blog/create", (req, res) => {
  if (req.session.userId) {
    res.render("blogCreate");
  } else {
    res.redirect("/user/login");
  }
});

app.get("/blog/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);

  res.render("blogRead", {
    singleBlog: singleBlog,
    session: req.session.userId,
  });
});

app.post("/blog/create", (req, res) => {
  console.log("POST request is coming", req.body);

  BlogModel.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.render("error", { message: "/blog/create error" });
    });
});

app.get("/blog/update/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);

  res.render("blogUpdate", { singleBlog });
});

app.post("/blog/update/:id", (req, res) => {
  BlogModel.updateOne({ _id: req.params.id }, req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.render("error", { message: "/blog/update error" });
    });
});

app.get("/blog/delete/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);

  res.render("blogDelete", { singleBlog });
});

app.post("/blog/delete/:id", (req, res) => {
  BlogModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.render("error", { message: "/blog/delete error" });
    });
});

// USER -------------------

app.get("/user/create", (req, res) => {
  res.render("userCreate");
});

app.post("/user/create", (req, res) => {
  UserModel.create(req.body)
    .then(() => {
      res.redirect("/user/login");
    })
    .catch((error) => {
      res.render("error", { message: "/user/create error" });
    });
});

app.get("/user/login", (req, res) => {
  res.render("login");
});

app.post("/user/login", (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((savedUserData) => {
    if (savedUserData) {
      if (req.body.password === savedUserData.password) {
        req.session.userId = savedUserData._id;
        res.redirect("/");
      } else {
        res.render("error", { message: "/user/login error : Wrong Password" });
      }
    } else {
      res.render("error", {
        message: "/user/login error : No such user found",
      });
    }
  });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Listening on localhost port ${port}`);
});
