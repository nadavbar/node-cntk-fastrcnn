const fs = require('fs');
const path = require('path');

MOCK_CLASSES = {'player': 1};
MOCK_REGION = {
    'region' : {'x1' : 1, 'y1' : 1, 'x2' : 50, 'y2' : 50, 'class' : 1},
}


function EvalClient(cntkModelPath, cntkInstallDir) {

    this.evalDirectory = function(directoryPath, cb) {
        resultsObj = {
            'classes' : MOCK_CLASSES,
            'frames' : {}
        };

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                cb(err);
            }
            files.forEach(file => {
                if (path.extname(file) == ".jpg") {
                    resultsObj['frames'][file] = {'regions' : [MOCK_REGION]}
                }
            });

            cb(null, resultsObj)
        });
    }
}


exports.EvalClient = EvalClient;