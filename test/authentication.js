'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('authentication', () => {
  zapier.tools.env.inject();

  it('should authenticate', (done) => {
    const bundle = {
      authData: {
        url: process.env.BASE_URL,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      }
    };

      nock(bundle.authData.url)
          .get('/api/rest/application/users/'+bundle.authData.username)
          .reply(200, {
              "users": [
                  {}
              ]
          });

    appTester(App.authentication.test, bundle)
        .then((response) => {
          should.exist(response.users);
          done();
        })
        .catch(done);
  });

});