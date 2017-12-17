var fulldataset;
var dataset;
var x0=0;
var xn=61;
var dispatch = d3.dispatch("yearEnter");
var olderSelectBar;
var newerSelectBar;

d3.json("content/data/alloccurences.json", function (data){
	full_dataset = data;
	dataset=full_dataset.slice(x0,xn);
	gen_vis();
})

dispatch.on("yearEnter", function(d){
	olderSelectBar=newerSelectBar;
	if(olderSelectBar!=null){
		olderSelectBar.attr("fill", "#9966a1");
	}
	newerSelectBar=d3.select("rect[title=\'"+d.Year+"\']");
	newerSelectBar.attr("fill", "#4a3d8d");
	
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
					.attr("fill","#9966a1")
					.attr("x",function(d,i){return xscale(i);})
					.attr("y",30)
					.attr("title",function(d){return d.Year})
					.on("mouseover", function(d){dispatch.call("yearEnter", d,d);})
					.append("title")
						.text(function(d){
								if(d.Occurences>1){
									return d.Year+"\n"+d.Occurences+" NEOs";}
								return d.Year+"\n"+d.Occurences+" NEO";});
				
	svg.append("g")
		.attr("transform", "translate(0,30)")
		.attr("class", "y axis")
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
		.attr("fill", "#363333");
	
	var left = svg.append("text")
					  .text("<")
					  .attr("dx",5)
					  .attr("dy", 25)
					  .attr("font-size", "30px")
					  .attr("font-weight", "bold")
					  .attr("fill", "#AAA")
                      .attr('id','left');
									
	svg.append("circle")
		.attr("cx", w-15)
		.attr("cy", 15)
		.attr("r", 15)
		.attr("fill", "#363333");
	
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
							on_click();
                            
						}});
	
	right.on("click", function(){
						if(xn!=291){
							x0 += 10;
							xn += 10;
							on_click(false);
						}});
	
	function on_click(left = true){
        var goLeft = -1;
        if(left) goLeft = 1
		dataset=full_dataset.slice(x0, xn);
		//console.log(getRows());			
		svg.selectAll("rect")	
			.data(dataset)
				.transition()
				.duration(1000)
				.attr("height", function(d)	{
									if(d.Occurences==0)
										{return 0;}
									return yscale(d.Occurences);})	
				.attr("title",function(d){return d.Year})
				.select("title")
						.text(function(d){
								if(d.Occurences>1){
									return d.Year+"\n"+d.Occurences+" NEOs";}
								return d.Year+"\n"+d.Occurences+" NEO";});
								
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
        
        d3.selectAll(".asteroid")
            .transition()
            .duration(1000)
            .attr('cx', function(d){
                  
                  return d.circleEl.cx.baseVal.value + goLeft *  (166.8);
                  });
        d3.selectAll("path")
            .attr("d", function(d) {
                console.log(d);
                var newD = d;
                if(newD){
                   var l = newD.length;
                    for(var i = 0;i < l; i++){
                        newD[i][1] +=  -50;
                    } 
                }
               //console.log(newD);
                
                return newD ? "M" + newD.join("L") + "Z" : null;
            });
	}	
}

