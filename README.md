# cntk-fastrcnn for node.js
A node wrapper a CNTK Fast-RCNN model

Note: The model works with CNTK v2 Models. 
For more info about the CNTK Fast-RCNN implementation, take a look at [this tutorial](https://github.com/Microsoft/CNTK/wiki/Object-Detection-using-Fast-R-CNN) and [this notebook](https://github.com/nadavbar/cntk-fastrcnn/blob/master/frcnn_eval.ipynb).

The module uses the FRCNNDetector implementation from <a href="https://github.com/CatalystCode/CNTK-FastRCNNDetector">here</a>.


### Installation
Install by running:

```
npm install cntk-fastrcnn
```

## Python Preliminaries

Since the FRCNN detector uses bits of the CNTK Fast-RCNN implementation it has the same requirements as the CNTK
Fast-RCNN training pipeline. 

Before running the code in this repository, please make sure to install the required python packages as described
in <a href="https://github.com/Microsoft/CNTK/wiki/Object-Detection-using-Fast-R-CNN#setup">the Fast-RCNN CNTK tutorial</a>.  


###How to use

First, load the module and create an instance of a CNTKFRCNNModel object.

The constructor accepts an options object with the following fields:
 - cntkModelPath : Path to the CNTK Fast-RCNN model file.
 - cntkPath : The directory in which CNTK is installed. Default value: 'C:\local\cntk'.
 - cntkEnv : The CNTK env to use (e.g. 'cntk-py34', or 'cntk-py35'). If not specified, the latest available version is used.
 - verbose : if set - the module will write verbose output when running evaluation. Default: false.
 

For example:

```javascript
const CNTKFRCNNModel = require('cntk-fastrcnn').CNTKFRCNNModel;

const modelFileLocation = 'C:\\cntk_model\\Fast-RCNN.model';

model = new CNTKFRCNNModel({cntkModelPath : modelFileLocation});
```

Next, call the model for detection using the **evaluateDirectory** method.
Calling the function will result in running the model over every .jpg image in the given directory.

The function accepts the following parameters:
- A path for a directory with images that will be used as input
- A completion callback that accepts an **error** object as the first parameter and the **result** of the detection operation as the second parameter. 

For example:

```javascript
model.evaluateDirectory('c:\\cntk_input\\testImages', (err, res) => {
    if (err) {
        console.info(err)
        return;
    }
    console.info('%j', res);
});
```

The result object of the detection operation will contain the possible classes for the detected objects (with class names and class numeric ids), and for each image in the directory it will contain the list of regions that were detected. Each region will have its boundaries and detected class.

Here is an example of the result object of a directory that contains 2 images (named '1.jpg' and '2.jpg'):
```json
{
	"frames": {
		"1.jpg": {
			"regions": [
				{
					"class": 1,
					"x1": 418,
					"x2": 538,
					"y2": 179,
					"y1": 59
				}
			]
		},
		"2.jpg": {
			"regions": [
				{
					"class": 2,
					"x1": 478,
					"x2": 597,
					"y2": 298,
					"y1": 59
				}
			]
		}
	},
	"classes": {
		"background" : 0,
		"human": 1,
		"cat": 2,
		"dog" : 3
	}
}
```

### Adding descriptive classes names
Since CNTK does not embed the names of the classes in the model, on default, the module returns non descriptive names for the classes, e.g. "class_1", "class_2".

If you want the module to return more descriptive names, you can place a JSON file named "model.json" in the same directory of the Fast-RCNN model file.
You can then place the descriptions of the classes in the JSON file under the "classes" key.

For example, the following JSON will describe the classes for the above example:

```json
{
    "classes" : {
        "background" : 0,
        "human" : 1,
		"cat" : 2,
		"dog" : 3
    }
}
```
