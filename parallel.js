parallel = {}

parallel.setup = function(height, width, padding, mainDiv) {
  // scales and scaled-getters
  var o = getScales([height, 0]);
  var scale = o.scale,
      scaleGet = o.scaleGet;

  // chart
  var eachWidth = width / (data.traits.length - 1)
  this.chart = d3.select(mainDiv)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + 2*padding)
      .attr("height", height + 2*padding);

  // lines
  this.lines = this.chart.selectAll("g.line")
      .data(data.values)
      .enter().append("svg:g")
      .attr("transform", "translate(0,"+padding+")")
      .each(function (point) {
        for (var i = 0; i < data.traits.length - 1; i++) {
          var lines = d3.select(this)
          current = data.traits[i]
          next = data.traits[i+1]

          lines.append("svg:line")
              .attr("class", "path")
              .attr("x1", padding + i*eachWidth)
              .attr("y1", scaleGet[current](point))
              .attr("x2", padding + (i+1)*eachWidth)
              .attr("y2", scaleGet[next](point))
              .attr("width", 1)
              .attr("stroke", colour.point)
        }
      });
  // axes
  var axes = d3.svg.axis()
      .ticks(4)
      .tickSize(1)
      .orient("left")
  this.chart.selectAll("g.axis")
      .data(data.traits)
      .enter().append("svg:g")
      .attr("class", "y axis")
      .attr("transform",
            function(d, i) {
              return "translate("+((i*eachWidth)+padding)+","+padding+")"
            })
      .each(function(d){ d3.select(this).call(axes.scale(scale[d])); })
    .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
}


