const hydrators = require('./hydrators');
const authentication = require('./authentication');
const startProcess = require('./creates/startProcess');
const newInboxStep = require('./triggers/newInboxStep');
const newDocumentUploaded = require('./triggers/newUploadedDocument');

const includeSessionKeyHeader = (request, z, bundle) => {
  if (bundle.authData.tokenKey) {
    request.headers = request.headers || {};
    request.headers['X-Jobrouter-Authorization'] = 'Bearer ' + bundle.authData.tokenKey;
  }
  return request;
};

const sessionRefreshIf401 = (response, z, bundle) => {
  if (bundle.authData.tokenKey) {
    if (response.status === 401) {
      throw new z.errors.RefreshAuthError(); // ask for a refresh & retry
    }
  }
  return response;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [includeSessionKeyHeader],

  afterResponse: [sessionRefreshIf401],

  hydrators: hydrators,

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {},

  // If you want your trigger to show up, you better include it here!
  triggers: {
      [newInboxStep.key]: newInboxStep,
      [newDocumentUploaded.key]: newDocumentUploaded
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
      [startProcess.key]: startProcess
  }
};

// Finally, export the app.
module.exports = App;
