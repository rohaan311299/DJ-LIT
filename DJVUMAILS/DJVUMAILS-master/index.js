const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = new express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.static("public"));
const nodeFetch = require("node-fetch");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "djvu.djlit@gmail.com",
    pass: "litsocisbest",
  },
});

const { mongourl } = require("./keys");
//this are the fields required to be sent in email

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Userlit", UserSchema);

mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected");
});
mongoose.connection.on("error", () => {
  console.log("error");
});

// app.get("/", async (req, res) => {
//   res.render("index");
// });

app.post("/subscribe", (req, res) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .exec()
    .then((response) => {
      if (response.length > 0) {
        res.render("emailExists");
      } else {
        const user = new User({
          email: req.body.email,
        });
        user.save(function (err) {
          if (!err) {
            res.render("thanks");
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/subscribe", function (req, res) {
  res.render("index");
});

app.get("/unsubscribe", (req, res) => {
  res.render("unsubscribe");
});

app.post("/unsubscribe", (req, res) => {
  console.log(req.body);
  User.findOneAndRemove(
    {
      email: req.body.email,
    },
    () => {
      console.log("user deleted");
    }
  );
  res.render("thanks");
});

app.get("/emails", async () => {
  const emails = await User.find();
  console.log(emails);
});

app.get("/send", async (req, res) => {
 res.render("sendmailform");
});
app.post("/sending", async (req, res) => {
  global.title;
  global.feature_image;
  global.url;
  global.excerpt;

  try {
    const res = await nodeFetch(
      "http://www.djvu.in/ghost/api/v3/content/posts/?key=8d1daee6a5f1ba573acf67db86",{method:'GET'}
    );
    const response = await res.json();
    console.log(response.posts[0]);
    let recentPost = response.posts[0];
    global.title = recentPost.title;
    global.feature_image = recentPost.feature_image;
    global.url = recentPost.url;
    global.excerpt = recentPost.excerpt;
  } catch (error) {
    res.render("error");
  }

  maillist = [];
  await User.find({}, (err, user) => {
    user.forEach((user) => {
      maillist.push(user.email);
    });
  });
  await console.log("emails" + maillist);

  const data = await ejs.renderFile("views/mail.ejs", {
    titles: `${global.title}`,
    feature_images: `${global.feature_image}`,
    excerpts: `${global.excerpt}`,
    urls: `${global.url}`,
  });
  var mailOptions = {
    from: "djvu.djlit@gmail.com",
    to: maillist,
    subject: "DJVU article",
    text: `New article from DJVU`,
    html: data,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.send("<h1>Emails sent successfully</h1>");
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("running on port " + port);
});
