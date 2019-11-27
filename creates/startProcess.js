const FormData = require('form-data');
const request = require('request');
const url = require("url");

const startProcessRequest = (z, bundle) => {
    const formData = new FormData();
    const processTableData = bundle.inputData.processTableData;
    const subTableData = bundle.inputData.subTableData;

    formData.append('username', bundle.authData.username);
    formData.append('step', bundle.inputData.step ? bundle.inputData.step : 1);

    if(subTableData instanceof Object) {
        Object.keys(subTableData).map(function(fieldName, index) {
            var value = subTableData[fieldName];
            formData.append(fieldName, value);
        });
    }
    return new Promise((resolve, reject) => {
        if (processTableData instanceof Object) {
            Object.keys(processTableData).map(function(fieldName, index) {
                const value = processTableData[fieldName];
                const urlObject = url.parse(value);
                formData.append(`processtable[fields][${index}][name]`, fieldName);
                if (urlObject.hostname !== null && urlObject.hostname === 'zapier-dev-files.s3.amazonaws.com') {
                    const file = request(value);
                    formData.append(`processtable[fields][${index}][value]`, file, { filename: fieldName + '.pdf' });
                } else {
                    formData.append(`processtable[fields][${index}][value]`, value);
                }
            });
            resolve();
        }
    }).then(() => {
        const requestOptions = {
            url: "{{bundle.authData.url}}/api/rest/v2/application/incidents/{{bundle.inputData.processName}}",
            method: "POST",
            body: formData
        };

        return z
            .request(requestOptions)
            .then(response => z.JSON.parse(response.content));
    });
};

module.exports = {
    key: "startProcess",
    noun: "startProcess",
    display: {
        label: "Start Process",
        description: "Trigger Start Process"
    },
    operation: {
        inputFields: [
            {
                key: "processName",
                type: "string",
                helpText: "Which process should trigger on.",
                required: true
            }, {
                key: "step",
                type: "integer",
                helpText: "Which process step should trigger on.",
                required: true
            }, {
                key: "processTableData",
                label: "Process table data",
                type: "string",
                helpText: "Name/value of field in your process table",
                dict: true
            }, {
                key: "subTableData",
                label: "Sub-table data",
                type: "string",
                helpText: "Name/value of field in your sub table",
                dict: true
            }
        ],
        perform: startProcessRequest
    }
};