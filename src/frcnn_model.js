DEFAULT_CNTK_INSTALL_PATH = 'c:\\local'
const EvalClient = require('./mock_eval_client').EvalClient;

function CNTKFRCNNModel(cntkModelPath, cntkPath) {
    if (!cntkModelPath) {
        throw new Error('No CNTK model path was specified');
    }

    this.cntkModelPath = cntkModelPath;
    this.cntkPath = cntkPath || DEFAULT_CNTK_INSTALL_PATH;

    evalClient = new EvalClient(cntkModelPath, cntkPath);

    this.evaluateDirectory = function evaluateDirectory(directoryPath, cb) {
        if (!directoryPath) {
            throw new Error('No input images directory was specified');
        }

        if (!cb || (typeof cb != 'function')) {
            throw new Error('No completion callback was given, or non-function was given as second argument');
        }

        evalClient.evalDirectory(directoryPath, cb);
    }
}

module.exports.CNTKFRCNNModel = CNTKFRCNNModel;