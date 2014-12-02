
var vec2 = 
{
	sum: function(v, u)
	{
		return {'x': v.x + u.x, 'y': v.y + u.y};
	},

	sub: function(v, u)
	{
		return {'x': v.x - u.x, 'y': v.y - u.y};
	},

	inv: function(v)
	{
		return {'x': - v.x, 'y': - v.y};
	},

	add: function(scale, v)
	{
		return {'x': v.x + scale, 'y': v.y + scale};
	},

	mul: function(scale, v)
	{
		return {'x': scale * v.x, 'y': scale * v.y};
	},

	length: function(v)
	{
		return Math.sqrt(v.x * v.x + v.y * v.y);
	},

	norm: function(v)
	{
		var n = 1 / vec2.length(v);
		return vec2.mul(n, v);
	},

	dot: function(v, u)
	{
		return v.x * u.x + v.y * u.y;
	},

	crossZ: function(v, u)
	{
		return v.x * u.y - v.y * u.x;
	},

	copy: function(v)
	{
		return {'x': v.x, 'y': v.y};
	},

}
