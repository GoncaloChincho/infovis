var dataset;

d3.json("content/data/occurences.json", function (data){
	dataset=data;
	gen_vis();
})

function gen_vis(){
	var w = 680;
	var h = 230;
	
	yscale = d3.scaleLog()
				.domain([0.5, h])
				.range([0, h]);
		
	var svg = d3.select("#svgBars")
				.append("g")
				.attr("width", w)
				.attr("height", h);
	console.log(dataset);

	svg.selectAll("rect")	
		.data(dataset)
		.enter().append("rect")	
			.attr("width", (w/269))	
			.attr("height", function(d)	{return	yscale(d.Occurences*2);})	
			.attr("fill","purple")
			.attr("x",function(d,i)	{return	i*3.5;})
			.select("title")
				.text(function(d){return d.Year});
	
}
