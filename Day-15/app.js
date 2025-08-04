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


app.post("/delete/:i", (req, res) => {
    let id = req.params.i;
    users.splice(id, 1);
    res.redirect("/users");
});

app.get("/edit/:i", (req, res) => {
    let id = req.params.i;
    res.render("edit", { user: users[id], index: id });
});

app.post("/edit/:i", (req, res) => {
    let id = req.params.i;
    const { name, email } = req.body;
    users[id] = { name, email };
    res.redirect("/users");
});

app.listen(port);
