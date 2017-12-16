const initScatterPlot = (data) => {

	const height = 0.5 * window.innerHeight;
    const width = 0.3 * window.innerWidth;

    var node = d3.select("#svgScatter").append("g")
        .attr("transform", "translate(25,-25)")
    
		 .attr('height', height)
         .attr('width', width);
         
    var y = d3.scaleLinear().range([height, 30]);
    var x = d3.scaleLinear().range([0, width-30]);

    x.domain([0, d3.max(data, function(d) { return d.velocity; })]);
    y.domain([0, d3.min(data, function(d) { return d.hazardScale; })]);
    
    node.selectAll("dot")
        .data(data)
        .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.velocity); })
            .attr("cy", function(d) { return y(d.hazardScale); });

    node.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    node.append("g")
        .attr("transform", "translate(0,0)")    
        .call(d3.axisLeft(y).tickSizeOuter(0));
}

d3.json("content/data/example.json", function(error, data) {
	if (error) throw error;

	initScatterPlot(data);
});