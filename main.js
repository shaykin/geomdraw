

function primitive() 
{
	this.draw = function()
	{

	},
	/*
	this.outType = function()
	{
		log(this.type);
	},
	*/

	this.type = 'primitive';
}


function grid()
{
	this.getSVG = function()
	{
		return '<defs>' + 
			'<pattern id="smallGrid" width="50" height="50" patternUnits="userSpaceOnUse">' + 
			'<path d="M 50 0 L 0 0 0 50" fill="none" stroke="blue" stroke-width="0.5"/>' +
			'</pattern>' +
			'<pattern id="grid" width="500" height="500" patternUnits="userSpaceOnUse">' +
			'<rect width="500" height="500" fill="url(#smallGrid)"/>' +
			'<path d="M 500 0 L 0 0 0 500" fill="none" stroke="blue" stroke-width="1"/>' +
			'</pattern>' +
			'</defs>' +
			'<rect width="100%" height="100%" fill="url(#grid)" />';
	}
}


function triangle_letterPos(p, p1, p2)
{
	var c = {'x': 15, 'y': -20};
	var t = vec2.sum(c, vec2.mul(35, vec2.norm(vec2.sum(vec2.sub(p1, p), vec2.sub(p2, p)))));
	return vec2.sub(p, t);
}


function triangle_angleSVG(p, p1, p2)
{
	var v1 = vec2.sub(p1, p);
	var n1 = vec2.length(v1);
	var v2 = vec2.sub(p2, p);
	var n2 = vec2.length(v2);

	var n = (n1 > n2 ? n2 : n1) / 5;

	v1 = vec2.norm(v1);
	v2 = vec2.norm(v2);

	var dotpr = vec2.dot(v1, v2);
	var crosspr = vec2.crossZ(v1, v2);

	v1 = vec2.mul(n, v1);
	v2 = vec2.mul(n, v2);
	var v3 = vec2.sum(v1, v2);

	v1 = vec2.sum(v1, p);
	v2 = vec2.sum(v2, p);
	v3 = vec2.sum(v3, p);

	if (crosspr < 0)
	{
		var tmp = vec2.copy(v1);
		v1 = vec2.copy(v2);
		v2 = vec2.copy(tmp);
	}

	if (-0.01 < dotpr && dotpr < 0.01)
		return '<path d="M ' + v1.x + ' ' + v1.y + ' L' + v3.x + ' ' + v3.y + ' L' + v2.x + ' ' + v2.y + '" />';
	else
		return '<path d="M '+ v1.x + ' ' + v1.y +' A ' + n + ' ' + n + ' 0 0 1 ' + v2.x + ' ' + v2.y + '" ' +' />';
}


function triangle_medPoint(p, p1, p2)
{
	var v1 = vec2.sub(p1, p);
	var v2 = vec2.sub(p2, p);
	var v = vec2.sum(v1, v2);
	return vec2.sum(p, vec2.mul(0.5, v));
}


function triangle_bissPoint(p, p1, p2)
{
	var v1 = vec2.sub(p1, p);
	var n1 = vec2.length(v1);
	var v2 = vec2.sub(p2, p);
	var n2 = vec2.length(v2);

	var v3 = vec2.sum(v1, vec2.mul(n1, vec2.norm(v2)));
	var v4 = vec2.sum(v2, vec2.mul(n2, vec2.norm(v1)));
	var v = vec2.sum(v3, v4);

	var u = vec2.sub(p2, p1);
	var k = ((p1.y - p.y) * v.x - (p1.x - p.x) * v.y) / (u.x * v.y - u.y * v.x);

	return vec2.sum(p1, vec2.mul(k, u));
}


function triangle(p)
{
	this.getSVG = function()
	{
		var t0 = triangle_letterPos(this.p[0], this.p[1], this.p[2]);
		var t1 = triangle_letterPos(this.p[1], this.p[0], this.p[2]);
		var t2 = triangle_letterPos(this.p[2], this.p[0], this.p[1]);
		var svg = '';

		svg += '<g stroke="#a0a0a0" stroke-width="3" fill="none">';
		svg += triangle_angleSVG(this.p[0], this.p[1], this.p[2]);
		svg += triangle_angleSVG(this.p[1], this.p[2], this.p[0]);
		svg += triangle_angleSVG(this.p[2], this.p[0], this.p[1]);

		// bissectrises
		var v = triangle_bissPoint(this.p[0], this.p[1], this.p[2]);
		svg += '<path d="M ' + this.p[0].x + ' ' + this.p[0].y + ' L' + v.x + ' ' + v.y + '" />';

		v = triangle_bissPoint(this.p[1], this.p[2], this.p[0]);
		svg += '<path d="M ' + this.p[1].x + ' ' + this.p[1].y + ' L' + v.x + ' ' + v.y + '" />';

		v = triangle_bissPoint(this.p[2], this.p[0], this.p[1]);
		svg += '<path d="M ' + this.p[2].x + ' ' + this.p[2].y + ' L' + v.x + ' ' + v.y + '" />';


		svg += '</g>';

		svg += '<path stroke="#404040" fill="none" stroke-width="5" d="' + 
			'M' + this.p[2].x + ' ' + this.p[2].y + 
			'L' + this.p[0].x + ' ' + this.p[0].y + 
			'L' + this.p[1].x + ' ' + this.p[1].y + ' Z" />';

		svg += '<g fill="#000000" style="font-size: 50px;">' +
			'<circle cx="' + this.p[0].x + '" cy="' + this.p[0].y + '" r="7" />' + 
			'<circle cx="' + this.p[1].x + '" cy="' + this.p[1].y + '" r="7" />' + 
			'<circle cx="' + this.p[2].x + '" cy="' + this.p[2].y + '" r="7" />' +
			'<text x="' + t0.x + '" y="' + t0.y + '">A</text>' + 
			'<text x="' + t1.x + '" y="' + t1.y + '">B</text>' + 
			'<text x="' + t2.x + '" y="' + t2.y + '">C</text>' +
			'</g>';

		return svg;
	}


	this.draw = function()
	{

	},


/*
	this.type = function()
	{
		log('triangle');
	}
	*/
	this.type = 'triangle';

	this.p = [{'x': p[0].x, 'y': p[0].y},
		{'x': p[1].x, 'y': p[1].y},
		{'x': p[2].x, 'y': p[2].y}];
}

triangle.prototype = new primitive();



var tcs = 
{
	init: 1,
	second: 2,
	third: 3,
	end: 4,
}


function triangleCreation()
{
	// override
	this.mouseMove = function(p)
	{
		if (this.state == tcs.init)
		{
			this.p[0].x = p.x;
			this.p[0].y = p.y;
		}
		else if (this.state == tcs.second)
		{
			this.p[1].x = p.x;
			this.p[1].y = p.y;
			//this.calcP3();
		}
		else if (this.state == tcs.third)
		{
			this.p[2].x = p.x;
			this.p[2].y = p.y;
		}
	}

	this.mouseClick = function(p)
	{
		if (this.state == tcs.init)
		{
			this.p[0].x = this.p[1].x = this.p[2].x = p.x;
			this.p[0].y = this.p[1].y = this.p[2].y = p.y;
			this.state = tcs.second;
		}
		else if (this.state == tcs.second)
		{
			this.p[2].x = this.p[1].x = p.x;
			this.p[2].y = this.p[1].y = p.y;
			this.state = tcs.third;
		}
		else if (this.state == tcs.third)
		{
			this.p[2].x = p.x;
			this.p[2].y = p.y;
			this.state = tcs.end;
			return false;
		}

		return true;
	}


	this.draw = function()
	{
		if (this.state == tcs.init)
		{
			//ctx.
		}
		else if (this.state == tcs.second || this.state == tcs.third)
		{
			ctx.beginPath();
			ctx.strokeStyle="red";
			ctx.lineWidth = 3;
			ctx.moveTo(this.p[0].x, this.p[0].y);
			ctx.lineTo(this.p[1].x, this.p[1].y);
			if (this.state == tcs.third)
			{
				ctx.lineTo(this.p[2].x, this.p[2].y);
				ctx.closePath();
			}
			ctx.stroke();
		}
	}


	this.done = function()
	{
		var tri = new triangle(this.p);
		Primitives.add(tri);
		log('done');
	}


	// private
	this.calcP3 = function()
	{
		if (this.p[0].y > this.p[1].y)
		{
			this.p[2].x = this.p[1].x;
			this.p[2].y = this.p[0].y;
		}
		else
		{
			this.p[2].x = this.p[0].x;
			this.p[2].y = this.p[1].y;
		}
	}

	this.state = tcs.init;
	this.p = [{'x': 0, 'y': 0},
		{'x': 0, 'y': 0},
		{'x': 0, 'y': 0}];
}




var Primitives =
{
	add: function(pr)
	{
		Primitives.primitives.push(pr);
		Primitives.generateSVG();
	},


	generateSVG: function()
	{
		log('Generate SVG:');

		var svgstr = '';
		for (var i = 0; i < Primitives.primitives.length; i++)
		{
			var pr = Primitives.primitives[i];
			svgstr += pr.getSVG();
		}

		var svg = document.getElementById("svg");
		svg.innerHTML = svgstr;

		log('Done!');
	},


	outType: function(primitive)
	{
		log(primitive.type)
	},

	primitives: [],
}


var Editor = 
{
	setCreation: function(creation)
	{
		Editor.creation = creation;
	},


	mouseClick: function(p)
	{
		if (Editor.creation != null)
		{
			var ret = Editor.creation.mouseClick(p);
			Editor.redraw();
			if (ret == false)
			{
				Editor.creation.done();
				Editor.setCreation(null);
			}
		}
	},


	mouseMove: function(p)
	{
		if (Editor.creation != null)
		{
			Editor.creation.mouseMove(p);
			Editor.redraw();
		}
	},


	redraw: function()
	{
		if (Editor.creation != null)
		{
			ctx.clearRect(0, 0, contextWidth, contextHeight);
			Editor.creation.draw();
		}
	},


	creation: null,
}


function mainToClient(e)
{
	var p = {};
	var main = document.getElementById("main");
	p.x  = e.clientX - main.offsetLeft;
	p.y  = e.clientY - main.offsetTop;

 	p.x = Math.floor(p.x / main.offsetWidth * contextWidth);
	p.y = Math.floor(p.y / main.offsetHeight * contextHeight);

	return p;
}


function onMouseMove(e)
{
	Editor.mouseMove(mainToClient(e));
}


function onClick(e)
{
	Editor.mouseClick(mainToClient(e));
}



function main()
{
	var main = document.getElementById("main");
	main.addEventListener("click", onClick);
	main.addEventListener("mousemove", onMouseMove);

	var canvas = document.getElementById("canvas");

	var svg = document.getElementById("svg");
	svg.setAttribute('viewBox', '0 0 ' + canvas.offsetWidth * 2 + ' ' + canvas.offsetHeight * 2);
	log('0 0 ' + canvas.offsetWidth * 2 + ' ' + canvas.offsetHeight * 2);

	//svg.setAttribute('width', canvas.offsetWidth * 2);
	//svg.setAttribute('height', canvas.offsetHeight * 2);


	engine_initContext2d(canvas.offsetWidth * 2, canvas.offsetHeight * 2);

	var gr = new grid();
	Primitives.add(gr);

	Editor.setCreation(new triangleCreation());
}


