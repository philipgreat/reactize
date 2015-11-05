var fs = require('fs')
fs.readFile('./test.html', 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}
	//console.log(data);

	var DOMParser = require('xmldom').DOMParser;
	var doc = new DOMParser().parseFromString(data, 'text/xml');

	var firstElement = doc.getElementsByTagName('div')[0]

	var XMLSerializer = require('xmldom').XMLSerializer;
	var s = new XMLSerializer();

	var handelNode = function(node) {

		//console.log("node: "+node.nodeType+": "+node);
		if (node.nodeType != 1) {
			return;
		}
		// this is an element node

		var componentName = node.getAttribute("rc");
		if (!componentName) {
			return;
		}
		node.removeAttribute("rc");

		node.parentNode.removeChild(node);// removeChild
		var childComponent = doc.createElement(componentName);
		node.parentNode.appendChild(childComponent);
		// console.log("node1: "+node.nodeType +" -->\n\t:"+node);
		// create a component named <componentName> and put the text into
		// renders;
		/*
		 * var ExampleApplication = React.createClass({ render: function() {
		 * 
		 * return <p>{message}</p>; } });
		 */
		var componentCode = "var " + componentName + " = React.createClass({\n"
				+ "\trender: function() {\n" + "\t\treturn (" + node + ");\n"
				+ "\t}\n" + "});\n"
		console.log(componentCode);
	}

	var reactize = function(node, postCallback, preCallback) {
		if (!node) {
			
			return;
		}
		if (preCallback) {
			
			if (typeof (preCallback) == 'function') {
				preCallback(node);
			}
		}

		var childNodes = node.childNodes;
		if (!childNodes) {
			
			return;
		}
		for (var i = 0; i < childNodes.length; i++) {
			var childNode = childNodes[i];
			reactize(childNode, postCallback, preCallback);
		}

		if (postCallback) {
		
			if (typeof (postCallback) == 'function') {
				postCallback(node);
			}
		}
	}

	//console.info(s.serializeToString(doc));

	reactize(doc, handelNode);

});
