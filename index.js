const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
const session = require("express-session");
const routers = require("./routes");




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

app.use(routers);

app.get("*", (req, res) => {
  res.render("error", { message: "Page not Found" });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Listening on localhost port ${port}`);
});
