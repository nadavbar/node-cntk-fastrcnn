const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');
const tmp = require('tmp');
const exec = require('child_process').exec;

const CNTK_CMD_TEMPLATE = "%s " + path.join(__dirname, 'frcnn_detector.py') + 
                          ' --input %s --json-output %s --model %s'

function resolveCntkEnv(cntkInstallDir) {
    entries = fs.readdirSync(cntkInstallDir)
    anacondaEntries = entries.filter((value) => {return value.toLowerCase().startsWith('anaconda3-')});
    anacondaEntries.sort();
    anacondaPath = anacondaEntries[anacondaEntries.length - 1];
    return path.join(cntkInstallDir, anacondaPath, 'envs/cntk-py34/python');
}

function getAndEnsureJsonTempDir() {
    var tmpDirPath = path.join(os.tmpDir(), 'node_cntk_fastrcnn');
    if (!fs.existsSync(tmpDirPath)) {
        fs.mkdirSync(tmpDirPath);
    }

    return tmpDirPath;
}

function buildCntkCmd(directoryPath, cntkModelPath, cntkEnvPath, jsonFilePath) {
    return util.format(CNTK_CMD_TEMPLATE, cntkEnvPath, directoryPath, jsonFilePath, cntkModelPath)
}

function runCNTK(cntk_cmd, cb) {
    var proc = exec(cntk_cmd);
    proc.on('exit', (err)=> {
        cb(err);
    });
}

function evalDirectoryImp(directoryPath, cntkModelPath, cntkEnvPath, jsonTempDir, cb) {
    tmp.tmpName({dir : jsonTempDir, postfix: '.json'}, (err, jsonFilePath)=> {
        if (err) {
            return cb(err);
        }
        
        var cmd = buildCntkCmd(directoryPath, cntkModelPath, cntkEnvPath, jsonFilePath);
        runCNTK(cmd, (err) =>{
            if (err) {
                return cb(err);
            }
            fs.readFile(jsonFilePath, (err, content) =>{
                // call delete on the file and ignore the result since the json is in a temp directory anyway
                fs.unlink(jsonFilePath);

                if (err) {
                    return cb(err);
                }
                
                try {
                    return cb(null, JSON.parse(content));
                }
                catch (e) {
                    return cb(e);
                }
            })
        });
    });
}

function EvalClient(cntkModelPath, cntkInstallDir) {
    this.cntkInstallDir = cntkInstallDir;
    this.cntkModelPath = cntkModelPath;
    this.cntkEnvPath = resolveCntkEnv(cntkInstallDir);
    this.jsonTempDir = getAndEnsureJsonTempDir();

    this.evalDirectory = function(directoryPath, cb) {
        try {
            evalDirectoryImp(directoryPath, this.cntkModelPath, this.cntkEnvPath, this.jsonTempDir, cb);
        }
        catch(e) {
            return cb(e);
        }
    }
}

exports.EvalClient = EvalClient;