# node-cntk-fastrcnn
A node wrapper a CNTK Fast-RCNN model

Note: The model works with CNTK v2 Models. 
For more info about the CNTK Fast-RCNN implementation, take a look at [this tutorial](https://github.com/Microsoft/CNTK/wiki/Object-Detection-using-Fast-R-CNN) and [this notebook](https://github.com/nadavbar/cntk-fastrcnn/blob/master/frcnn_eval.ipynb).

###How to use

First, load the module and create an instance of a CNTKFRCNNModel object.
The constructor accepts two parameters:
 - A path of the CNTK model file
 - (Optional) The installation location of CNTK. If not provided, the parameter defaults to "c:\local" 

For example:

```javascript
const CNTKFRCNNModel = require('cntk-fastrcnn').CNTKFRCNNModel;

const modelFileLocation = 'C:\\cntk_model\\Fast-RCNN.model';

model = new CNTKFRCNNModel(modelFileLocation /*, optional: CNTK install location, default is C:\local */);
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
		"human": 1,
		"cat": 2,
		"dog" : 3
	}
}
```
