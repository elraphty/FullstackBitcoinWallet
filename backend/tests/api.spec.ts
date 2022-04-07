import request from 'supertest';
import assert from 'assert';
import app from '../app';

beforeEach((done) => {
    app.listen(done);
});

describe('Index route should return 200', function () {
    it('responds with a message', function (done) {
        request(app)
            .get('/')
            .expect('Content-Type', /text\/html/)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.statusCode, 200);
                assert(res.text.includes('This is the index route'))
                return done();
            });
    });
});

describe('A wrong route should return 404', function () {
    it('responds with an error message', function (done) {
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.statusCode, 404);
                assert(res.text.includes('You are hitting a wrong route, find the valid routes below'));
                return done();
            });
    });
});

