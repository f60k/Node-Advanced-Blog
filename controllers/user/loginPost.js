const jwt = require("jsonwebtoken");

const secret_key = "mern-market";

const UserModel = require("../../models/user");

module.exports = (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((savedUserData) => {
    if (savedUserData) {
      if (req.body.password === savedUserData.password) {
        const payload = { email: req.body.email };
        const token = jwt.sign(payload, secret_key, { expiresIn: "23h" });
        console.log(token);
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
};
