// __tests__/app.test.js
const { sequelize } = require('../models'); 
const request = require('supertest');
const app = require('../app'); // Adjust the path based on your project structure
const { User, Educator, Student, Enrollments, Course, Chapter, Page } = require('../models');
const bcrypt = require('bcryptjs');

describe('Test LMS Application', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        // Setup: Create a test user, educator, and course for testing
        const hashedPwd = await bcrypt.hash('password123', 10);

        await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: hashedPwd,
            role: 'student',
        });

        await Course.create({
            name: 'Test Course',
            description: 'Test Course Description',
            educatorId: 1, // Assuming the test educator has id 1
        });
    });

    afterAll(async () => {
        // Teardown: Cleanup the database after testing
        await User.destroy({ where: {} });
        await Course.destroy({ where: {} });
    });

    describe('Signup and Login', () => {
        test('should allow a user to sign up ', async () => {
            const response = await request(app)
                .post('/user')
                .send({
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    role: 'student',
                });

            expect(response.statusCode).toBe(302); // Redirect after successful signup
        });
    });
    describe('Signup and Login', () => {
        test('should allow a user to  log in', async () => {
            const loginResponse = await request(app)
                .post('/session')
                .send({
                    email: 'john.doe@example.com',
                    password: 'password123',
                });

            expect(loginResponse.statusCode).toBe(302); // Redirect after successful login
        });
    });

    describe('Password Change', () => {
        test('should allow a user to change password', async () => {
            const agent = request.agent(app);

            // Log in as an existing user
            await agent.post('/session').send({
                email: 'testuser@example.com',
                password: 'password123',
            });

            const response = await agent
                .post('/password ')
                .send({
                    newPassword: 'newpassword123',
                    confirmPassword: 'newpassword123',
                });

            expect(response.statusCode).toBe(302); // Redirect after successful password change

            // Log in with the new password
            const loginResponse = await agent.post('/session').send({
                email: 'testuser@example.com',
                password: 'newpassword123',
            });

            expect(loginResponse.statusCode).toBe(302); // Redirect after successful login with the new password
        });
    });

    // Add similar tests for other functionalities (setCompleted, enroll, etc.)
});
