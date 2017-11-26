
var getC = (impactDamage) => {
        if(impactDamage === 0) return "green";
        if(impactDamage === 1) return "yellow";
        if(impactDamage === 2) return "orange";
        if(impactDamage === 3) return "red";
        else return "blue";
    }

var initOrbitalLayout = () => {
    var getBaseLog = (x, y) => {
	  return Math.log(y) / Math.log(x);
    }
    var getR = (diameter) => {
        if(diameter < 50) return 3;
        if(diameter < 150) return 6;
        if(diameter < 250) return 9;
        if(diameter < 350) return 10;
        if(diameter < 450) return 11;
        if(diameter < 550) return 12;
        else return 15;
    }

    var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id((d) => d.objectId).distance((d) => getBaseLog(1.0001, d.distance + 10) / 165 - 130))
	.force("collide", d3.forceCollide().radius((d) => getR(d.diameter)))
	.force("charge", d3.forceManyBody().strength(-30))
	.alphaDecay(0.05);
    
	// .force("center", d3.forceCenter());
	// .force("r", d3.forceRadial().strength(0.01));
	var links = DATA.map(o => { return {source: 'Earth', target: o.objectId, distance: o.distance}});
	var nodes = [{objectId: 'Earth', fx: 0, fy: 0}, ...DATA];
	var node = svg.append("g")
		.attr('transform', 'translate(250, 250)')
		.attr("class", "nodes")
		.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
			.attr("r", (d) => getR(d.diameter))
			.attr("fill", (d) => getC(d.impactDamage))

	node.on(
		'click', (d) => compareNodeRadarChart(d)
	);

	node.on(
		'dblclick', (d) => compareWithAverageRadarChart(d)
	);

	node.append("title")
		.text(function(d) { return d.name; });

	simulation
		.nodes(nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(links);

	function ticked() {	
		node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		}
};	
