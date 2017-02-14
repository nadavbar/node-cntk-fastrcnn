const fs = require('fs');
const path = require('path');

MOCK_CLASSES = ['person', 'player'];
MOCK_REGION = {
    'region' : {'x1' : 1, y1 : 1, x2 : 50, y2 : 50},
    'class' : 'person'
}

function evalDirectory(directoryPath, cb) {

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
                resultsObj['frames'][file] = [MOCK_REGION]
            }
        });

        cb(null, resultsObj)
    });
}


exports.evalDirectory = evalDirectory;