const request = require('supertest');
const app = require('./../app');

describe('Users', () => {
    it('should create a new user', async () => {
        const newUser = { name: 'John Doe', email: 'john.doe@example.com', password:'123', confirmPassword: '123' };
        
        const response = await request(app)
            .post('api/v1/auth/sign-up')
            .send(newUser)
            .expect(201);

        expect(response.body).toEqual({
            status: 'success',
            data: {
                user: {
                    username: 'JohnDoe',
                    email: 'john.doe@example.com',
                    
                },
                token: expect.any(String)
            }
        });
    });

    it('should return 400 if name or email is missing', async () => {
        const response = await request(app)
            .post('api/v1/auth/sign-up')
            .send({ name: 'John Doe' })
            .expect(400);

        expect(response.body).toEqual({ message: 'Name and email are required' });
    });

    it('should sign-in', async () => {
        const newUser = { email: 'john.doe@example.com', password:'123' };
        
        const response = await request(app)
            .post('api/v1/auth/sign-in')
            .send(newUser)
            .expect(200);

        expect(response.body).toEqual({
            status: 'success',
            data: {
                user: { email: 'john.doe@example.com' },    
                token: expect.any(String)
            }
        });
    });
});
