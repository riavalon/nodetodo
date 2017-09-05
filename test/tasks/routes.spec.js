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
            userId: 1,
          });
        });

        Task.create({
          title: 'task for different user',
          complete: false,
          userId: 2,
        });
        done();
      })
      .catch((err) => done(err));
  });

  describe('GET /', () => {
    it('should return an array of task objects in DB for user', done => {
      chai.request(app)
        .get('/tasks?userId=1')
        .end((err, res) => {
          const tasks = JSON.parse(res.text);
          expect(Array.isArray(tasks)).to.equal(true);
          expect(tasks.length).to.equal(5);
          tasks.forEach(task => {
            expect(task.userId).to.equal(1);
          });
          done();
        });
    });

    it('should throw 400 if no userId is provided', done => {
      chai.request(app)
        .get('/tasks')
        .end((err, res) => {
          expect(err).not.to.be.null;
          expect(JSON.parse(res.text).error).to.equal('Must specify user id');
          done();
        });
    });

    it('should return an individual task with /:id', done => {
      chai.request(app)
        .get('/tasks/2?userId=1')
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
        .send({title, complete: true, userId: 1})
        .end((err, res) => {
          expect(err).to.be.null;
          Task.findOne({where: {title}}).then(task => {
            expect(task).not.to.be.undefined;
            expect(task.dataValues.title).to.equal(title);
            done();
          });
        });
    });

    it('should return 400 if no user id', done => {
      chai.request(app)
        .post('/tasks/new')
        .send({irrelevant: 'testing'})
        .end((err, res) => {
          expect(err).not.to.be.null;
          expect(JSON.parse(res.text).error).to.equal('Must specify user id');
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('should update a task title', done => {
      const newTitle = 'There ain\'t no rest for the wicked';
      chai.request(app)
        .get('/tasks/2?userId=1')
        .end((err, res) => {
          const task = JSON.parse(res.text);
          chai.request(app)
            .put('/tasks/2?userId=1')
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

    it('should return 400 if no user id', done => {
      chai.request(app)
        .put('/tasks/2')
        .send({whoCares: 'nobody'})
        .end((err, res) => {
          expect(err).not.to.be.null;
          expect(JSON.parse(res.text).error).to.equal('Must specify user id');
          done();
        });
    });
  });

  describe('DELETE /:id', () => {
    it('should remove a task based on ID', done => {
      chai.request(app)
        .delete('/tasks/2?userId=1')
        .end((err, res) => {
          expect(JSON.parse(res.text).result).to.equal(true);
          Task.findAll().then(tasks => {
            expect(tasks.length).to.equal(5);
            done();
          });
        });
    });

    it('returns 400 if no user id', done => {
      chai.request(app) 
        .delete('/tasks/2')
        .end((err, res) => {
          expect(err).not.to.be.null;
          expect(JSON.parse(res.text).error).to.equal('Must specify user id');
          done();
        });
    });
  });
});
