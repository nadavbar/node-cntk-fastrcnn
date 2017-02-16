const fs = require('fs');
const path = require('path');
const os = require('os');
const tmp = require('tmp');

function resolveCntkEnv(cntkInstallDir) {
    entries = fs.readdirSync(cntkInstallDir)
    anacondaEntries = entries.filter((value) => {return value.toLowerCase().startsWith('anaconda3-')});
    anacondaEntries.sort();
    anacondaPath = anacondaEntries[anacondaEntries.length - 1];
    return path.join(cntkInstallDir, anacondaPath, 'envs/cntk-py34/python.exe');
}

function getAndEnsureJsonTempDir() {
    var tmpDirPath = path.join(os.tmpDir(), 'node_cntk_fastrcnn');
    if (!fs.existsSync(tmpDirPath)) {
        fs.mkdirSync(tmpDirPath);
    }

    return tmpDirPath();
}

function buildCntkCmd(directoryPath, cntkModelPath, cntkEnvPath, jsonFilePath) {
    
}

function evalDirectoryImp(directoryPath, cntkModelPath, cntkEnvPath, jsonTempDir, cb) {
    jsonFilePath = path.join()
}

function EvalClient(cntkInstallDir, cntkModelPath) {
    this.cntkInstallDir = cntkInstallDir;
    this.cntkModelPath = cntkModelPath;
    this.cntkEnvPath = resolveCntkEnv();
    this.jsonTempDir = getAndEnsureJsonTempDir();

    this.evalDirectory = function(directoryPath, cb) {
        try {
            evalDirectoryImp(directoryPath, this.cntkModelPath, this.cntkEnvPath, cb);
        }
        catch(e) {
            return cb(e);
        }
    }
}


exports.EvalClient = EvalClient;

console.info(resolveCntkEnv('c:\\local'))