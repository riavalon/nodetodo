const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const app = require('../../');
const {Task} = require('../../app/tasks');

chai.use(chaiHttp);


describe('Tasks Resource', () => {
  beforeEach(done => {
    Task.sync({force: true})
      .then(() => {
        Array.from({length: 5}).forEach((_, idx) => {
          Task.create({
            title: `some test task ${idx+1}`,
            complete: false,
          });
        });
        done();
      })
      .catch((err) => done(err));
  });

  describe('GET /', () => {
    it('should return an array of task objects in DB', done => {
      chai.request(app)
        .get('/tasks/')
        .end((err, res) => {
          expect(Array.isArray(JSON.parse(res.text))).to.equal(true);
          expect(JSON.parse(res.text).length).to.equal(5);
          done();
        });
    });

    it('should return an individual task with /:id', done => {
      chai.request(app)
        .get('/tasks/2')
        .end((req, res) => {
          Task.findById('2').then(task => {
            expect(JSON.parse(res.text).title).to.equal(task.dataValues.title);
            done();
          });
        });
    });
  });

  describe('POST /new', () => {
    it('should create a new task', done => {
      const title = 'DK. Donkey Kong.';
      chai.request(app)
        .post('/tasks/new')
        .send({title, complete: true})
        .end((err, res) => {
          expect(err).to.be.null;
          Task.findOne({where: {title}}).then(task => {
            expect(task).not.to.be.undefined;
            expect(task.dataValues.title).to.equal(title);
            done();
          });
        });
    });
  });

  describe('PUT /:id', () => {
    it('should update a task title', done => {
      const newTitle = 'There ain\'t no rest for the wicked';
      chai.request(app)
        .get('/tasks/2')
        .end((err, res) => {
          const task = JSON.parse(res.text);
          chai.request(app)
            .put('/tasks/2')
            .send({title: newTitle, complete: true})
            .end((err, res) => {
              const updatedTask = JSON.parse(res.text);
              expect(err).to.be.null;
              expect(updatedTask.title).to.equal(newTitle);
              expect(updatedTask.complete).to.equal(!task.complete);
              done();
            });
        });
    });
  });

  describe('DELETE /:id', () => {
    it('should remove a task based on ID', done => {
      chai.request(app)
        .delete('/tasks/2')
        .end((err, res) => {
          expect(JSON.parse(res.text).result).to.equal(true);
          Task.findAll().then(tasks => {
            expect(tasks.length).to.equal(4);
            done();
          });
        });
    });
  });
});
