const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const {utils, User} = require('../../app/users');
const expect = chai.expect;
const assert = chai.assert;


chai.use(chaiHttp);

describe('User Resource Utils', () => {
  describe('bcrypt', () => {
    it('should return a new password hash in promise', done => {
      utils.createPasswordHash('secret').then(res => {
        expect(res).not.to.be.null;
        expect(typeof res).to.equal('string');
        done();
      });
    });

    it('should verify a password against a hash', done => {
      utils.createPasswordHash('secret').then(res => {
        utils.verifyPassword(res, 'secret').then(valid => {
          expect(valid).to.be.true;
          done();
        });
      });
    });
  });
});
