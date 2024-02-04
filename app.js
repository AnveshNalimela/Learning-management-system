const express = require('express');
const app = express();
const path = require("path");
const { User, Course, Chapter, Page, Enrollment, Completed } = require("./models");
const bodyParser = require("body-parser");

const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { constants } = require('fs/promises');
const saltRounds = 10;
const flash = require('connect-flash');



app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "my-super-key 1234567890", cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
app.use(passport.initialize());
app.use(passport.session())

app.use(passport.initialize());
app.use(passport.session())
app.use(require('express-session')({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        console.log("User found in Database")
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



passport.serializeUser(function (user, done) {
    console.log("serializing user in session ", user.id);
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.use(function (request, response, next) {
    response.locals.messages = request.flash();
    next();
});
app.get("/", (request, response) => {
    if (request.isAuthenticated()) {
        return response.redirect("/page");
    }
    else {
        return response.render("index.ejs", {
        })

    }
});



//route to signup page
app.get("/signup", async (request, response) => {
    response.render('signup.ejs', {

    })
})


//route for new user signup "user"
app.post("/user", async (request, response) => {
    const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
    console.log(hashedPwd);
    try {
        const user = await User.create({
            name: request.body.name,
            email: request.body.email,
            password: hashedPwd,
            role: request.body.role,

        })
        console.log("new user added succesfully ")
        request.login(user, (error) => {
            if (error) {
                console.log(error);
                console.log("An error occurred during login through user");
            }
            response.redirect(`/${user.role}`)
        }
        );

    } catch (error) {
        console.log("Error while crerating a new User");
        console.log(error)
        response.status(500).json(error);
    }
})


app.get("/login", async (request, response) => {
    console.log("login failed")
    response.render('login.ejs', {

        message: request.flash('error')
    });
});


app.post("/session", passport.authenticate("local", {
    successRedirect: "/page",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/page", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    response.redirect(`/${request.user.role}`);
})

app.get("/Educator", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    console.log(`Educator logged in successfully `)
    console.log(request.user.name)
    const createdCourses = await Course.findAll({ where: { created: request.user.id } })
    try {
        await response.render('educator.ejs', {
            name: request.user.name,
            id: request.user.id,
            createdCourses: createdCourses,

        });
    } catch (error) {
        console.log("Error while rendering the Educator Homepage")
        console.log(error);
    }
});



// Routing--realted--password-change
app.get('/password', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        response.render("password.ejs")
    } catch (error) {
        console.log('Error in rendering password-change page')
    }
})

app.post("/password", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        if (request.body.newPassword === request.body.confirmPassword) {
            const hashedPwd = await bcrypt.hash(request.body.newPassword, saltRounds);
            const updatedUser = await User.update({ password: hashedPwd }, { where: { id: request.user.id } });

            if (updatedUser) {
                console.log("Password updated successfully");
                response.redirect("/pwdSucces");
            } else {
                console.log("Failed to update password");
                response.redirect("/password-change");
            }
        } else {
            console.log("New password and confirm password do not match");
            response.redirect("/password");
        }
    } catch (error) {
        console.error("Error updating password:", error);
        response.redirect("/password");
    }
});
// Success pages
app.get("/pwdSucces", async (request, response) => {
    await response.render('pwdSucces.ejs')
})


//Route-for-creating-course
app.post("/course", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        const course = await Course.create({
            name: request.body.courseName,
            description: request.body.courseDescription,
            created: request.user.id

        });
        console.log("New course added!");
        response.redirect(`/course/${course.id}`);
    } catch (error) {
        console.log("New course not added!");
        console.log(error);
        return response.status(422).json(error);
    }
});

app.get("/course/:courseId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        const course = await Course.findByPk(request.params.courseId)
        const chapters = await Chapter.findAll({ where: { courseId: request.params.courseId } })
        response.render('course.ejs', {
            courseName: course.name,
            courseId: course.id,
            courseDescription: course.description,
            chapters: chapters,
        })
    } catch (error) {
        console.log("Error while rendering Course Index page")
    }
})

// routing-related-to-creation-of-chapters
app.post('/chapter/', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        const chapter = await Chapter.create({
            name: request.body.chapterName,
            courseId: request.body.courseId,
        });
        console.log("New chapter added!");
        response.redirect(`/chapter/${chapter.id}`);
    } catch (error) {
        console.log("New chapter not added!");
        console.log(error);
        return response.status(422).json(error);
    }
});
app.get('/chapter/:chapterId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const pages = await Page.findAll({ where: { chapterId: request.params.chapterId } })
    try {
        const chapter = await Chapter.findByPk(request.params.chapterId)
        response.render('chapter.ejs', {
            chapterName: chapter.name,
            chapterId: chapter.id,
            pages: pages,
            courseId: chapter.courseId,

        })
    } catch (error) {
        console.log("Error while rendering Chapter Index page")
    }
})

// routing--related-to-creation-of-page
app.post("/page", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {

    try {
        const page = await Page.create({
            name: request.body.pageName,
            chapterId: request.body.chapterId,
            content: request.body.pageContent,
        });

        console.log("New page added!");
        response.redirect(`/chapter/${request.body.chapterId}`);
    } catch (error) {
        console.log("New page not added!");
        console.log(error);
        return response.status(422).json(error);
    }
});
app.get("/editPage/:pageId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        const page = await Page.findOne({ where: { id: request.params.pageId } });
        await response.render("editPage.ejs", {
            page: page
        })
    } catch (error) {
        console.log("Error in getting the details of a particular page");
    }
})
app.post("/savePageChanges", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const { pageId, editedContent } = request.body;
    try {
        console.log('Received Page ID:', pageId);
        await Page.update(
            { content: editedContent },
            { where: { id: pageId } })

    } catch (error) {
        console.log("Error in editing the page")
    }
})

//==============================Student routes ==================================
app.get("/Student", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    console.log("student logged in successfully");
    const availcourses = await Course.findAll();
    const enrollments = await Enrollment.findAll({ where: { userId: request.user.id } })
    const enrolledCoursesIds = enrollments.map((enrollment) => enrollment.courseId)
    const enrolledCourses = await Course.findAll({ where: { id: enrolledCoursesIds } })
    try {
        await response.render('student.ejs', {
            studentName: request.user.name,
            studentId: request.user.id,
            availcourses: availcourses,
            enrolledCourses: enrolledCourses,

        });
    } catch (error) {
        console.log("Error while rendering the Student Homepage")
        console.log(error);
    }
});

app.get('/viewCourse/:courseId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        const chapters = await Chapter.findAll({ where: { courseId: request.params.courseId } })
        const course = await Course.findByPk(request.params.courseId)
        response.render('viewCourse.ejs', {
            course: course,
            chapters: chapters,
        });
    } catch (error) {
        console.log(error)
    }
})

app.get('/enrollCourse/:courseId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const course = await Course.findByPk(request.params.courseId);
    const enrollmentStatus = await Enrollment.findOne({ where: { userId: request.user.id, courseId: course.id } })
    if (enrollmentStatus) {
        response.render('alreadyEnrolled.ejs', {
            course: course
        })

    } else {
        response.render('enrollCourse.ejs', {
            course: course
        })
    }
})

app.post('/enrollCourse/:courseId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const enrollment = await Enrollment.create({
        userId: request.user.id,
        courseId: request.params.courseId,
    })
    console.log("New Enrollment created succesfully")
    response.redirect(`/scourse/${request.params.courseId}`)
})

app.get('/scourse/:courseId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const chapters = await Chapter.findAll({ where: { courseId: request.params.courseId } })
    const course = await Course.findByPk(request.params.courseId);
    const completedPages = await Completed.findAll({ where: { userId: request.user.id, courseId: request.params.courseId } })
    const CompletedpagesCnt = completedPages.length;
    const findNumberOfPages = async (chapter) => {
        const pages = await Page.findAll({ where: { chapterId: chapter.id } });
        return pages.length;
    };
    // Use Promise.all to asynchronously get the number of pages for each chapter
    const chaptersWithPageCountPromises = chapters.map(async (chapter) => {
        const pageCount = await findNumberOfPages(chapter);
        return { pageCount };
    });
    // Wait for all promises to resolve
    const chaptersWithPageCount = await Promise.all(chaptersWithPageCountPromises);
    const totalPageCount = chaptersWithPageCount.reduce((sum, chapter) => sum + chapter.pageCount, 0);
    console.log(totalPageCount)
    const percentage = (CompletedpagesCnt / totalPageCount) * 100 || 0.0

    response.render('scourse.ejs', {
        course: course,
        chapters: chapters,
        percentage: percentage.toFixed(1),
    })
})

app.get('/schapter/:chapterId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    const pages = await Page.findAll({ where: { chapterId: request.params.chapterId } })
    const chapter = await Chapter.findByPk(request.params.chapterId);
    const course = await Course.findByPk(chapter.courseId)
    const completedPages = await Completed.findAll({ where: { userId: request.user.id, courseId: course.id, chapterId: chapter.id } })
    response.render('schapter.ejs', {
        course: course,
        chapter: chapter,
        pages: pages,
        completedPages: completedPages,

    })

})
app.get("/spage/:pageId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {

    const page = await Page.findByPk(request.params.pageId)
    const chapter = await Chapter.findByPk(page.chapterId)
    const course = await Course.findByPk(chapter.courseId)
    const enrollment = await Enrollment.findOne({ where: { userId: request.user.id, courseId: course.id } })
    const CompletedStatus = await Completed.findOne({ where: { userId: request.user.id, courseId: course.id, chapterId: chapter.id, pageId: page.id } })
    await response.render("spage.ejs", {
        page: page,
        chapter: chapter,
        course: course,
        CompletedStatus: CompletedStatus,
    })


})
//================Routes-related-to-completion-of-page================
app.post("/completePage/:pageId", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {

    const page = await Page.findByPk(request.params.pageId)
    const chapter = await Chapter.findByPk(page.chapterId)
    const course = await Course.findByPk(chapter.courseId)
    const enrollment = await Enrollment.findOne({ where: { userId: request.user.id, courseId: course.id } })
    const CompletedStatus = await Completed.findOne({ where: { userId: request.user.id, courseId: course.id, chapterId: chapter.id, pageId: page.id } })
    if (CompletedStatus) {
        request.flash('info', 'Page already marked as Compeleted.');
        console.log("Page already marked as Compeleted")




    } else {
        const completePage = await Completed.create({
            userId: request.user.id,
            courseId: course.id,
            chapterId: chapter.id,
            pageId: page.id,
            enrollmentId: enrollment.id,
            pageName: page.name,
            chapterName: chapter.name,
            courseName: course.name,
        })
        console.log("Page marked as Compelted")
        request.flash('info', 'Page  marked as Compeleted.');

    }
    response.redirect(`/spage/${page.id}`)
})



//========================View Report===============================
//Routing--related-to-view-report-to-educator
app.get('/courseEnrollments/:courseId', connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
        const totalEnrollments = await Enrollment.findAll();
        const totalEnrollmentsCnt = totalEnrollments.length;
        const enrollments = await Enrollment.findAll({ where: { courseId: request.params.courseId } })
        const enrollmentUserIds = enrollments.map((enrollment) => enrollment.userId)
        const enrollmentCnt = enrollments.length;
        const createdBy = request.user.name;
        const course = await Course.findByPk(request.params.courseId)
        const enrolledstudents = await User.findAll({ where: { id: enrollmentUserIds } })
        const percentage = (enrollmentCnt / totalEnrollmentsCnt) * 100 || 0
        await response.render('courseEnrollments.ejs', {
            course: course,
            enrolledstudents: enrolledstudents,
            createdBy: createdBy,
            enrollmentCnt: enrollmentCnt,
            enrollments: enrollments,
            percentage: percentage.toFixed(1),
        })
    } catch (error) {
        console.log(error)
    }

});


//======================Sign Out===================
app.get("/signout", (request, response, next) => {
    request.logout((err) => {
        if (err) { return next(err); }
        console.log("Sign out Successfully")
        response.redirect('/signOut-success');
    });
});
app.get("/signOut-success", async (request, response) => {
    await response.render("signOut.ejs")
})
module.exports = app;