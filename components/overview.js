
    var ow, height, width;
    var lunar_distance_scale, time_scale, size_scale, hmag_scale;
    var LUNAR_DISTANCE, MAX_LDS;
    var offsetTop, offsetBottom;
    var minYear, maxYear, realMin,realMax, yearWindowSize;
    var selectedNeos = [];
    var left, right;
    var currRows,offset,offsetu;
	var oldNEO;
	var newNEO;
   
    function draw() {
        offset = 0;
        offsetu = 0;
        ow = d3.select("#svgOverview");
        var window_height = window.innerHeight;
        var window_width = window.innerWidth;
        height = 0.65 * window_height;
        width = 0.7 * window_width;
        
        LUNAR_DISTANCE = 384400; //km
        MAX_LDS = 80;
        offsetTop = 40;
        offsetBottom = 40;
        windowSize = 50;
        realMin = 1900;
        realMax = 2200;
            
        
        lunar_distance_scale = d3.scaleLinear()
            .domain([0, MAX_LDS])
            .range([height - 50, 30 ]);
        
        var date = new Date();
        var time_domain = [d3.timeYear.offset(date, -1 * windowSize), d3.timeYear.offset(date, windowSize)];
        minYear = time_domain[0].getFullYear();
        maxYear = time_domain[1].getFullYear();
        
        time_year_scale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, width]);
        
        time_scale = d3.scaleLinear()
            .domain([realMin + 1, realMin + (realMax - realMin)*12 + 12])
            .range([0, width * (realMax - realMin)/61]);

        
        //console.log(maxYear*12 + 12);
        /*time_scale = d3.scaleLinear()
            .domain([minYear+1, minYear + (maxYear - minYear)*12 + 12])
            .range([0, width]);*/
        
        size_scale = d3.scaleLog()
            .domain([3, 15])
            .range([1, 4]);
        
        left = d3.select('#left');
        right = d3.select('#right');
        //console.log(document.getElementById('left'));
        //drawGuideLines("guide-light", 2);
        drawRulers();
        drawEarthAndMoon();
        drawNeos();
    }
    
    
     function yearToYearmonth(year){
        console.log('a');
        console.log(minYear);
        return minYear + ((year) - minYear) * 12;
    }
    

    function drawGuideLines(classname, years) {
        var date = new Date();
        var year = date.getFullYear();
        var guides = ow.append("g");
        var left = minYear + ((year - years + 1) - minYear) * 12;
        var right = minYear + ((year + years) - minYear) * 12;
        var data = []
        for(i = 0;i <= (realMax - realMin) *16.68 ;i += 16.68){
            data.push(i);
        }
        
        guides.selectAll("guide")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", function(d) {
                return d;
            })
            .attr("y1", offsetTop)
            .attr("x2", function(d) {
                return d;
            })
            .attr("y2", height - offsetBottom)
            .attr("class", classname);
    }

    function drawRulers() {
        var range = d3.range(1, MAX_LDS + 1);
        var rulerGroup = ow.append("g");
        rulerGroup.selectAll("ruler")
            .data(range)
            .enter()
            .append("line")
            .attr("class", "ruler")
            .attr("x1", function(d) {
                if (d % 10 === 0 || d === 1) {
                    return width / 2 - 65.5;
                } else if (d % 5 === 0) {
                    return width / 2 - 10;
                }
                return 0;
            })
            .attr("y1", function(d) {
               // console.log(lunar_distance_scale(d));
                return  lunar_distance_scale(d);
            })
            .attr("x2", function(d) {
                if (d % 10 === 0 || d === 1) {
                    return width / 2 + 65.5;
                } else if (d % 5 === 0) {
                    return width / 2 + 10;
                }
                return 0;
            })
            .attr("y2", function(d) {
                return lunar_distance_scale(d);
            });
        rulerGroup.selectAll("ruler-label")
            .data(range.filter(function(d) {
                return d % 10 === 0 || d === 1
            }))
            .enter()
            .append("text")
            .text(function(d) {
                return d + " LDs";
            })
            .attr("class", "ruler-label")
            .attr("x", width / 2 + 85)
            .attr("y", function(d) {
                return lunar_distance_scale( d) + 3;
            });
    }

    function drawEarthAndMoon() {
        var earthAndMoon = ow.append("g").attr("class", "earth-and-moon");
        var earth = earthAndMoon.append("circle")
            .attr("class", "earth")
            .attr("r", 12)
            .attr("cx", width / 2)
            .attr("cy", height)
    }

    function drawNeos() {
        d3.csv("content/data/data.csv")
            .row(function(d) {
                var year = realMin + (parseInt(d['Year']) - realMin) * 12;
                
                var month = getMonthFromString(d['Month']);
                //console.log(d['Year']+ " " + (year  + month) + " " + time_scale(year));
                return {
                    ld: d["Distance (LD)"],
                    closeApproachYear: year,
                    month: month,
                    name: d["Object"],
                    diam: d["Diameter"],
                    origYear: parseInt(d['Year']),
                    iDamage: d['Danger'],
                    impactProb: d['Impact Probability'],
                    hazard: d['Hazard Scale'],
                    velocity: d['Velocity (km/s)'],
                    selected: false,
                    id: d['Id']
                }
            })
            .get(function(errors, rows) {
                rows = rows.filter(function(row) {
                    return row.ld <= MAX_LDS + 0.5;
                });
                var asteroids = ow.append("g").attr("class", "asteroidsO");
                asteroids.selectAll("asteroidO")
                    .data(rows)
                    .enter()
                    .append("circle")
                    .attr("class", function(d) {
                        d.circleEl = this;
                        var className = "asteroidO"
                        if(d.iDamage != 0){
                            className += " danger-" + parseInt(d.iDamage);
                        }
                        //console.log(className);
                        return className;
                    })
                    .attr("r", function(d) {
                        return size_scale(getR(d.diam));
                    })
                    .attr("cy", function(d) {
                        return lunar_distance_scale(d.ld)
                    })
                    .attr("cx", function(d) {/*
                        console.log(d.closeApproachYear);
                        console.log(time_scale(d.closeApproachYear + d.month));*/
                        return time_scale(d.closeApproachYear + d.month - (80 + offset)*12);
                    });
            
                asteroids.selectAll("pulsating-rings")
                    .data(rows)
                    .enter()
                    .append("circle")
                    .attr("class", function(d) {
                        d.pulseEl = this;
                        var className = 'pulsating-rings';
                        return className;
                    })
                    .attr("r", function(d) {
                        return size_scale(getR(d.diam));
                    })
                    .attr("cx", function(d) {
                        return time_scale(d.closeApproachYear + d.month - (80 + offset)*12)
                    })
                    .attr("cy", function(d) {
                        return lunar_distance_scale(d.ld )
                    });
                
                asteroids.selectAll("asteroid-rings")
                    .data(rows)
                    .enter()
                    .append("circle")
                    .attr("class", function(d) {
                        d.ringEl = this;
                        var className = 'asteroid-rings';
                        return className;
                    })
                    .attr("r", 20)
                    .attr("cx", function(d) {
                        return time_scale(d.closeApproachYear + d.month- (80 + offset)*12)
                    })
                    .attr("cy", function(d) {
                        return lunar_distance_scale(d.ld)
                    });
                currRows = rows;
                drawVoronoi(rows,offset);
            });
    }

    function drawVoronoi(data) {
        console.log(offset);
        var popover = d3.select("#popover");
       // console.log(data);
        var voronoi = d3.voronoi()
            .x(function(d) {
               // console.log(d);
                
                return time_scale(parseInt(d.closeApproachYear) + parseInt(d.month) - (80 + offset)*12);
            })
            .y(function(d) {
                return lunar_distance_scale(d.ld)
            })
            .extent([
                [-1, -1],
                [width * (realMax - realMin)/61, height + 1]
            ]);
        //console.log(data);
       // console.log(voronoi.polygons(data));
        var polygon = ow.append("g")
            .attr("class", "voronoi")
            .selectAll("path")
            .data(voronoi.polygons(data))
            .enter().append("path")
            .call(redrawPolygon)
            .on("mouseenter", function(d) {
                d.data['ringEl'].style.display = 'block';
                
                //console.log(d);
                popover.select("#name").text('Asteroid ' + d['data'].name);
                popover.select("#approach").text('Approach Date: ' + nameFromMonthNumber(d['data'].month) + '-' + d['data'].origYear);
                var popEl = popover["_groups"][0][0];
                //console.log(d['data']);
                
                if (d.data['ringEl'].cy.baseVal.value > height / 2 ) {
                    popEl.style.top = d.data['ringEl'].getBBox().y - 65 + 'px';
                }
                else{
                    popEl.style.top = d.data['ringEl'].getBBox().y + 32 + 'px';
                }

                if (d.data['ringEl'].cx.baseVal.value > width / 2 ) {
                    popEl.style.left = d.data['ringEl'].getBBox().x - 140 + 'px';
                }
                else {
                    popEl.style.left = d.data['ringEl'].getBBox().x + 20 + 'px';
                }
                popEl.style.display = 'block';
            })
            .on("mouseout", function(d) {
                d.data['ringEl'].style.display = 'none';
                popover["_groups"][0][0].style.display = 'none';
            })
            .on("mousedown", function(d){
                var color = getRandomColor();
                var newNEO = d['data'].id;
				//console.log(newNEO);
				//console.log(oldNEO);
				
                if(selectedNeos.length == 0){
                    compareWithAverageRadarChart(d['data'],color);
                }
                else{
					if(oldNEO==newNEO){
					compareNodeRadarChart(AVERAGE_NEO);
				}
                    compareNodeRadarChart(d['data'],color);
                }
				
				d['data'].selected = !d['data'].selected;
				
				if(oldNEO==newNEO){
					d['data'].selected = !d['data'].selected;
				}
                
				
                if (d['data'].selected) {
                    if(selectedNeos[1]){
                        selectedNeos[1].selected = false;
                        d3.select(selectedNeos[1].pulseEl)
                        .classed('on',false)
                        .classed('off',true);
                    } 
                    selectedNeos[1] = selectedNeos[0];
                    selectedNeos[0] = d['data'];
                    d3.select(d['data'].pulseEl)
                        .style('stroke',function(d){
                        return getC(d.iDamage);
                        
                    })
                        
                               
                        .classed('off',false)
                        .classed('on',true);

                }
                else{
                    if(selectedNeos[0].id == d['data'].id){
                        selectedNeos[0] = '';
                    }
                    else{
                        selectedNeos[1] = '';
                    }
                    d3.select(d['data'].pulseEl)
                        .classed('on',false)
                        .classed('off',true);
                }
                //console.log(selectedNeos);
                pulsate();
                //console.log(selectedNeos);
				oldNEO=newNEO;
            });
    }
    
    function pulsate() {
    recursive_transitions();
        
        function recursive_transitions() {
            //pulse = selection['_groups'][0][0].pulseEl;
            //console.log(selection['_groups'][0][0].circleEl.r['baseVal'].value);
            selectionPulse = d3.selectAll('.on');
            //console.log(selectionPulse);
         // if (selection['_groups'][0][0].selected) {
            if(selectionPulse){
                //selectionPulse.style('display','block');
                selectionPulse
                    .style('stroke-width',function(d){
                            if(selectedNeos[0].id == d.id) return 2;
                            else return 1;
                    }).transition()
                .duration(500)
                .attr("stroke-width", 2)
                .attr("r", 15)
                .ease(d3.easeSin)
                .transition()
                .duration(500)
                .attr('stroke-width', 3)
                .attr("r", function(d) {
                        //console.log(d);
                        return d.circleEl.r['baseVal'].value + 2})
                .ease(d3.easeSin)
                .on("end", recursive_transitions);
            }
            
        /*  } else {
            selectionPulse['_groups'][0][0].style.display = 'none';
            selectionPulse.transition()
                .duration(200)
                .attr("r", size_scale(getR(selection['_groups'][0][0].diam)))
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "1, 0");
          }*/
        }
    }
    

    function inInterval(number, interval) {
        return number >= interval[0] && number <= interval[1];
    }

    function redrawPolygon(polygon) {
        //console.log(polygon);
        polygon
        
            .attr("d", function(d) {
                //console.log(d);
                return d ? "M" + d.join("L") + "Z" : null;
            });
    }
    
    const getR = (diameter) => {
        if (diameter < 50) return 4;
        if (diameter < 150) return 7;
        if (diameter < 250) return 10;
        if (diameter < 350) return 11;
        if (diameter < 450) return 12;
        if (diameter < 550) return 13;
        if (diameter < 1000) return 16;
        else return 18;
    }
    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    }
    
    function nameFromMonthNumber(number){
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[number - 1];
    }
    
    function yearToYearmonth(year){
        return minYear + ((year) - minYear) * 12
    }
    
    
    
    draw();

function change_overview(direction){
        
        var goLeft;
        if(direction == 1){
            goLeft = 1;
        }
        else{
            goLeft = -1;
        
        }
    
        offsetu += goLeft;
        console.log(offsetu);
        d3.selectAll(".asteroidO")
            .transition()
            .duration(1000)
            .attr('cx', function(d){
                    //console.log(d);
                  //console.log(d.circleEl);
                  return time_scale(d.closeApproachYear + d.month - (80 - offsetu*10)*12);
        });
        d3.selectAll(".asteroid-rings")
        .attr('cx', function(d){
            //console.log(d);
              //console.log(d.circleEl);
              return time_scale(d.closeApproachYear + d.month - (80 - offsetu*10)*12);
         });
    
    d3.selectAll(".pulsating-rings")
        .attr('cx', function(d){
            //console.log(d);
              //console.log(d.circleEl);
              return time_scale(d.closeApproachYear + d.month - (80 - offsetu*10)*12);
         });
    
    
        d3.select('.voronoi').remove();
        //d3.select('.asteroidsO').remove();
        //console.log(direction);
        offset -=  goLeft * 10
        drawVoronoi(currRows);
        /*d3.selectAll("path")
            .attr("d", function(d) {
                console.log(d);
                var newD = d;
                if(newD){
                   var l = newD.length;
                    for(var i = 0;i < l; i++){
                        newD[i][0] +=  -50;
                    } 
                }
               //console.log(newD);
                
                return newD ? "M" + newD.join("L") + "Z" : null;
            });*/
    }
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}