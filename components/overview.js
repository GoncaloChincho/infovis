(function(root) {
    var ow, height, width;
    var lunar_distance_scale, time_scale, size_scale, hmag_scale;
    var LUNAR_DISTANCE, MAX_LDS;
    var offsetTop, offsetBottom;
    var minYear, maxYear;
    function draw(){
        ow = d3.select("#svgOverview");
        var window_height = window.innerHeight;
        var window_width = window.innerWidth;
        height = 0.65 * window_height;
        width = 0.7 * window_width;
        
        
        LUNAR_DISTANCE = 384400; //km
        
        MAX_LDS = 73;
        
        offsetTop = 40;
        offsetBottom = 40;
        
        lunar_distance_scale = d3.scaleLinear()
                                  .domain([0, MAX_LDS * LUNAR_DISTANCE])
                                  .range([30, height - 50]);
        
        var date = new Date();
        var time_domain = [d3.timeYear.offset(date, -30),  d3.timeYear.offset(date, 30)];
        
        minYear = time_domain[0].getFullYear();
        maxYear = time_domain[1].getFullYear();
        /*time_scale = d3.scaleTime()
                      .domain(time_domain)
                      .rangeRound([0,width]);*/
        
        time_scale = d3.scaleLinear()
                        .domain([minYear,maxYear])
                        .range([0,width]);
        
        size_scale = d3.scaleLog()
                      .domain([30, 17])
                      .range([0.5, 4]);
        
        hmag_scale = d3.scaleLinear()
                        .domain([30, 29,  28,   27,   26, 25,  24, 23, 22,   21,  20,  19, 18])
                        .range([4.5, 6.5, 11.5, 17.5, 27, 42.5, 65, 90, 170,  210, 330, 670, 1000]);
        
        
        drawGuideLines("guide-light", 10);
        drawGuideLines("guide-light", 20);
        drawRulers();
        drawEarthAndMoon();
        drawNeos();
        
        
    }
    
    function drawGuideLines(classname, years) {
        var date = new Date();
        var year = date.getFullYear();
        var guides = ow.append("g");

        guides.selectAll("guide")
                .data([time_scale(year - 1 * years), time_scale(year + years)])
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
                if ( d % 10 === 0 || d === 1 ) {
                  return width / 2 - 65.5;
                }
                else if  ( d % 5 === 0){
                    return width / 2 - 10;
                }
            
                return 0;
              })
              .attr("y1", function(d) {
                return height - lunar_distance_scale(LUNAR_DISTANCE * d);
              })
              .attr("x2", function(d) {
                if ( d % 10 === 0 || d === 1) {
                  return width / 2 + 65.5;
                }

                else if  ( d % 5 === 0){
                    return width / 2 + 10;
                }
                
                return 0;
              })
              .attr("y2", function(d) {
                return height - lunar_distance_scale(LUNAR_DISTANCE * d);
              });

        rulerGroup.selectAll("ruler-label")
          .data(range.filter(function(d) { return d % 10 === 0 || d === 1}))
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
                var year = d['Year'];
                
                if ( d["Object"] === "" || !inInterval(year,[minYear,maxYear])) return;
                return {
                    ld: d["Distance (LD)"],
                    closeApproachYear: year,
                    name: d["Object"]
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
                /*if ( d.h < 21 ) {
                  className += " huge";
                }
                else if ( d.h < 24.5 ) {
                  className += " big";
                }
                else if ( d.h > 28 ) {
                  className += " small";
                }*/

                /*if (new RegExp('\(' + d.closeApproach._d.getFullYear() + '.*\)').test(d.name)) {
                  className += " new";
                }*/

                return className += " asteroid";
          })
          .attr("r", function(d) {
            return size_scale(28);
          })
          .attr("cy", function(d) {
            return lunar_distance_scale(d.ld * LUNAR_DISTANCE)
          })
          .attr("cx", function(d) {
            //console.log(d.closeApproachYear);
            //console.log(time_scale(d.closeApproachYear));
            return time_scale(d.closeApproachYear);
          })
          /*.attr("transform", function(d) {
            if ( Math.random() * 2 > 1)
            return "rotate(34, " + [time_scale(d.closeApproach._d), lunar_distance_scale(d.ldMinimum * LUNAR_DISTANCE)].join(",") + ")";
          })*/;

      /*var bigOnes = rows.filter(function(val) { return val.h < 21 });
      asteroids.selectAll('ruler-label')
        .data(bigOnes)
        .enter()
          .append('text')
          .attr("class", "ruler-label")
          .text(function(d) {
            try {
              return /\((.*)\)/.exec(d.name)[1];
            }
            catch(e) {
              return d.name;
            }
          })
          .attr('x', function(d) {
            return time_scale(d.closeApproach._d) - 110;
          })
          .attr('y', function(d) {
            return lunar_distance_scale(d.ldMinimum * LUNAR_DISTANCE) + 20;
          })
          .attr('foo', function(d) {
            drawLabelLine(asteroids, d3.select(this).node(), d3.select(d.el).node())
          });*/
      console.log(rows.length);
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
            return time_scale(d.closeApproachYear)
          })
          .attr("cy", function(d) {
            return lunar_distance_scale(d.ld * LUNAR_DISTANCE)
          });

      drawVoronoi(rows);
    });
  }
    
    function drawVoronoi(data) {
        
        var voronoi = d3.voronoi()
          .x(function(d) {return time_scale(d.closeApproachYear) })
          .y(function(d) { return lunar_distance_scale(d.ld * LUNAR_DISTANCE) })
          .extent([[-1, -1], [width+1, height+1]]);


        var voronoiGroup = ow.append("g")
          .attr("class", "voronoi");
        var voronoidata = voronoi(data);
        /*console.log(voronoidata['cells']);
        voronoiGroup.selectAll("path")
            .data(voronoidata['cells'])
            .enter()
            .append("path")
            .attr("d", function(d) {
                console.log(d);
                if ( !d || d.length < 2) {
                 return null;
                }
                return "M" + d['site'].join("L") + "Z";
            })
            .datum(function(d) {
              return d && d.point;
             })
            .on("mouseenter", function(d) {
              d.ringEl.style.display = 'block';
            })
            .on("mouseout", function(d) {
              d.ringEl.style.display = 'none';
            });*/

  }
    
  function inInterval(number,interval){
      return number >= interval[0] && number <= interval[1];
  }
    
    
    draw();
})(window)