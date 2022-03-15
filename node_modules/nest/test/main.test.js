var assert = require('assert');
var c      = require('../').createClient({
  host: 'github.com',
  path: '/api/v2/json/'
});

module.exports = {
  "test exports": function () {
    assert.equal('function', typeof c.get);
    assert.equal('function', typeof c.post);
    assert.equal('function', typeof c.put);
    assert.equal('function', typeof c.delete);
    assert.equal('function', typeof c.patch);
  },
  "test defaults": function () {
    assert.equal(80, c.port);
    assert.equal('github.com', c.host);
    assert.equal('/api/v2/json/', c.path);
    assert.equal(false, c.secure);
  },
  "test get": function (done) {
    c.get('repos/show/votizen/nest', {
      response: 'json'
    }, function (error, response, body) {
      if (error) {
        throw error;
      }

      assert.ok(body.repository);

      done();
    });
  }
};
