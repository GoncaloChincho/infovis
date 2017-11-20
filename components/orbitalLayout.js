const getBaseLog = (x, y) => {
	  return Math.log(y) / Math.log(x);
}
const getR = (diameter) => {
	if(diameter < 50) return 1.5;
	if(diameter < 150) return 2.4;
	if(diameter < 250) return 3.3;
	if(diameter < 350) return 4.2;
	if(diameter < 450) return 5.1;
	if(diameter < 550) return 6;
	else return 10;
}
	
var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id((d) => d.objectId).distance((d) => getBaseLog(1.0001, d.distance + 10) / 165 - 130))
	.force("collide", d3.forceCollide().radius((d) => getR(d.diameter)))
	.force("charge", d3.forceManyBody().strength(-5))
	.alphaDecay(0.05);
	// .force("center", d3.forceCenter());
	// .force("r", d3.forceRadial().strength(0.01));
	
const initOrbitalLayout = () => {
	const links = DATA.map(o => { return {source: 'Earth', target: o.objectId, distance: o.distance}});
	const nodes = [{objectId: 'Earth', fx: 0, fy: 0}, ...DATA];
	var node = svg.append("g")
		.attr('transform', 'translate(250, 250)')
		.attr("class", "nodes")
		.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
			.attr("r", (d) => getR(d.diameter))
			.attr("fill", (d) => "red")

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
