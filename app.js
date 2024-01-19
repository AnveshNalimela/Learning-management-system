const express = require('express');
const app = express();
const path = require("path");
const { Educator, Course, Chapter, Page } = require("./models");
const bodyParser = require("body-parser");




app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
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


app.get("/courseindexe/:courseName", async (request, response) => {
    const courseName = request.params.courseName;
    response.render('courseindexe.ejs', {
        courseName: courseName,
    });
});

app.post("/course", async (request, response) => {
    const courseName = request.body.courseName;
    try {
        const course = await Course.addCourse({
            name: request.body.courseName,
            description: request.body.courseDescription,
        });

        console.log(course.name);
        console.log("New course added!");

        // Use backticks for template literals
        response.redirect(`/courseindexe/${course.name}`);
    } catch (error) {
        console.log("New course not added!");
        console.log(error);
        return response.status(422).json(error);
    }
});

app.post("/chapter/:courseName", async (request, response) => {
    const chapterName = request.body.chapterName;
    const courseName = request.params.courseName;
    try {
        const chapter = await Chapter.addChapter({
            name: request.body.chapterName
        })
        console.log("new chapter was created")
        console.log(chapterName)
        console.log(chapter)
        response.redirect(`/courseindexe/${courseName}`);
    } catch (error) {
        console.log("new chapter was not created")
        response.statusCode(500).json(error);
    }
});









app.post("/page/:courseName", async (request, response) => {
    const pageName = request.body.pageName;
    const courseName = request.params.courseName;
    try {
        const page = await Page.addPage({
            name: request.body.pageName,
            content: request.body.pageContent,
        })
        console.log("new page was added")
        console.log(pageName)
        response.redirect(`/courseindexe/${courseName}`);
    } catch (error) {
        console.log("new page was not created")
        response.statusCode(500).json(error);
    }
});











module.exports = app;