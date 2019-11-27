require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('triggers', () => {
    zapier.tools.env.inject();
    describe('new inbox steps trigger', () => {
        it('should load all inbox steps', done => {
            const bundle = {
                authData: {
                    url: process.env.BASE_URL
                }
            };

            nock(bundle.authData.url)
                .get('/api/rest/v2/application/workitems/inbox/recent')
                .reply(200, [
                    {id: '7f7b5b87b8be734d92fe044954d7467f0000001365'}
                ]);

            appTester(App.triggers.newInboxStep.operation.perform, bundle)
                .then(results => {
                    results.length.should.above(0);

                    const workflowId = results[0];
                    workflowId.should.have.property('id');
                    workflowId.id.should.eql('7f7b5b87b8be734d92fe044954d7467f0000001365');
                    done();
                })
                .catch(done);
        });
    });

    describe('new uploaded document trigger', () => {
        it('should load new uploaded document', done => {
            const bundle = {
                authData: {
                    url: process.env.BASE_URL
                },
                inputData: {
                    archive: 'employees'
                }
            };

            // mocks the next request that matches this url and querystring
            nock(bundle.authData.url)
                .get('/api/rest/v2/application/jobarchive/archives/'+bundle.inputData.archive+'/documents/recent')
                .reply(200, [
                    {id: 69}
                ]);

            appTester(App.triggers.newDocumentUploaded.operation.perform, bundle)
                .then(results => {
                    results.length.should.above(0);

                    const revisionId = results[0];
                    revisionId.should.have.property('id');
                    revisionId.id.should.eql(69);

                    done();
                })
                .catch(done);
        });

    });
});