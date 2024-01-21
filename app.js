const express = require('express');
const app = express();
const path = require("path");
const { Educator, Course, Chapter, Page, Student, Enrollments, User } = require("./models");
const bodyParser = require("body-parser");
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const educator = require('./models/educator');
const saltRounds = 10;




app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "my-super-key 1234567890", cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
app.use(passport.initialize());
app.use(passport.session())
app.use(require('connect-flash')());
app.use(passport.initialize());
app.use(passport.session())




passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (username, password, done) => {
    try {
        // Search in both Educator and Student models
        const educator = await Educator.findOne({ where: { email: username } });
        const student = await Student.findOne({ where: { email: username } });

        // Check if the user is found in either Educator or Student model
        const user = educator || student;

        if (!user) {
            return done(null, false, { message: "User not found" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Invalid password" });
        }
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    console.log("serializing user in session ", user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Promise.all([
        Student.findByPk(id),
        Educator.findByPk(id),
    ])
        .then(([student, educator]) => {
            // Check which model returned a result
            const user = student || educator;

            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'), null);
            }
        })
        .catch((error) => {
            done(error, null);
        });
});



app.get("/", async (request, response) => {
    response.render('index.ejs', {
        title: "LMS Application",

    })
})



//route for the signup page
app.get("/signup", async (request, response) => {
    response.render('signup.ejs', {
        title: "LMS Application-SignUp ",

    })
})



//route for new user signup "user"
app.post("/user", async (request, response) => {
    const role = request.body.role
    const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
    console.log(hashedPwd);
    try {
        if (role === "educator") {
            const educator = await Educator.create({
                name: request.body.name,
                email: request.body.email,
                password: hashedPwd,
                role: request.body.role,

            })

            console.log("new user educator added ")
            console.log(educator)
            request.login(educator, (err) => {
                if (err) {
                    console.log(err)
                    console.log("error occured")
                }
                response.redirect(`/educator`);

            })

        } else {
            const student = await Student.create({
                name: request.body.name,
                email: request.body.email,
                password: hashedPwd,
                role: request.body.role,

            })
            console.log("new user student added ")
            console.log(student)
            request.login(student, (err) => {
                if (err) {
                    console.log(err)
                }
                response.redirect(`/student`);

            })
        }
    } catch (error) {
        console.log("new user cannot be added");
        console.log("error occured")
        console.log(error)
        response.status(500).json(error);
    }
})

app.get('/password-change', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        response.render("password-change.ejs")
    } catch (error) {
        console.log('Error in rendering password-change page')
    }
})

app.post("/password-change", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    if (request.body.newPassword === request.body.confirmPassword) {
        const hashedPwd = await bcrypt.hash(request.body.newPassword, saltRounds)
        if (request.user.role === "student") {
            const newUser = await Student.changePassword(request.user.id, hashedPwd)
        } else {
            const newUser = await Educator.changePassword(request.user.id, hashedPwd)
        }
        console.log("password updated sucessfully")
        response.redirect("/")

    }
})


//route for the educator home page
app.get("/educator", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    console.log("Educator logged in successfully");
    console.log(request.user.name);
    try {
        const courses = await Course.findAll({
            where: { educatorId: request.user.id },
        });
        const name = request.user.name;
        response.render('educator.ejs', {
            name: name,
            courses: courses
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/student", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    console.log("student logged in successfully");
    console.log(request.user.name);
    const courses = await Course.findAll();
    const enrollments = await Enrollments.findAll({
        where: {
            studentId: request.user.id,
        }
    })
    const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId)
    console.log(enrolledCourseIds)
    const enrolledCourses = await Course.findAll({ where: { id: enrolledCourseIds } })

    try {
        await response.render('student.ejs', {
            name: request.user.name,
            courses: courses,
            enrolledCourses: enrolledCourses,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/enroll/:courseId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    console.log(request.user.id)
    const enroll = await Enrollments.create({
        studentId: request.user.id,
        courseId: request.params.courseId
    })
    console.log("new enrollemnt is added")
    response.redirect(`/courseindexs/${request.params.courseId}`);

})

app.get('/courseindexs/:courseId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const course = await Course.findByPk(request.params.courseId)
    const chapters = await Chapter.getChapter(request.params.courseId)
    const enrollment = await Enrollments.findAll({ where: { courseId: request.params.courseId, studentId: request.user.id } })
    console.log(enrollment.id)
    response.render('courseindexs.ejs', {
        course: course,
        chapters: chapters
    })
})


app.get("/chapterindex/:chapterId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const chapter = await Chapter.findByPk(request.params.chapterId)
    const pages = await Page.findAll({ where: { chapterId: request.params.chapterId } })
    response.render('chapterindex.ejs', {
        chapter: chapter,
        pages: pages,
    })
    console.log(pages)
})











//route for the authetication
app.get("/login", async (request, response) => {
    console.log("login failed")
    response.render('login.ejs', {
        title: "LMS Application-SignIn Page",
        message: request.flash('error') // Display error messages if any
    });
});



app.post("/session", passport.authenticate("local", {
    successRedirect: "/page",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/page", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    if (request.user.role === "educator") {
        response.redirect('/educator')
    } else {
        response.redirect('/student')
    }
})



//route for the signout
app.get("/signout", (request, response, next) => {
    request.logout((err) => {
        if (err) { return next(err); }
        response.redirect("/");
    });
});



//route to add new course
app.post("/course", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const courseName = request.body.courseName;
    console.log(courseName)
    const educatorId = request.user.id
    console.log(educatorId)
    try {
        console.log('added started')
        const course = await Course.addCourse({
            name: request.body.courseName,
            description: request.body.courseDescription,
            educatorId: educatorId

        });
        console.log("New course added!");
        response.redirect(`/courseindexe/${course.id}`);
    } catch (error) {
        console.log("New course not added!");
        console.log(error);
        return response.status(422).json(error);
    }
});

//route to view the courseindexe page
app.get("/courseindexe/:courseId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const course = await Course.getCourse(request.params.courseId)
    const chapters = await Chapter.getChapter(course.id);

    response.render('courseindexe.ejs', {
        courseName: course.name,
        courseId: course.id,
        chapters: chapters,

    });
});


//route to add chapter to course
app.post("/chapter/:courseId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {

    const course = Course.getCourse(request.params.courseId);
    const courseId = request.params.courseId
    try {
        const chapter = await Chapter.create({
            name: request.body.chapterName,
            courseId: courseId,

        })
        console.log("new chapter was created")
        response.redirect(`/courseindexe/${courseId}`);
    } catch (error) {
        console.log("new chapter was not created")
        response.statusCode(500).json(error);
    }
});


app.post("/page/:courseId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const chapter = await Chapter.findOne({
        where: { name: request.body.chapterName },
        attributes: ['id'],
    });

    if (!chapter) {
        // Handle the case where the chapter is not found
        console.log("Chapter not found");
        return response.status(404).send("Chapter not found");
    }

    const chapterId = chapter.id;

    console.log("Chapter ID:", chapterId);

    try {
        const page = await Page.addPage({
            name: request.body.pageName,
            chapterId: chapter.id,
        });

        console.log("New page added:", page.name);
        response.redirect(`/courseindexe/${request.params.courseId}`);
    } catch (error) {
        console.error("Error creating page:", error);
        response.status(500).send("Error creating page");
    }
});


app.put('/SetCompletion/:pageId', async (request, response) => {
    try {
        const page = await Page.setCompleted(request.params.pageId)
        console.log(page.name)
        console.log("page status updated")
    } catch (error) {
        console.log(error);
        console.log("page status update failed")
    }
});




module.exports = app;