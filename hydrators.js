const hydrators = {
    downloadFile: (z, bundle) => {
        const url = bundle.authData.url + `/api/rest/v2/application/jobarchive/archives/EMPLOYEES/documents/${bundle.inputData.fileId}/file`;
        const filePromise = z.request({
            url: url,
            raw: true
        });

        return z.stashFile(filePromise).then(url => {
            z.console.log(`Stashed URL = ${url}`);
            return url;
        });
    }
};

module.exports = hydrators;