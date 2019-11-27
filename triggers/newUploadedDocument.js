const hydrators = require('../hydrators');

const getUploadedDocRequest = (z, bundle) => {
    const requestOptions = {
        url: '{{bundle.authData.url}}/api/rest/v2/application/jobarchive/archives/{{bundle.inputData.archive}}/documents/recent',
        method: 'GET'
    };
    return z
        .request(requestOptions)
        .then(response => {
            // const files = [{'id': Math.floor(Math.random() * 9999)}];
            const files = JSON.parse(response.content);

            files.map(file => {
                file.file = z.dehydrateFile(hydrators.downloadFile, {
                    fileId: file.id
                });
            });

            return files;
        });
};

module.exports = {
    key: 'newDocumentUploaded',
    noun: 'newDocumentUploaded',
    display: {
        label: 'New Document Uploaded',
        description: 'Trigger when new document uploaded'
    },
    operation: {
        inputFields: [
            {
                key: 'archive',
                required: true,
                label: 'Archive',
                helpText: 'Name of archive table or GUID of archive'
            }
        ],
        outputFields: [
            { key: 'file', type: 'file', label: 'File' }
        ],
        perform: getUploadedDocRequest
    }
};