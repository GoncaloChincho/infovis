(function(root) {
    var ow, height, width;
    var lunar_distance_scale, time_scale, size_scale, hmag_scale;
    var LUNAR_DISTANCE, MAX_LDS;
    var offsetTop, offsetBottom;
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
        time_scale = d3.scaleTime()
                      .domain([d3.timeYear.offset(date, -30),  d3.timeYear.offset(date, 30)])
                      .rangeRound([0,width]);
        console.log(time_scale(date))
        
        
        size_scale = d3.scaleLog()
                      .domain([30, 17])
                      .range([0.5, 4]);
        
        hmag_scale = d3.scaleLinear()
                        .domain([30, 29,  28,   27,   26, 25,  24, 23, 22,   21,  20,  19, 18])
                        .range([4.5, 6.5, 11.5, 17.5, 27, 42.5, 65, 90, 170,  210, 330, 670, 1000]);
        
        drawGuideLines("guide-light", 10);
        drawGuideLines("guide-light", 20);
        drawRulers();
        drawTimeAxis();
        
    }
    
    function drawGuideLines(classname, years) {
        var date = new Date();
        var guides = ow.append("g");
        
        console.log(height);
        guides.selectAll("guide")
                .data([time_scale(d3.timeYear.offset(date, -1 * years)), time_scale(d3.timeYear.offset(date, years))])
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

        return;
        /*
        guides.append("text")
          .attr("class", "ruler-label ")
          .text(function() {
            return 'Will pass ' + moment(d3.timeMonth.offset(data, months)).fromNow();
          })
          .attr("x", function() {
            return time_scale(d3.timeMonth.offset(date, months))
          })
          .attr("y", offsetTop - 10)*/

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
    
    function drawTimeAxis() {

    var data = [-20, -10, 0, 10, 20];
    var date = new Date();

    d3.select('#ticks')
      .selectAll('ticks')
      .data(data)
      .enter()
        .append("div")
        .attr("class", "ticks")
        .text(function(d) {
          if ( d === 0 ) return "Approaching this week";
          if ( d === d3.max(data) ) return "Approaching in " + d + " months";
          if ( d < 0 ) {
            return Math.abs(d) + " months ago";
          }

          return "In " + d + " months";
        })
        .style("left", function(d) {
          var offset = 50;
          if ( d === 0 || d === d3.max(data) ) offset = 88;

          return time_scale(d3.time.month.offset(date, d)) - offset + "px"
        })


    return;
    var xAxis = d3.svg.axis()
        .scale(time_scale)
        .orient("top")
        .ticks(d3.time.months, 3)
        .tickSize(10, 0)
        .tickPadding(5)
        .tickFormat(function(d) {
          return d3.time.format("%b %Y")
        });

    ow.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, 10)")
        .call(xAxis)
      .selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", 6)
        .attr("y", 0);
    }
    
    draw();
})(window)