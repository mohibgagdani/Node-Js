const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let users = [];

app.get("/", (req, res) => {
    res.render("index");
});


app.post("/add-user", (req, res) => {
    const { name, email } = req.body;
    users.push({ name, email });
    res.redirect("/users");
});


app.get("/users", (req, res) => {
    res.render("users", { users });
});



app.listen(port);
