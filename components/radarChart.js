const ARM_LENGTH = 150;
const START_OFFSET = 50;

let OLDER_POLYGON;
let NEWER_POLYGON;

let OLDER_NEO_NAME;
let NEWER_NEO_NAME;
let NEO_NAME;

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

	var node = svg.append("g")
		.attr('id','radarChart')
		.attr('transform', 'translate(700, 250)')

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
		.attr('x',-250)
		.attr('y', 180)
		.attr('fill', 'grey');
		
	NEWER_NEO_NAME = node.append("text")
		.attr('x',-250)
		.attr('y', 200)
		.attr('fill', 'black');
	
		compareNodeRadarChart(AVERAGE_NEO);
}

const compareNodeRadarChart = (node) => {
	if(node.objectId === 'Earth') return;
	const firstVal = getScalePosition(DISTANCE_MAX, DISTANCE_MIN, node.distance);
	const first = `${0}, ${-firstVal}`;
	const secondVal = getScalePosition(DIAMETER_MAX, DIAMETER_MIN, node.diameter);	
	const second = `${downXDist(secondVal)}, ${downYDist(secondVal)}`;
	const thirdVal = getScalePosition(VELOCITY_MAX, VELOCITY_MIN, node.velocity);	
	const third = `${-downXDist(thirdVal)}, ${downYDist(thirdVal)}`;
	const fourthVal = getScalePosition(IMPACT_PROBABILITY_MAX, IMPACT_PROBABILITY_MIN, node.impactProbability);	
	const fourth = `${sideXDist(fourthVal)}, ${-sideYDist(fourthVal)}`;
	const fifthVal = getScalePosition(HAZARD_SCALE_MAX, HAZARD_SCALE_MIN, node.hazardScale);	
	const fifth = `${-sideXDist(fifthVal)}, ${-sideYDist(fifthVal)}`;

	OLDER_POLYGON.transition()
		.duration(300)
		.attr('points', `${first} ${fourth} ${second} ${third} ${fifth}`)
		.attr("fill", getC(node.impactDamage));
	
	NEWER_NEO_NAME.transition()
		.text(node.name);

	OLDER_NEO_NAME.transition()
		.text(NEO_NAME);
	NEO_NAME=node.name;
	
	const tmp = NEWER_POLYGON;
	NEWER_POLYGON = OLDER_POLYGON;
	OLDER_POLYGON = tmp;
	
}

const compareWithAverageRadarChart = (node) => {
	compareNodeRadarChart(node);
	compareNodeRadarChart(AVERAGE_NEO);
}
