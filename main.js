
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


