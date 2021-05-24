const axios = require('axios');

async function executeCode(requestData) {
    return new Promise((resolve, reject) => {
        axios.post('/asdf/execute', {
            code: requestData.code,
            testCode: requestData.testCode,
            projectID: requestData.projectID
        })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error)
            })
    })
}