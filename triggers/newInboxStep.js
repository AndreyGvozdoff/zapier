const getInboxItemsRequest = (z, bundle) => {
    const requestOptions = {
        url: '{{bundle.authData.url}}/api/rest/v2/application/workitems/inbox/recent',
        method: 'get'
    };
    return z
        .request(requestOptions)
        .then(response => z.JSON.parse(response.content));
};

module.exports = {
    key: 'newInboxStep',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'newInboxStep',
    display: {
        label: 'New inbox step',
        description: 'Trigger when new inbox step'
    },

    // `operation` is where the business logic goes.
    operation: {
        // `inputFields` can define the fields a user could provide,
        // we'll pass them in as `bundle.inputData` later.
        inputFields: [

        ],

        perform: getInboxItemsRequest
    }
};