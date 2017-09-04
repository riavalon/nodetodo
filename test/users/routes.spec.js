const chai = require('chai');
const chaiHttp = require('chai-http');
const uuid = require('node-uuid');
const expect = chai.expect;

const {User, utils} = require('../../app/users');
const app = require('../../');


describe('User Resource', () => {
  const email = 'user@example.com';
  const pwdHash = uuid.v4();

  beforeEach(done => {
    User.sync({force: true, logging: false}).then(() => {
      User.create({
        email,
        pwdHash,
      }).then(() => done())
      .catch(err => done(err));
    });
  });

  describe('GET', () => {
    it('should specific user from /:id', done => {
      chai.request(app)
        .get('/users/1')
        .end((err, res) => {
          const user = JSON.parse(res.text);
          expect(err).to.be.null;
          expect(user.email).to.equal(email);
          expect(user.pwdHash).to.be.undefined;
          done();
        });
    });
  });

  describe('POST', () => {
    it('should create a specific user from /new', done => {
      const testemail = 'hello@gmail.com';
      const testpassword = 'supersecure';
      chai.request(app)
        .post('/users/new')
        .send({email: testemail, password: testpassword})
        .end((err, res) => {
          const user = JSON.parse(res.text);
          expect(err).to.be.null;
          expect(user.email).to.equal(testemail);
          expect(user.pwdHash).to.be.undefined;
          done();
        });
    });
  });

  describe('DELETE', () => {
    it('should remove a specific user from /:id', done => {
      chai.request(app)
        .delete('/users/1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(JSON.parse(res.text).result).to.be.true;
          User.findById('1').then(user => {
            expect(user).to.be.null;
            done();
          });
        });
    });

    it('should return an error if no user is found at /:id', done => {
      chai.request(app)
        .delete('/users/523')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(JSON.parse(res.text).result).to.equal('Error: no user found by id 523.');
          done();
        });
    });
  });
});
