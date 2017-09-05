const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const uuid = require('node-uuid');

const {utils, User} = require('../../app/users');
const app = require('../../');
const expect = chai.expect;


chai.use(chaiHttp);

describe('User Resource Model', () => {
  const password = 'testing';
  const email = 'testing@example.com';
  let pwdHash;

  beforeEach(done => {
    User.sync({force: true, logging: false})
      .then(() => {
        utils.createPasswordHash(password).then(hash => {
          pwdHash = hash;
          User.create({
            email,
            pwdHash,
          }).then(() => done());
        })
      })
      .catch(err => done(err));
  });

  describe('User creation', () => {
    it('should have an email and password hash', done => {
      User.create({
        email: `1${email}`,
        pwdHash,
      }).then(user => {
        expect(user).not.to.be.null;
        expect(user.email).to.equal(`1${email}`);
        expect(user.pwdHash).to.equal(pwdHash);
        done();
      });
    });
  });

  describe('PUT', () => {
    it('should update user email from /:id', done => {
      const newEmail = 'newemail@new.cool';
      chai.request(app)
        .put('/users/1')
        .send({email: newEmail})
        .end((err, res) => {
          const user = JSON.parse(res.text);
          expect(err).to.be.null;
          expect(user.email).to.equal(newEmail);
          done();
        });
    });

    it('should return 404 if no user is found', done => {
      chai.request(app)
        .put('/users/523')
        .send({email: 'PFUDOR@hello.com'})
        .end((err, res) => {
          expect(err).not.to.be.null;
          expect(res.statusCode).to.equal(404);
          expect(JSON.parse(res.text).error).to.equal('No user found by id: 523');
          done();
        });
    });
  });

  describe('User authenticate', () => {
    it('should return user information on login', done => {
      chai.request(app)
        .post('/users/auth')
        .send({email, password})
        .end((err, res) => {
          expect(err).to.be.null;
          expect(JSON.parse(res.text).email).to.equal(email);
          expect(JSON.parse(res.text).pwdHash).to.be.undefined;
          done();
        });
    });
  });
});
