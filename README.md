The  Express.js application appears to be an online learning management system with user authentication, role-based access control, and features for both educators and students.This application serves as a comprehensive platform for educators to create courses, chapters, and pages, while students can enroll in courses, view content, and track completion progress. 

Technologies and Languages:

1.Node.js: A JavaScript runtime for server-side development.
2.Express.js: A web application framework for Node.js, simplifying the creation of web applications and APIs.
3.Sequelize: A promise-based Node.js ORM for relational databases (used for database operations).
4.Passport.js: An authentication middleware for Node.js.
5.Bcrypt.js: A library for hashing and salting passwords for secure storage.
6.EJS (Embedded JavaScript): A templating engine for rendering dynamic content in HTML pages.
7.Body-Parser: Middleware to parse incoming request bodies in a middleware before your handlers.

Modules and Middleware:

1.express-session: Express middleware for handling sessions.
2.connect-ensure-login: Middleware for ensuring that a user is logged in.
3.express-flash: A flash message middleware for Express.
4.passport-local: Passport strategy for authenticating with a local username and password.
5.express-static: Middleware to serve static files, such as CSS, images, and JavaScript files.
6.connect-flash: Used for storing temporary messages during redirects.
7.body-parser: Middleware to parse incoming request bodies.
8.express.urlencoded: Middleware to parse URL-encoded bodies in requests.
9.express.json: Middleware to parse JSON bodies in requests.

Database Models:

1.User: Model for storing user information (name, email, password, role).
2.Course: Model for representing courses (name, description, created by).
3.Chapter: Model for chapters within courses.
4.Page: Model for pages within chapters.
5.Enrollment: Model for tracking course enrollments.
6.Completed: Model for tracking completed pages



Authentication and Sessions:

1.Passport.js: Used for local strategy authentication.
2.bcrypt.js: Utilized for password hashing and verification.
3.express-session: Manages user sessions.

Web Framework and Views:

1.Express.js: The main web application framework.
2.EJS: Templating engine for rendering views.


Database Interaction:

1.Sequelize: ORM for PostgreSQL, used for defining models and performing database operations.

Application Implementation
1.Landing Page of LMS Application
The landing page of the Learning Management System (LMS) is designed using HTML and Tailwind CSS.The landing page provides a welcoming introduction to the LMS, explaining its purpose and benefits. It encourages users to sign up if they don't have an account and provides a link for existing users to sign in. The design is clean, with a prominent system title, logo, and a user-friendly call-to-action section. The use of Tailwind CSS classes ensures a visually appealing and responsive layout.
The landing index page looks similar to below which Provide the user to sign in and sign up options for its user(ie students or educators)
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/22cb8a9f-50b5-46d6-814e-f6955e6933fd)


2.SignUp page of application
The signup page has a clean and user-friendly design, utilizing Tailwind CSS for styling. It includes input fields for name, email, password, and role, along with a signup button. The layout is responsive and visually appealing, providing a seamless signup experience for users.
The GET route renders the signup page, and the POST route handles user registration, including password hashing and user login. Upon successful signup, the user is redirected based on their role in the application.
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/90690011-6828-4601-98cd-0c0ac7128282)


3.SignIn page
--The login page provides a simple and intuitive interface for users to enter their credentials, with feedback on any login errors.
--If there are any error messages, they are displayed prominently to inform users about the issues with their login attempt.
--Provides a form for users to enter credentials.
--Passport attempts to authenticate the user.
--If successful, users are redirected to their role-specific dashboard.
--If unsuccessful, users are redirected back to the login page with an error message.
--Redirects to the dashboard on successful login.
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/6a3ad602-1be8-4c84-8a3e-40a895cb405a)




4.Educator Dashboard page
Features of the Educator Homepage in a Learning Management System. 
--It displays a welcome message with the educator's name and ID, along with an educator icon.
-- signOut button is likely used to log the user out of the Learning Management System.
--Change password button is likely used to allow the user to change their password within the Learning Management System.
--A form is provided for educators to create a new course.
--The form includes fields for the course name and description.
--Displays a list of created courses.
--Each course entry shows the course name.
--this page allows educators to manage their courses, create new courses, and access functionalities related to individual courses.
--Each created course have two buttons 
--Educators should have access to reports that display the number of students enrolled in their course(s) and indicate their relative popularity based on enrollment numbers.
--Organize your course into chapters (like chapters in a book) for clear structure.

![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/a46aa9e6-56d5-4a33-87cd-3ee567cdf211)


5.Course Index for Educator Role 
--Displays the course name and description.
--Includes a link to navigate back to the educator dashboard.
--Provides an option to add a new chapter to the course.
--Allows educators to add a new chapter to the course.
--Lists existing chapters with the option to add pages to each.
--Each chapter is displayed with its name and an option to add pages.
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/ca85d2da-6037-4414-b32e-b1f6168288a1)

6.Chapter Index view for Educator Role
--This template page provides educators with a convenient interface to manage the pages within a specific chapter of their course. 
--Allows the educator to navigate back to the course index page.
--Displays the chapter name and a list of pages within the chapter.
--Pages are listed with their names and content.
--Provides an "Edit Page" button for each page, linking to the page editing functionality.
--Allows educators to add a new page to the current chapter.
Form includes fields for page name and content.
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/a8765368-8fa4-4712-8f00-8ee969e3f951)

7.Edit page view for Educator Role users
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/bacf3ade-81c0-4cd9-9afa-381824ef0611)

--This template provides an interface for educators to conveniently edit the content of a specific page within a chapter, and the changes are dynamically updated on the server. 
--Displays the name of the page as the title.
--Provides a content editor with the current content of the page loaded.
--A button with the label "Save Changes" allows educators to save any modifications made to the page content.
--Allows users to navigate back to the chapter page containing the list of pages.


8.View Enrollment reports for Educatoos specific course

--Educators should have access to reports that display the number of students enrolled in their course(s) and indicate their relative popularity based on enrollment numbers.
--A link that allows educators to navigate back to the dashboard.
--Displays the course name, description, creator, and the number of enrollments.
--Includes a graphical representation of the enrollment percentage using a circular progress indicator.
--Presents a table showing details of enrolled students
![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/c7924170-b9d5-4d34-817c-240299f18249)


9.Student Dashboard

![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/2e6024df-3fd8-484a-9f20-a0abce2bf53c)

--Displays a welcome message with the student's name and ID.
--Shows a student icon next to the personal information.
--Lists the courses in which the student is currently enrolled.
--For each enrolled course:
--Displays the course name.
--Provides an option to start the course with a "Start Course" button.
--For each available course:
--Displays the course name and description.
--Provides options to enroll in the course or view the course details with corresponding buttons.
--Enroll Course": Allows the student to enroll in the course.
--"View Course": Redirects the student to view details about the course.

10.View Course for Student Role users

![image](https://github.com/AnveshNalimela/wd201-LMS/assets/151531961/f99512f9-7619-4d7e-8ddd-a62c3e9a799e)

--This HTML template seems to be designed for the "View Course" page, providing information about a specific course.
--Displays the course name and  course description
--Shows a section listing the chapters of the course.
--Provides a button to enroll in the course.


11.Enrollment page of corresponding Course for Student Role Users

Live link of LMS application..
https://wd-lms-app.onrender.com
















