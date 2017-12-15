var dataset;

d3.json("content/data/occurences.json", function (data){
	dataset=data;
	gen_vis();
})

function gen_vis(){
	
	var window_height = window.innerHeight;
    var window_width = window.innerWidth;
    h = 0.35 * window_height;
    w = 0.7 * window_width;
	var bar_w =	Math.floor(w/60)-1;	
	
	var	yscale = d3.scaleLog()
						.domain([0.5,100])	
						.range([0,h-50]);	
	
	var	xscale = d3.scaleLinear()	
						.domain([0,61])	
						.range([0,w]);	
	
	var yaxis = d3.axisRight()
				.scale(yscale)
				.tickFormat(function(d) {return yscale.tickFormat(4,d3.format(",d"))(d)})

	var x0 = dataset[0].Year;
	var xn = dataset[60].Year;
	
	var xaxis =	d3.axisBottom()
						.scale(d3.scaleLinear()	
							.domain([x0,xn])	
							.range([bar_w/2,w-bar_w/2]))	
						.tickFormat(function(d){if(d!==x0 && d!==xn){return d}})	
						.ticks(60/10);
	
	var xaxis2 = d3.axisTop()	
						.scale(d3.scaleLinear()	
							.domain([dataset[0].Year,dataset[60].Year])	
							.range([bar_w/2,w-bar_w/2]))	
						.tickFormat("")	
						.ticks(60/10);
	
	var svg = d3.select("#svgBars")
				.append("g")
				.attr("width", w)
				.attr("height", h);
				
	svg.selectAll("rect")	
		.data(dataset)
		.enter().append("rect")	
			.attr("width", bar_w)	
			.attr("height", function(d)	{return	yscale(d.Occurences);})	
			.attr("fill","purple")
			.attr("x",function(d,i){return xscale(i);})
			.attr("y",30)
			.append("title")
				.text(function(d){return d.Year});				
					
	svg.append("g")
		.attr("transform", "translate(0,30)")
		.call(yaxis);
		
	svg.append("g")
			.call(xaxis);
			
	svg.append("g")	
			.attr("transform","translate(0,30)")
			.call(xaxis2);
}
