require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('creates', () => {
    describe('create start process', () => {
        it('should start a new process', done => {
            zapier.tools.env.inject();
            const bundle = {
                authData: {
                    url: process.env.BASE_URL
                },
                inputData: {
                    processName: process.env.USERNAME,
                    step: 1
                }
            };

            nock(bundle.authData.url)
                .post('/api/rest/v2/application/incidents/' + bundle.inputData.processName)
                .reply(200, {
                    "incidents": [
                        {
                            "workflowId": "efb6df7ad40f6dbcbbd54c75881a58530000001475",
                            "stepId": "efb6df7ad40f6dbcbbd54c75881a58530000001771",
                            "processId": "efb6df7ad40f6dbcbbd54c75881a58530000001384",
                            "incidentnumber": 11,
                            "jobfunction": "admins",
                            "username": "admin"
                        }
                    ]
                });

            appTester(App.creates.startProcess.operation.perform, bundle)
                .then(result => {
                    result.should.have.property('incidents');
                    const incidents = result.incidents;
                    done();
                })
                .catch(done);
        });
    });
});