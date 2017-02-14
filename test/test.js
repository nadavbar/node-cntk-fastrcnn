const path = require('path');
const m = require('../');

imagesDir = path.join(__dirname, 'test_imgs');
mockModelFileLocation = 'mock_model_file_location'

model = new m.CNTKFRCNNModel(mockModelFileLocation);
model.evaluateDirectory(imagesDir, (err, res) => {
    if (err) {
        console.info(err)
        return;
    }
    console.info('%j', res);
});