const initScatterPlot = (data) => {

    const selectButton = (id) => {
        const node = d3.select("#svgScatter");
        node.selectAll(".button").classed("selected", false);
        node.select(`#${id}`).classed("selected", true);
    }



	const height = 0.5 * window.innerHeight;
    const width = 0.3 * window.innerWidth;

    var node = d3.select("#svgScatter").append("g")
        .attr("transform", "translate(45,-45)")
    
		 .attr('height', height)
         .attr('width', width);
         
    var y = d3.scaleLinear().range([height, 50]);
    var x = d3.scaleLinear()
    x.range([0, width-50]);

    x.domain([0, d3.max(data, function(d) { return d.velocity; })]);
    y.domain([0, d3.min(data, function(d) { return d.hazardScale; })]);
    
    var dots = node.selectAll("dot")
        .data(data)
        .enter().append("circle")
            .attr("class", "asteroid")        
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.velocity); })
            .attr("cy", function(d) { return y(d.hazardScale); });

    var xAxisCall = d3.axisBottom(x);

    var xAxis = node.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall.tickSizeOuter(0));

    node.append("g")
        .attr("class", "y axis")    
        .attr("transform", "translate(0,0)")    
        .call(d3.axisLeft(y).tickSizeOuter(0));



    node.append("text")
        .attr("transform", "rotate(-90)")
        // .attr("class", "axisText")
        .attr("y", -40)
        .attr("x",0 - ((height + 40) / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "#AAA")
        .text("Hazard scale");


    const buttonsInfo = [
        {id: 'velocity', text: 'Velocity', start: 0, width: 60},
        {id: 'distance', text: 'Distance', start: 70, width: 65},
        {id: 'diameter', text: 'Diameter', start: 145, width: 70},
        {id: 'impactDamage', text: 'Impact probability', start: 225, width: 125},
    ]

    var buttonsEl = node.selectAll("g button").data(buttonsInfo);

    var button = buttonsEl.enter().append('g')
        .attr("class", "button")
        .attr("id",(d) =>  d.id)
        .attr("transform", (d) => `translate(${d.start-15}, ${height + 20})`)
        .on('click', function(d){
                selectButton(d.id);

                x.domain([0, d3.max(data, function(e) { return e[d.id]; })]);
                xAxisCall.scale(x);
                xAxis.transition().call(xAxisCall).duration(250);

                dots.transition().attr("cx", function(e) { return x(e[d.id]); }).duration(200);
                
        });

    button.append("rect")
    // .attr("transform", (d) => `translate(${d.start}, ${height + 20})`)    
    .attr('width', (d) => d.width)
    .attr('height', 20)
    .attr('rx', 3)
    .attr('ry', 3);
    // .attr('fill', 'red');

    button.append("text")
        .attr('y', 15)
        .attr('x', 3)
        .attr('fill', 'black')
        .text((d) => d.text);

    selectButton('velocity');
}

d3.json("content/data/example.json", function(error, data) {
	if (error) throw error;

	initScatterPlot(data);
});