const chai = require('chai');
const chaiHttp = require('chai-http');

const Task = require('../../app/tasks/models');
const expect = chai.expect;


describe('Task Model', () => {
  it('should have correct properties', done => {
    const title = 'My cool test task';
    const complete = false;
    const userId = 1;
    Task.sync({force: true, logging: false}).then(() => {
      Task.create({
        title,
        complete,
        userId,
      }).then(task => {
        expect(task.title).to.equal(title);
        expect(task.complete).to.equal(complete);
        expect(task.userId).to.equal(userId);
        done();
      });
    });
  });
});
