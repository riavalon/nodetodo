const chai = require('chai');
const chaiHttp = require('chai-http');

const {routes} = require('../../app/tasks');
const expect = chai.expect;

chai.use(chaiHttp);


describe('Tasks Resource', () => {
  describe('GET /', () => {
    it('should return an array of task objects in DB', () => {
      chai.request(routes)
        .get('/')
        .end((req, res) => {
          expect(Array.isArray(res.json)).to.equal(true);
          expect(res.json.length).to.equal(5);
        });
    });
  });
});
