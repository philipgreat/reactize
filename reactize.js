// console.log("node1: "+node.nodeType +" -->\n\t:"+node);
// create a component named <componentName> and put the text into
// renders;
/*
 * var ExampleApplication = React.createClass({ render: function() {
 * 
 * return <p>{message}</p>; } });
 */

var fs = require('fs');


var reactizeFile = function(filePath){

	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		reactize(data);

	});
}







var reactizeNode = function(node) {

	// console.log("node: "+node.nodeType+": "+node);
	
	
	if (node.nodeType != 1) {
		return;
	}
	// this is an element node
	replaceToClassName(node);

	var reactComponentName = replaceToReactNode(node);
	if (!reactComponentName) {
		return;
	}
	return reactComponentName;
}

var replaceToClassName = function(node) {
	var className = node.getAttribute("class");
	if (className) {
		node.removeAttribute("class");
		node.setAttribute("className", className);
		// return;
	}
}

var replaceToReactNode = function(node) {

	var componentName = node.getAttribute("rc");
	if (!componentName) {
		return;
	}
	node.removeAttribute("rc");
	node.parentNode.removeChild(node);// removeChild
	var rootDoc = getRootDocument(node);
	var childComponent = rootDoc.createElement(componentName);
	node.parentNode.appendChild(childComponent);
	return componentName;

}
/*'use strict';

var React = require('react');*/


var exportComponent = function(componentName, node) {

	var componentCode = "'use strict'\n"
			+"var React = require('react');\n"
			+"var " + componentName + " = React.createClass({\n"
			+ "\trender: function() {\n" + "\t\treturn (" + node + ");\n"
			+ "\t}\n" + "});\n"
	console.log(componentCode);

}



var exportComponentToFile = function(componentName, node) {

	var componentCode = "import React, { Component } from 'react';\n"
			+"export default class " + componentName + " extends Component {\n"
			+"\tconstructor(props) {\n"
			+"\t\tsuper(props);\n"
			+"\t\tthis.state=props;\n"
			+"\t\tthis.handleX =  this.handleX.bind(this)\n"
			+"\t\tthis.handleY =  this.handleY.bind(this)\n"
			+"\t\tthis.handleZ =  this.handleZ.bind(this)\n"
			+ "\t}\n"
			+ "\trender() {\n" + "\t\treturn (" + node + ");\n"
			+ "\t}\n" 
			+ "\thandleX() {\n\n\t}\n" 
			+ "\thandleY() {\n\n\t}\n" 
			+ "\thandleZ() {\n\n\t}\n" 
			
			+ "}\n";
			

	
	var fileName = componentName + ".React.js";
	fs.writeFile(fileName, componentCode, function(err) {
		if (err){
			throw err;			
		}
		console.log("------------------------"+fileName+"------------------------------");
		console.log(componentCode);
		//console.log("========================"+fileName+"================================");
	});
}

var exportComponentToFile1 = function(componentName, node) {

	var componentCode = "'use strict'\n"
			+"var React = require('react');\n"
			+"var " + componentName + " = React.createClass({\n"
			
			+ "\trender: function() {\n" + "\t\treturn (" + node + ");\n"
			+ "\t}\n" 
			+ "\thandleX: function() {\n\n\t}\n" 
			+ "\thandleY: function() {\n\n\t}\n" 
			+ "\thandleZ: function() {\n\n\t}\n" 
			
			
			
			
			
			+ "});\n"
			
		
			
			
			
			+"module.exports = "+componentName+";"
	
	var fileName = componentName + ".React.js";
	fs.writeFile(fileName, componentCode, function(err) {
		if (err){
			throw err;			
		}
		console.log("------------------------"+fileName+"------------------------------");
		console.log(componentCode);
		console.log("========================"+fileName+"================================");
	});
}

var getRootDocument = function(node) {
	var parentNode = node.parentNode;

	if (!parentNode) {
		return node;
	}
	while (true) {

		if (!parentNode.parentNode) {
			return parentNode;
		}
		var parentNode = parentNode.parentNode;
	}

}

var visitNode = function(node, postCallback, preCallback) {
	var stack=new Array();
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
		visitNode(childNode, postCallback, preCallback);
	}

	if (postCallback) {

		if (typeof (postCallback) == 'function') {
			var reactComponentName=postCallback(node);

			if(reactComponentName){
				
				
				exportComponentToFile(reactComponentName,node);
				//stack.pop();
			}
		}
	}
}

var reactize = function(xmlText) {

	var DOMParser = require('xmldom').DOMParser;
	var doc = new DOMParser().parseFromString(xmlText, 'text/xml');
	// console.log(typeof(doc));
	// var firstElement = doc.getElementsByTagName('div')[0]

	// var XMLSerializer = require('xmldom').XMLSerializer;
	// var s = new XMLSerializer();

	// console.info(s.serializeToString(doc));

	visitNode(doc, reactizeNode);

}


process.argv.forEach(function (val, index, array) {

	if(index<2){
		return;
	}
	console.log('process file: ' + val);

	reactizeFile(val);
});


