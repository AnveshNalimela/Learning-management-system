const express = require('express');
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", async (request, response) => {
    response.render('index.ejs', {
        title: "LMS Application",

    })
})

app.get("/signup", async (request, response) => {
    response.render('signup.ejs', {
        title: "LMS Application",

    })
})
app.get("/signin", async (request, response) => {
    response.render('signin.ejs', {
        title: "LMS Application",

    })
})

app.get("/student", async (request, response) => {
    response.render('student.ejs', {
        title: "LMS Application",

    })
})

app.get("/educator", async (request, response) => {
    response.render('educator.ejs', {
        title: "LMS Application",

    })
})






module.exports = app;