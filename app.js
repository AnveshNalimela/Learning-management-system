const express = require('express');
const app = express();
const path = require("path");
const { Educator, Course, Chapter, Page } = require("./models");
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



//local strategy for  authetication
passport.use(new LocalStrategy({
    usernameField: "email",// this is the name of the input field in our signup
    passwordField: "password"
},
    (username, password, done) => {
        Educator.findOne({ where: { email: username } })
            .then(async function (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid password" });
                }
            })
            .catch((error) => {
                return done(error);
            });
    }))

passport.serializeUser((user, done) => {
    console.log("serializing user in session ", user.id);
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    Educator.findByPk(id)
        .then((user) => { done(null, user) })
        .catch((error) => done(error, null))
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
                }
                response.redirect(`/educator`);

            })

        }
    } catch (error) {
        console.log("new educator cannot be added");
        console.log("error occured")
        console.log(error)
        response.status(500).json(error);
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


//route for the authetication
app.get("/login", async (request, response) => {
    response.render('login.ejs', {
        title: "LMS Application-SignIn Page",
        message: request.flash('error') // Display error messages if any
    });
});
app.post("/session", passport.authenticate("local", {
    successRedirect: "/educator",
    failureRedirect: "/login",
    failureFlash: true
}));

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
    try {
        const course = await Course.create({
            name: request.body.courseName,
            description: request.body.courseDescription,
            educatorId: educatorId

        });
        console.log("New course added!");
        // Use backticks for template literals
        console.log(course.id)
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


//route to add pages
app.post("/page/:courseId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const chapter = await Chapter.findOne({
        where: { name: request.body.chapterName },
        attributes: ['id'],
    });
    const chapterId = chapter.id
    console.log(chapterId)
    console.log(request.params.courseId)
    try {
        const page = await Page.create({
            name: request.body.pageName,
            chapterId: chapterId
        })
        console.log("new page was added")
        response.redirect(`/courseindexe/${request.params.courseId}`);
    } catch (error) {
        console.log("new page was not created")
        response.statusCode(500).json(error);
    }
});




module.exports = app;