	// console.log("node1: "+node.nodeType +" -->\n\t:"+node);
	// create a component named <componentName> and put the text into
	// renders;
	/*
	 * var ExampleApplication = React.createClass({ render: function() {
	 * 
	 * return <p>{message}</p>; } });
	 */

var fs = require('fs');

var args = process.argv.slice(2);

fs.readFile('./test.html', 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}
	reactize(data);

});

var reactizeNode = function(node) {

	// console.log("node: "+node.nodeType+": "+node);
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
	var rootDoc=getRootDocument(node);
	var childComponent = rootDoc.createElement(componentName);
	node.parentNode.appendChild(childComponent);

	var componentCode = "var " + componentName + " = React.createClass({\n"
			+ "\trender: function() {\n" + "\t\treturn (" + node + ");\n"
			+ "\t}\n" + "});\n"
	console.log(componentCode);
}

var getRootDocument = function(node){
	var parentNode=node.parentNode;

  if(!parentNode){
			return node;
	}
	while(true){
		
		if(!parentNode.parentNode){
			return parentNode;
		}
		var parentNode=parentNode.parentNode;
	}
	
}


var visiteNode = function(node, postCallback, preCallback) {
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
		visiteNode(childNode, postCallback, preCallback);
	}

	if (postCallback) {

		if (typeof (postCallback) == 'function') {
			postCallback(node);
		}
	}
}

var reactize = function(xmlText) {

	var DOMParser = require('xmldom').DOMParser;
	var doc = new DOMParser().parseFromString(xmlText, 'text/xml');
	//console.log(typeof(doc));
	//var firstElement = doc.getElementsByTagName('div')[0]

	//var XMLSerializer = require('xmldom').XMLSerializer;
	//var s = new XMLSerializer();

	// console.info(s.serializeToString(doc));

	visiteNode(doc, reactizeNode);

}
