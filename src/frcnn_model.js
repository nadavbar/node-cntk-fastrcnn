const fs = require('fs');
const path = require('path')
const EvalClient = require('./python_eval_client').EvalClient;
var DEFAULT_CNTK_INSTALL_PATH = null;

if (process.platform == 'win32') {
    DEFAULT_CNTK_INSTALL_PATH = 'c:\\local\\cntk';
}
else {
    DEFAULT_CNTK_INSTALL_PATH = path.join(process.env.HOME,'cntk');
}

/*
opts:
{
    cntkModelPath : Path to the CNTK Fast-RCNN model file
    cntkPath : The directory in which CNTK is installed. Default value: 'C:\local\cntk'
    cntkEnv : The CNTK env to use (e.g. 'cntk-py34', or 'cntk-py35'). If not specified, the latest available version is used
    anacondaPath: Path where anaconda is installed
    verbose : if set - the module will write verbose output when running evaluation. Default: false
}
*/
function CNTKFRCNNModel(opts) {
    if (!opts.cntkModelPath) {
        throw new Error('No CNTK model path was specified');
    }

    if (!fs.existsSync(opts.cntkModelPath)) {
        throw new Error('Given model file does not exist!')
    }

    this.cntkModelPath = opts.cntkModelPath;
    this.cntkPath = opts.cntkPath || DEFAULT_CNTK_INSTALL_PATH;
    this.cntkEnv = opts.cntkEnv;
    this.anacondaPath = opts.anacondaPath;
    this.verbose = opts.verbose;

    evalClient = new EvalClient(this.cntkModelPath, this.cntkPath, this.cntkEnv, this.anacondaPath, this.verbose);

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