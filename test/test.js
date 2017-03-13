const path = require('path');
const m = require('../');


const modelFileLocation = path.join(__dirname, 'Fast-RCNN.model');
const imagesDir = path.join(__dirname, 'testImages');

model = new m.CNTKFRCNNModel({cntkModelPath : modelFileLocation,
    verbose : true});
model.evaluateDirectory(imagesDir, (err, res) => {
    if (err) {
        console.info(err)
        return;
    }
    console.info('%j', res);
});