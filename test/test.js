const path = require('path');
const m = require('../');

//onst imagesDir = path.join(__dirname, 'test_imgs');
const modelFileLocation = 'C:\\cntk_model\\Fast-RCNN.model';
const imagesDir = 'C:\\cntk_input\\testImages';

model = new m.CNTKFRCNNModel(modelFileLocation);
model.evaluateDirectory(imagesDir, (err, res) => {
    if (err) {
        console.info(err)
        return;
    }
    console.info('%j', res);
});