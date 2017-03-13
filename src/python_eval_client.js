const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');
const tmp = require('tmp');
const exec = require('child_process').exec;
const CNTK_CMD_TEMPLATE = "%s " + path.join(__dirname, 'frcnn_detector.py') + 
                          ' --input %s --json-output %s --model %s --cntk-path %s'

function getLastSortedDirectory(prefix, path) {
    var entries = fs.readdirSync(path)
    var filteredEntries = entries.filter((value) => {return value.toLowerCase().startsWith(prefix)});
    filteredEntries.sort();
    return filteredEntries[filteredEntries.length - 1];
}

function getCntkEnvForPlatform(cntkInstallDir) {
    if (process.platform == 'win32') {
        var envScripts = fs.readdirSync(path.join(cntkInstallDir, 'Scripts')).filter((value) => {return value.toLowerCase().startsWith('cntkpy')});
        var envScriptName = envScripts.sort()[envScripts.length - 1];
        var re = /(py[0-9][0-9])/;
        res = re.exec(envScriptName);
        return 'cntk-' + res[1];
    }
    else {
        var envActivateScript = fs.readFileSync(path.join(cntkInstallDir, 'activate-cntk'));
        var re = /envs\/(cntk-py[0-9][0-9])/;
        res = re.exec(envActivateScript);
        return res[1];
    }
}

function resolveCntkEnvDir(anacondaInstallDir, cntkInstallDir, cntkEnv) {
    var anacondaPath = getLastSortedDirectory('anaconda3', anacondaInstallDir);
    var envsPath = path.join(anacondaInstallDir, anacondaPath, 'envs');
    if (!cntkEnv) {
        cntkEnv = getCntkEnvForPlatform(cntkInstallDir);
        if (process.platform != 'win32') {
            cntkEnv = path.join(cntkEnv, 'bin')
        }
    }
    else {
        if (!fs.existsSync(path.join(envsPath, cntkEnv))) {
            throw new Error(util.format('Given cntk env: %s does not exist', cntkEnv))
        }
    }
    return path.join(envsPath, cntkEnv);
}

function getAndEnsureJsonTempDir() {
    var tmpDirPath = path.join(os.tmpDir(), 'node_cntk_fastrcnn');
    if (!fs.existsSync(tmpDirPath)) {
        fs.mkdirSync(tmpDirPath);
    }

    return tmpDirPath;
}

function buildCntkCmd(directoryPath, cntkModelPath, cntkEnvDirPath, jsonFilePath, cntkInstallDir) {
    return util.format(CNTK_CMD_TEMPLATE, path.join(cntkEnvDirPath, 'python'), directoryPath, 
                       jsonFilePath, cntkModelPath, cntkInstallDir)
}

function runCNTK(cntk_cmd, cb) {
    var proc = exec(cntk_cmd);
    
    var error_data = '';
    var output_data = '';

    proc.stdout.on('data', function(data) {
        output_data += data;
    });

    proc.stderr.on('data', function(data) {
        error_data += data;
    });

    proc.on('exit', (exitCode)=> {
        var err = null;
        if (exitCode != 0) {
            var errorMesage = util.format("CNTK Process failed with error code %d\nError output:%s",exitCode, error_data);
            err = Error(errorMesage)
        }
        cb(err, output_data);
    });
}

function evalDirectoryImp(directoryPath, cntkModelPath, cntkEnvDirPath, jsonTempDir, cntkInstallDir, verbose, cb) {
    tmp.tmpName({dir : jsonTempDir, postfix: '.json'}, (err, jsonFilePath)=> {
        if (err) {
            return cb(err);
        }
        
        var cmd = buildCntkCmd(directoryPath, cntkModelPath, cntkEnvDirPath, jsonFilePath, cntkInstallDir);
        runCNTK(cmd, (err, output_data) =>{
            console.info('verbose')
            if (verbose) {
                console.info('CNTK process output:')
                console.info(output_data);
            }

            if (err) {
                return cb(err);
            }
            fs.readFile(jsonFilePath, (err, content) =>{
                // call delete on the file and ignore the result since the json is in a temp directory anyway
                if (fs.existsSync(jsonFilePath)) {
                    fs.unlink(jsonFilePath);
                }

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

function EvalClient(cntkModelPath, cntkInstallDir, cntkEnv, verbose) {
    this.cntkInstallDir = cntkInstallDir;
    this.cntkModelPath = cntkModelPath;
    this.verbose = !!verbose;

    var isWindows = process.platform == 'win32';
    var anacondaInstallDir = null;
    if (isWindows) {
        anacondaInstallDir = path.dirname(cntkInstallDir);
    }
    else {
        anacondaInstallDir = process.env['HOME'].toString();
    }

    this.cntkEnvDirPath = resolveCntkEnvDir(anacondaInstallDir, cntkInstallDir, cntkEnv);
    // add to path..
    if (isWindows) {
        process.env.PATH = this.cntkEnvDirPath + ';' + process.env.PATH;
    }
    else {
        process.env.PATH = cntkInstallDir + '/cntk/bin:' + process.env.PATH;
        process.env.LD_LIBRARY_PATH= cntkInstallDir + '/cntk/lib:' + cntkInstallDir + '/cntk/dependencies/lib:' + process.env.LD_LIBRARY_PATH;
    }
    
    this.jsonTempDir = getAndEnsureJsonTempDir();

    this.evalDirectory = function(directoryPath, cb) {
        try {
            evalDirectoryImp(directoryPath, this.cntkModelPath, this.cntkEnvDirPath, 
            this.jsonTempDir, this.cntkInstallDir, this.verbose, cb);
        }
        catch(e) {
            return cb(e);
        }
    }
}

exports.EvalClient = EvalClient;