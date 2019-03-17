var population = [
	{
		country:"America",
		count:300
	},
	{
		country:"China",
		count:1600
	},
	{
		country:"India",
		count:1300
	},
	{
		country:"Britain",
		count:200
	},

]


$( document ).ready(function() {

	var margin = {top: 20, right: 20, bottom: 70, left: 40},
		width = 800,
		height = 800 ;
	var barPadding = 10;
	var barWidth = (height-200)/population.length;
	var x = d3.scaleLinear()
			.domain([0,d3.max(population,
				function(d){return d.count;})])
			.rangeRound([0, width]);
	var	y = d3.scaleBand().domain(['America','China','India','Britain']).rangeRound([height, 0]).padding(0.1);



	var svg = d3.select("#bar-chart")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

	var g =svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	g.append("g").attr("class","axis x-axis").call(d3.axisLeft(y));
	g.append("g").attr("class","axis y-axis").call(d3.axisTop(x));
	

	g.selectAll("rect")
	.data(population)
	.enter()
	.append("rect")
	.attr("class","bar")
	.attr("x",function(d){
		return 0;
	})
	.attr("y",function(d){
		return y(d.country);
	})
	.attr("width",function(d){
		return x(d.count);
	})
	.attr("height", barWidth);
});