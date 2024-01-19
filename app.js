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

app.get("/educator/:name", async (request, response) => {
    try {
        const courses = await Course.getCourses();
        const name = request.params.name
        response.render('educator.ejs', {
            name: name,
            courses: courses,

        })
    } catch (error) {
        console.log(error);
    }
})


//route for new user signup
app.post("/signup", async (request, response) => {
    const role = request.body.role
    console.log(role)
    try {
        if (role === "educator") {
            const newuser = await Educator.addEducator({
                name: request.body.name,
                email: request.body.email,
                password: request.body.password,
                role: request.body.role,

            })
            console.log("new user eduactor added ")
            console.log(newuser)
            response.redirect(`/educator/${request.body.name}`);

        }
    } catch (error) {
        console.log("new educator cannot be added");
        console.log("error occured")
        console.log(error)
        response.status(500).json(error);
    }


})

//route to view the courseindexe page
app.get("/courseindexe/:courseName", async (request, response) => {
    const courseName = request.params.courseName;
    const chapters = await Chapter.getChapters();
    response.render('courseindexe.ejs', {
        courseName: courseName,
        chapters: chapters
    });
});


//route to add new course
app.post("/course", async (request, response) => {
    const courseName = request.body.courseName;
    try {
        const course = await Course.addCourse({
            name: request.body.courseName,
            description: request.body.courseDescription,
        });

        console.log(courseName);
        console.log("New course added!");

        // Use backticks for template literals
        response.redirect(`/courseindexe/${course.name}`);
    } catch (error) {
        console.log("New course not added!");
        console.log(error);
        return response.status(422).json(error);
    }
});



//route to add chapter to course
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








//route  to add page 
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