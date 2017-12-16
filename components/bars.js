var fulldataset;
var dataset;
var x0=0;
var xn=61;

d3.json("content/data/alloccurences.json", function (data){
	full_dataset = data;
	dataset=full_dataset.slice(x0,xn);
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

	
	var xaxis =	d3.axisBottom()
						.scale(d3.scaleLinear()	
							.domain([dataset[0].Year,dataset[60].Year])	
							.range([bar_w/2,w-bar_w/2]))	
						.tickFormat(function(d){return d})	
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
				.text(function(d){return d.Occurences});
				
	svg.append("g")
		.attr("transform", "translate(0,30)")
		.call(yaxis);
		
	svg.append("g")
			.attr("class", "x axis")
			.call(xaxis);
			
	svg.append("g")	
			.attr("transform","translate(0,30)")
			.attr("class", "x2 axis")
			.call(xaxis2);
			
	svg.append("circle")
					.attr("cx", 15)
					.attr("cy", 15)
                    .attr("r", 15)
					.attr("fill", "white"); //#363333
	
	var left = svg.append("text")
      .text("<")
	  .attr("dx",5)
	  .attr("dy", 25)
      .attr("font-size", "30px")
	  .attr("font-weight", "bold")
      .attr("fill", "#AAA");
					
	svg.append("circle")
					.attr("cx", w-15)
					.attr("cy", 15)
                    .attr("r", 15)
					.attr("fill", "white");
	
	var right = svg.append("text")
      .text(">")
	  .attr("dx",w-20)
	  .attr("dy", 25)
      .attr("font-size", "30px")
	  .attr("font-weight", "bold")
      .attr("fill", "#AAA");
					
	left.on("click", function(){
		if(x0!=0){
			x0 -= 10;
			xn -= 10;
			dataset=full_dataset.slice(x0, xn);
					
			svg.selectAll("rect")	
				.data(dataset)
					.transition()
					.duration(1000)
					.attr("width", bar_w)	
					.attr("height", function(d)	{if(d.Occurences==0){return 0;}return	yscale(d.Occurences);})	
					.attr("fill","purple")
					.attr("x",function(d,i){return xscale(i);})
					.attr("y",30)
					.select("title")
						.text(function(d){return d.Occurences});
						
			xaxis.scale(d3.scaleLinear()	
							.domain([dataset[0].Year,dataset[60].Year])	
							.range([bar_w/2,w-bar_w/2]));
xaxis2.scale(d3.scaleLinear()	
							.domain([dataset[0].Year,dataset[60].Year])	
							.range([bar_w/2,w-bar_w/2]));							
			d3.select(".x.axis")
				.transition()
				.duration(1000)			
				.call(xaxis);
			d3.select(".x2.axis")
				.transition()
				.duration(1000)			
				.call(xaxis2);
		}
	}
	);
		
	right.on("click", function(){
		if(xn!=291){
			x0 += 10;
			xn += 10;
			dataset=full_dataset.slice(x0, xn);
			
			svg.selectAll("rect")	
					.data(dataset)
					.transition()
					.duration(1000)
					.attr("width", bar_w)	
					.attr("height", function(d)	{if(d.Occurences==0){return 0;}return	yscale(d.Occurences);})	
					.attr("fill","purple")
					.attr("x",function(d,i){return xscale(i);})
					.attr("y",30)
					.select("title")
						.text(function(d){return d.Occurences});
			
			xaxis.scale(d3.scaleLinear()	
							.domain([dataset[0].Year,dataset[60].Year])	
							.range([bar_w/2,w-bar_w/2]));	
			xaxis2.scale(d3.scaleLinear()	
							.domain([dataset[0].Year,dataset[60].Year])	
							.range([bar_w/2,w-bar_w/2]));
			d3.select(".x.axis")
				.transition()
				.duration(1000)
				.call(xaxis);
			d3.select(".x2.axis")
				.transition()
				.duration(1000)			
				.call(xaxis2);
		}
	}
	);
	
	
	
}
