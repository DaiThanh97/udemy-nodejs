const request = require('supertest');
const app = require('./../../index');

// it('return a 201 on successful signup', async () => {
//     return request(app)
//         .post('/api/users/signUp')
//         .send({
//             email: 'test@test.com',
//             password: '123123'
//         })
//         .expect(201);
// });

// it('return a 200 on Auth Service', async () => {
//     const res = await request(app)
//         .post('/api/users/signUp')
//         .send({
//             email: 'test@test.com',
//             password: '123123'
//         })
//         .expect(201);

//     await request(app)
//         .post('/api/users/logIn')
//         .send({
//             email: 'test@test.com',
//             password: '123123'
//         })
//         .expect(200);
// });

it('return a 200 on get current user', async () => {
    const cookie = await global.logIn();

    const response = await request(app)
        .get('/api/users/currentUser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    console.log('User: ', response.body);
});