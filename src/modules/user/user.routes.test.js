require('dotenv').config();
import request from 'supertest';
import bcrypt from 'bcrypt';
import { User } from './user.model';
import {app,server} from '../../server';


let dummyUsers = [
  {
    name: 'John Doe',
    username: 'john',
    email: 'johndoe@gmail.com',
    password: 'johndoeking'
  },
  {
    name: 'Mari Perry',
    username: 'mari27',
    email: 'mari@gmail.com',
    password: 'mariperry27'
  }
];

/**
 * @desc   Check if user created exists
 * @param {Object} userData
 * @param {Function} done
 * @return {Function}
 */
const checkIfUserExist = async (userData, done) =>{
  try {
    let user = await User.find({ username: userData.username });
    expect(user).toBeInstanceOf(Array);
    expect(user).toHaveLength(1);
    expect(user[0].username).toEqual(userData.username);
    expect(user[0].email).toEqual(userData.email);

    let isMatch = bcrypt.compareSync(userData.password, user[0].password);
    expect(isMatch).toBeTruthy();
    done();
  } catch (err) {
    done(err)
  }
}

describe('Users',() => {

  beforeEach(async done => {
    await User.remove({});
    done();
  });

  afterAll(() => {
    server.close();
  })

  describe('POST /register', () => {

    test('If name is not provided should be failed', (done) => {
      let user = { ...dummyUsers[0] };
      delete user.name;

      request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('name');
          expect(typeof res.body).toBe('object');
          done();
        })
    });

    test('If username is not provided should be failed', (done) => {
      let user = { ...dummyUsers[0] };
      delete user.username;

      request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('username');
          expect(typeof res.body).toBe('object');
          done();
        })
    });

    test('If password is not provided should be failed', (done) => {
      let user = { ...dummyUsers[0] };
      delete user.password;

      request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('password');
          expect(typeof res.body).toBe('object');
          done();
        })
    });

    test('If email is not provided should be failed', (done) => {
      let user = { ...dummyUsers[0] };
      delete user.email;

      request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('email');
          expect(typeof res.body).toBe('object');
          done();
        })
    });
    
    test('If is not a valid email should be failed', (done) => {
      let user = { ...dummyUsers[0] };
      user.email = '@gmail.com';

      request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('email');
          expect(typeof res.body).toBe('object');
          done();
        })
    });

    test('Create account if all data are valid', (done) => {
      request(app)
      .post('/api/v1/users/register')
      .send(dummyUsers[0])
      .end((err,res) => {
        expect(res.status).toBe(201);
        expect(typeof res.text).toBe('string');
        expect(res.text).toEqual('User created');
        checkIfUserExist(dummyUsers[0],done);
      })
    });

    test('If username or email already exist should be failed', async (done)=>{
      await Promise.all(dummyUsers.map(singleUser => (new User(singleUser).save())));
      request(app)
        .post('/api/v1/users/register')
        .send(dummyUsers[0])
        .end((err, res) => {
          expect(res.status).toBe(409);
          expect(typeof res.body).toBe('object');
          done();
        })
    });
  
  });



  describe('POST /login',() => {

    test('If username is not provided should be failed',(done) => {
      let user = { password: 'pingpong' };

      request(app)
        .post('/api/v1/users/login')
        .send(user)
        .end((err,res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('username');
          expect(typeof res.body).toBe('object');
          done();
        })
    });
    
    test('If password is not provided should be failed',(done) => {
      let user = { username: 'mari27' };

      request(app)
        .post('/api/v1/users/login')
        .send(user)
        .end((err,res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('password');
          expect(typeof res.body).toBe('object');
          done();
        })
    });
    
    test('If user do not exist should be failed',(done) => {
      let fakeUser = { 
        username: 'carl56',
        password: '123456'
      };

      request(app)
        .post('/api/v1/users/login')
        .send(fakeUser)
        .end((err,res) => {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty('message');
          expect(typeof res.body).toBe('object');
          done();
        })
    });
    
    test('If password is wrong should be failed', async (done) => {
      await new User(dummyUsers[0]).save();
      request(app)
        .post('/api/v1/users/login')
        .send({
          username: dummyUsers[0].username,
          password: '123456'
        })
        .end((err,res) => {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty('message');
          expect(typeof res.body).toBe('object');
          done();
        })
    });
    
    test('Login user if exists and all data are valid', async (done) => {
      await new User(dummyUsers[0]).save();
      request(app)
        .post('/api/v1/users/login')
        .send({
          username: dummyUsers[0].username,
          password: dummyUsers[0].password
        })
        .end((err,res) => {
          expect(res.status).toBe(200);
          expect(res.body.logingSuccess).toBeTruthy();
          expect(res.body).toHaveProperty('logingSuccess');
          expect(typeof res.body).toBe('object');
          done();
        })
    });

  })

})