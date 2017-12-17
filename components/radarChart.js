const ARM_LENGTH = 120;
const START_OFFSET = 30;

let OLDER_POLYGON;
let NEWER_POLYGON;

let POINTS;
let COLOR;

let OLDER_NEO_NAME;
let NEWER_NEO_NAME;
let NEO_NAME;

let AVERAGE_NEO;

const DISTANCE_MAX = 77.82;
const DISTANCE_MIN = 0.04;
const DIAMETER_MAX = 495;
const DIAMETER_MIN = 1.65;
const VELOCITY_MAX = 38.6;
const VELOCITY_MIN = 1;
const IMPACT_PROBABILITY_MAX = 0.96;
const IMPACT_PROBABILITY_MIN = 1.2e-9;
const HAZARD_SCALE_MAX = -1.4;
const HAZARD_SCALE_MIN = -11.4;

const getC = (impactDamage) => {
	if(impactDamage === 0) return "green";
	if(impactDamage === 1) return "yellow";
	if(impactDamage === 2) return "orange";
	if(impactDamage === 3) return "red";
	else return "blue";
}

const initLine = (node) => node.append("line")
	.attr('x1', 0)
	.attr('y1', 0)
	.attr('stroke', 'black')
	.attr('stroke-width', 'black');	
const toRadians = (angle) => angle * (Math.PI / 180);
const downXDist = (armLength) => armLength * Math.sin(toRadians(36));
const downYDist = (armLength) => Math.sqrt(Math.pow(armLength, 2) - Math.pow(downXDist(armLength), 2))
const sideYDist = (armLength) => armLength * Math.sin(toRadians(18));
const sideXDist = (armLength) => Math.sqrt(Math.pow(armLength, 2) - Math.pow(sideYDist(armLength), 2))
const getScalePosition = (max, min, value) => {
	return (Math.abs(value) * ((ARM_LENGTH - START_OFFSET)/(max - min)) + START_OFFSET);
};

const initRadarChart = () => {

	const height = 0.5 * window.innerHeight + 20;
	const width = 0.3 * window.innerWidth - 20;


	var node = d3.select("#svgRadar").append("g")
		 .attr('transform', `translate(${(width/2)}, ${height/2})`)

	node.append("circle")
	.attr('r', 3)
	.attr('cx', 0)
	.attr('cy', 0)
	.attr('fill', 'black');
	
	initLine(node)
	.attr('x2', 0)
	.attr('y2', -ARM_LENGTH);

    node.append("text")
	.attr('x', -27)
	.attr('y', -ARM_LENGTH-10)
	.text("Distance");

	initLine(node)
	.attr('x2', downXDist(ARM_LENGTH))
	.attr('y2', downYDist(ARM_LENGTH));
	
	node.append("text")
	.attr('x', downXDist(ARM_LENGTH)-25)
	.attr('y', downYDist(ARM_LENGTH)+20)
	.text("Diameter");

	initLine(node)
	.attr('x2', -downXDist(ARM_LENGTH))
	.attr('y2', downYDist(ARM_LENGTH));
	
	node.append("text")
	.attr('x', -downXDist(ARM_LENGTH)-25)
	.attr('y', downYDist(ARM_LENGTH)+20)
	.text("Velocity");

	initLine(node)
	.attr('x2', sideXDist(ARM_LENGTH))
	.attr('y2', -sideYDist(ARM_LENGTH));
	
	node.append("text")
	.attr('x', sideXDist(ARM_LENGTH)+20)
	.attr('y', -sideYDist(ARM_LENGTH)-5)
	.text("Impact");

	node.append("text")
	.attr('x', sideXDist(ARM_LENGTH)+10)
	.attr('y', -sideYDist(ARM_LENGTH)+10)
	.text("Probability");
	
	initLine(node)
	.attr('x2', -sideXDist(ARM_LENGTH))
	.attr('y2', -sideYDist(ARM_LENGTH));
	
	node.append("text")
	.attr('x', -sideXDist(ARM_LENGTH)-55)
	.attr('y', -sideYDist(ARM_LENGTH)-5)
	.text("Hazard");
	
	node.append("text")
	.attr('x', -sideXDist(ARM_LENGTH)-50)
	.attr('y', -sideYDist(ARM_LENGTH)+10)
	.text("Scale");

	OLDER_POLYGON = node.append("polygon")
		.attr('id', 'radarChartPolygon1')
		.attr('fill', 'lime')
		.attr('stroke', 'grey')
		.attr('fill-opacity', 0.3)
		.attr('stroke-width', 1);
		
	NEWER_POLYGON = node.append("polygon")
		.attr('id', 'radarChartPolygon2')
		.attr('fill', 'orange')
		.attr('stroke', 'black')
		.attr('fill-opacity', 0.3)
		.attr('stroke-width', 1);
		
	OLDER_NEO_NAME = node.append("text")
		.attr('x',150)
		.attr('y', 180)
		.attr('fill', 'grey');
		
	NEWER_NEO_NAME = node.append("text")
		.attr('x',150)
		.attr('y', 200)
		.attr('fill', 'black');
	
		compareNodeRadarChart(AVERAGE_NEO);
}

const compareNodeRadarChart = (node) => {
	const firstVal = getScalePosition(DISTANCE_MAX, DISTANCE_MIN, node.ld);
	const first = `${0}, ${-firstVal}`;
	const secondVal = getScalePosition(DIAMETER_MAX, DIAMETER_MIN, node.diam);	
	const second = `${downXDist(secondVal)}, ${downYDist(secondVal)}`;
	const thirdVal = getScalePosition(VELOCITY_MAX, VELOCITY_MIN, node.velocity);	
	const third = `${-downXDist(thirdVal)}, ${downYDist(thirdVal)}`;
	const fourthVal = getScalePosition(IMPACT_PROBABILITY_MAX, IMPACT_PROBABILITY_MIN, node.impactProb);	
	const fourth = `${sideXDist(fourthVal)}, ${-sideYDist(fourthVal)}`;
	const fifthVal = getScalePosition(HAZARD_SCALE_MAX, HAZARD_SCALE_MIN, node.hazard);	
	const fifth = `${-sideXDist(fifthVal)}, ${-sideYDist(fifthVal)}`;

	NEWER_POLYGON.transition()
		.duration(300)
		.attr('points', `${first} ${fourth} ${second} ${third} ${fifth}`)
		.attr("fill", getC(node.iDamage));
	
	OLDER_POLYGON.transition()
		.duration(300)
		.attr('points', POINTS)
		.attr("fill", COLOR);
	POINTS = `${first} ${fourth} ${second} ${third} ${fifth}`;
	COLOR = getC(node.iDamage);
	
	NEWER_NEO_NAME.transition()
		.text(node.name);

	OLDER_NEO_NAME.transition()
		.text(NEO_NAME);
	NEO_NAME=node.name;
}

const compareWithAverageRadarChart = (node) => {
	compareNodeRadarChart(AVERAGE_NEO);
	compareNodeRadarChart(node);
}


d3.json("content/data/example.json", function(error, data) {
	if (error) throw error;
	let distanceSum = 0;
	let diameterSum = 0;
	let velocitySum = 0;
	let impactProbabilitySum = 0;
	let hazardScaleSum = 0;

	for( var i = 0; i < data.length; i++ ){
		distanceSum += data[i].distance;
		diameterSum += data[i].diameter;
		velocitySum += data[i].velocity;
		impactProbabilitySum += data[i].impactProbability;
		hazardScaleSum += data[i].hazardScale;
	}
	AVERAGE_NEO = {
		name: 'Average NEO',
		ld: distanceSum/data.length,
		diam: diameterSum/data.length,
		velocity: velocitySum/data.length,
		impactProb: impactProbabilitySum/data.length,
		hazard: hazardScaleSum/data.length,
	}
    
	initRadarChart();
});