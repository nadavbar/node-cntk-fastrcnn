DEFAULT_CNTK_PATH = 'c:\\local\\cntk'
var cntkEvalClient = require('./mock_eval_client');

function CNTKFRCNNModel(cntkModelPath, cntkPath) {
    if (!cntkModelPath) {
        throw new Error('No CNTK model path was specified');
    }

    this.cntkModelPath = cntkModelPath;
    this.cntkPath = cntkPath || DEFAULT_CNTK_PATH;

    this.evaluateDirectory = function evaluateDirectory(directoryPath, cb) {
        if (!directoryPath) {
            throw new Error('No input images directory was specified');
        }

        if (!cb || (typeof cb != 'function')) {
            throw new Error('No completion callback was given, or non-function was given as second argument');
        }

        cntkEvalClient.evalDirectory(directoryPath, cb);
    }
}

module.exports.CNTKFRCNNModel = CNTKFRCNNModel;