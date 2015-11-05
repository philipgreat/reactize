# Reactize  html to react components



##Input Html 
<section></section>

```html
<html>
<body>
	<div rc="ShoppingCartHeader">test<a a="rer" rc="WelcomeMessage">This is the welcome text<!--sdf comment is still here--></a></div>
	<div rc="ShoppingCartBox"> 
		<div rc="ShoppingCartItems"> 
			<div rc="ShoppingCartItem"> this is the item 1 </div>
			<div rc="ShoppingCartItem"> this is the item 2 </div> 
			<div rc="ShoppingCartItem"> this is the item 3 </div>
		</div>
			
	</div>
	<div rc="ShoppingCartFooter"/>
</body>
</html>

```


##Output React Component

```javascript
var WelcomeMessage = React.createClass({
	render: function() {
		return (<a a="rer">This is the welcome text<!--sdf comment is still here--></a>);
	}
});

var ShoppingCartHeader = React.createClass({
	render: function() {
		return (<div>test<WelcomeMessage/></div>);
	}
});



var ShoppingCartItem = React.createClass({
	render: function() {
		return (<div> this is the item 3 </div>);
	}
});

var ShoppingCartItems = React.createClass({
	render: function() {
		return (<div> 
			
			 
			
		<ShoppingCartItem/><ShoppingCartItem/><ShoppingCartItem/></div>);
	}
});

var ShoppingCartBox = React.createClass({
	render: function() {
		return (<div> 
		
			
	<ShoppingCartItems/></div>);
	}
});

var ShoppingCartFooter = React.createClass({
	render: function() {
		return (<div/>);
	}
});


```


##Please help to add more funcitons
