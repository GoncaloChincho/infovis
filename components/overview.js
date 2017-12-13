(function(root) {
    var ow, height, width;
    var lunar_distance_scale, time_scale, size_scale, hmag_scale;
    var LUNAR_DISTANCE, MAX_LDS;
    var offsetTop, offsetBottom;
    var minYear, maxYear, yearWindowSize;

    function draw() {
        ow = d3.select("#svgOverview");
        var window_height = window.innerHeight;
        var window_width = window.innerWidth;
        height = 0.65 * window_height;
        width = 0.7 * window_width;
        
        LUNAR_DISTANCE = 384400; //km
        MAX_LDS = 73;
        offsetTop = 40;
        offsetBottom = 40;
        windowSize = 5;
            
        lunar_distance_scale = d3.scaleLinear()
            .domain([0, MAX_LDS * LUNAR_DISTANCE])
            .range([30, height - 50]);
        
        var date = new Date();
        var time_domain = [d3.timeYear.offset(date, -1 * windowSize), d3.timeYear.offset(date, windowSize)];
        minYear = time_domain[0].getFullYear();
        maxYear = time_domain[1].getFullYear();
        
        time_year_scale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, width]);
        console.log(maxYear*12 + 12);
        time_scale = d3.scaleLinear()
            .domain([minYear+1, minYear + (maxYear - minYear)*12 + 12])
            .range([0, width]);
        
        size_scale = d3.scaleLog()
            .domain([3, 15])
            .range([1, 4]);

        drawGuideLines("guide-light", windowSize * (1 / 3));
        drawGuideLines("guide-light", (2 / 3) * windowSize);
        drawRulers();
        drawEarthAndMoon();
        drawNeos();
    }

    function drawGuideLines(classname, years) {
        var date = new Date();
        var year = date.getFullYear();
        var guides = ow.append("g");
        guides.selectAll("guide")
            .data([time_year_scale(year - 1 * years), time_year_scale(year + years)])
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
                return height - lunar_distance_scale(LUNAR_DISTANCE * d);
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
                return height - lunar_distance_scale(LUNAR_DISTANCE * d);
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
                return height - lunar_distance_scale(LUNAR_DISTANCE * d) + 3;
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
                var year = minYear + (parseInt(d['Year']) - minYear) * 12;
                
                var month = getMonthFromString(d['Month']);
                if (d["Object"] === "" || !inInterval(year, [minYear+1, maxYear*12 + 12])) return;
                
                return {
                    ld: d["Distance (LD)"],
                    closeApproachYear: year,
                    month: month,
                    name: d["Object"],
                    diam: d["Diameter"],
                    origYear: parseInt(d['Year'])
                }
            })
            .get(function(errors, rows) {
                rows = rows.filter(function(row) {
                    return row.ld <= MAX_LDS + 0.5;
                });
                var asteroids = ow.append("g").attr("class", "asteroids");
                asteroids.selectAll("asteroid")
                    .data(rows)
                    .enter()
                    .append("circle")
                    .attr("class", function(d) {
                        d.el = this;
                        var className = '';
                        return className += " asteroid";
                    })
                    .attr("r", function(d) {
                        return size_scale(getR(d.diam));
                    })
                    .attr("cy", function(d) {
                        return lunar_distance_scale(d.ld * LUNAR_DISTANCE)
                    })
                    .attr("cx", function(d) {/*
                        console.log(d.closeApproachYear);
                        console.log(time_scale(d.closeApproachYear + d.month));*/
                        return time_scale(d.closeApproachYear + d.month);
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
                    .attr("r", 30)
                    .attr("cx", function(d) {
                        return time_scale(d.closeApproachYear + d.month)
                    })
                    .attr("cy", function(d) {
                        return lunar_distance_scale(d.ld * LUNAR_DISTANCE)
                    });
                drawVoronoi(rows);
            });
    }

    function drawVoronoi(data) {
        var popover = d3.select("#popover");
        
        var voronoi = d3.voronoi()
            .x(function(d) {
                
                return time_scale(parseInt(d.closeApproachYear) + parseInt(d.month))
            })
            .y(function(d) {
                return lunar_distance_scale(d.ld * LUNAR_DISTANCE)
            })
            .extent([
                [-1, -1],
                [width + 1, height + 1]
            ]);
        var polygon = ow.append("g")
            .attr("class", "voronoi")
            .selectAll("path")
            .data(voronoi.polygons(data))
            .enter().append("path")
            .call(redrawPolygon)
            .on("mouseenter", function(d) {
                d.data['ringEl'].style.display = 'block';
                console.log(d);
                popover.select("#name").text('Asteroid ' + d['data'].name);
                popover.select("#approach").text('Approach Date: ' + nameFromMonthNumber(d['data'].month) + '-' + d['data'].origYear);
                var popEl = popover["_groups"][0][0];
                console.log(d['data'].el.getBBox());
                
                if (d['data'].el.cy.baseVal.value > height / 2 ) {
                    popEl.style.top = d['data'].el.getBBox().y - 65 + 'px';
                }
                else{
                    popEl.style.top = d['data'].el.getBBox().y + 32 + 'px';
                }

                if (d['data'].el.cx.baseVal.value > width / 2 ) {
                    popEl.style.left = d['data'].el.getBBox().x - 140 + 'px';
                }
                else {
                    popEl.style.left = d['data'].el.getBBox().x + 20 + 'px';
                }
                popEl.style.display = 'block';
            })
            .on("mouseout", function(d) {
                d.data['ringEl'].style.display = 'none';
                popover["_groups"][0][0].style.display = 'none'
            });
    }

    function inInterval(number, interval) {
        return number >= interval[0] && number <= interval[1];
    }

    function redrawPolygon(polygon) {
        polygon
            .attr("d", function(d) {
                return d ? "M" + d.join("L") + "Z" : null;
            });
    }
    const getR = (diameter) => {
        if (diameter < 50) return 3;
        if (diameter < 150) return 6;
        if (diameter < 250) return 9;
        if (diameter < 350) return 10;
        if (diameter < 450) return 11;
        if (diameter < 550) return 12;
        if (diameter < 1000) return 15;
        else return 15;
    }
    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    }
    
    function nameFromMonthNumber(number){
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[number - 1];
    }
    
    draw();
})(window)