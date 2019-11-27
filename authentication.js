'use strict';

const getToken = (z, bundle) => {
    const promise = z.request({
        method: 'POST',
        url: bundle.authData.url + '/api/rest/application/tokens',
        body: {
            username: bundle.authData.username,
            password: bundle.authData.password
        }
    });

    return promise.then(response => {
        if (response.status === 401) {
            throw new Error('The username/password you supplied is invalid');
        }
        return {
            tokenKey: z.JSON.parse(response.content).tokens
        };
    });
};

const authentication = {
    type: 'session',
    // "test" could also be a function
    test: {
        url: '{{bundle.authData.url}}/api/rest/application/users/{{bundle.authData.username}}'
    },
    fields: [
        {key: 'url', type: 'string', required: true, helpText: 'Your environment url.'},
        {key: 'username', type: 'string', required: true, helpText: 'Your login username.'},
        {key: 'password', type: 'password', required: true, helpText: 'Your login password.'},


        // For Session Auth we store `tokenKey` automatically in `bundle.authData`
        // for future use. If you need to save/use something that the user shouldn't
        // need to type/choose, add a "computed" field, like:
        // {key: 'something': type: 'string', required: false, computed: true}
        // And remember to return it in sessionConfig.perform
    ],
    sessionConfig: {
      perform: getToken
    }
};

module.exports = authentication;