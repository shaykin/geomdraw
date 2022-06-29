
var ctx = null; // canvas context
var contextWidth = 1;
var contextHeight = 1;

function engine_initContext2d(width, height) {
	log("Init Engine...");
	var canvas = document.getElementById("canvas");

	ctx = canvas.getContext("2d");
	contextWidth = width;
	contextHeight = height;
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
}

var Console =  {
	log: function(message) {
		var el = Console.getElement();
		if (el) {
			el.innerHTML += '<br />' + message;
			el.scrollTop = el.scrollHeight;
		}
	},

	logError: function(message) {
		Console.show(true);
		Console.log('<span style="color: #ff0000;"><b>' + message + '</b></span>');
	},

	show: function (isShow) {
		var el = Console.getElement();
		el.style.display = isShow ? 'block' : 'none';
	},

	getElement: function() {
		var el = document.getElementById('console');
		if (!el) {
			el = document.createElement('div');
			el.setAttribute('id', 'console');
			el.style.cssText = 'position: absolute; bottom: 0; left: 0; height: 120px; width: 480px;' +
				'background-color: #d0d0e0; border: 1px solid #ff0000; padding: 2px; opacity: .70;' + 
				'text-align: left; font-size: small; font-family: Terminal, Courier; overflow: auto;';
			el.addEventListener('dblclick', Console.onDblClick, false);
			bodies = document.getElementsByTagName('body');
			bodies[0].appendChild(el);		
		}
		return el;
	},

	onDblClick: function() {
		Console.show(false);
	}
}

log = Console.log;
logError = Console.logError;



var Images =  {
	// public
	find: function(name) {
		return Images.images[name];
	},

	add: function(name, src) {
		Images.loadList.push({'name': name, 'src': src});
	},

	loadAll: function(nextCallback) {
		var loadList = Images.loadList.slice();
		for(var i = 0; i<loadList.length; i++) {
			var image = new Image();
			image.onload = Images.imageLoaded;
			image.addEventListener('error', Images.loadError, false);
			image.name = loadList[i].name;
			image.data_src = loadList[i].src;
			Images.images[loadList[i].name] = image;
			image.src = loadList[i].src;
		}
		Images.postCallback = nextCallback;
	},

	// private
	imageLoaded: function(e) {
		var image = e.target;
		log('Loaded image: ' + image.data_src);
		Images.checkRunCallback(image);
	},

	loadError: function(e) {
		var image = e.target;
		logError('Can\'t load image: ' + image.data_src);
		Images.checkRunCallback(image);
	},

	checkRunCallback: function(image) {
		for(var i = 0; i<Images.loadList.length; i++) {
			if(Images.loadList[i].name == image.name) {
				Images.loadList.splice(i, 1);
				break;
			}
		}

		if (Images.loadList.length == 0 && Images.postCallback) {
			var callback = Images.postCallback;
			Images.postCallback = null;
			callback();
		}
	},

	images: [],
	loadList: [],
	postCallback: null,
}



function button(x, y, image, imagePressed, callback) {
	this.x = x;
	this.y = y;
	this.image = image;
	this.imagePressed = imagePressed;
	this.w = image.width;
	this.h = image.height;
	this.callback = callback;
	this.isVisible = false;
}


var Buttons =  {
	add: function(x, y, image, imagePressed, callback) {
		var but = new button(x, y, image, imagePressed, callback);
		Buttons.buttons.push(but);
		return but;
	},


	show: function(but) {
		ctx.drawImage(but.image, but.x, but.y);
		but.isVisible = true;
	},


	hideAll: function() {
		for (var i = 0; i < Buttons.buttons.length; i++) {
			var but = Buttons.buttons[i];
			if (but.isVisible == true)
				but.isVisible = false;
		}
	},


	press: function(x, y) {
		var but = Buttons.find(x, y);
		if (but == null)
			return false;
		ctx.drawImage(but.imagePressed, but.x, but.y);
		return true;
	},


	click: function(x, y) {
		var but = Buttons.find(x, y);
		if (but == null)
			return false;
		ctx.drawImage(but.image, but.x, but.y);
		setTimeout(but.callback, 100); // for update board
		return true;
	},


	find: function(x, y) {
		for (var i = 0; i < Buttons.buttons.length; i++) {
			var but = Buttons.buttons[i];
			if (but.isVisible == true && but.x <= x && x <= but.x + but.w && but.y <= y && y <= but.y + but.h)
				return but;
		}
		return null;
	},


	buttons: [],
}
