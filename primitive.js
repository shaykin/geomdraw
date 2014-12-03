
// primitive objects (base object for primitives)
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


// grid object
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


// Primitives manager
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

