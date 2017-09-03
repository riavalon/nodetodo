const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const app = require('../../');

chai.use(chaiHttp);


describe('Generic root routes', () => {
  describe('GET /', () => {
    it('should return JSON with the environment', () => {
      chai.request(app)
        .get('/')
        .end((req, res) => {
          expect(res.json).to.equal({
            env: 'development'
          });
        });
    });
  });
});
