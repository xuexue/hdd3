function parallel(data, parent) {
  var parallel = {}

  parallel.setup = function(height, width, padding, mainDiv) {
    // scales and scaled-getters
    this.o = data.getScales([height, 0]);
    var scale = this.o.scale,
        scaleGet = this.o.scaleGet;

    // chart
    var eachWidth = width / (data.traits.length - 1)
    this.chart = d3.select(mainDiv).html("")
        .append("svg")
        .attr("class", "chart")
        .attr("width", width + 2*padding)
        .attr("height", height + 2*padding);

    // lines
    for (var i=1; i< data.traits.length; i++) {
      var prev = data.traits[i-1],
          current = data.traits[i]
      parallel.chart.selectAll("linechart")
          .data(data.values)
           .enter().append("svg:line")
          .attr("transform", "translate(0,"+padding+")")
           .attr("class", "path")
           .attr("x1", padding + (i-1)*eachWidth)
           .attr("y1", function(d) { return parallel.o.scaleGet[prev](d) })
           .attr("x2", padding + i*eachWidth)
           .attr("y2", function(d) { return parallel.o.scaleGet[current](d) })
           .attr("width", 1)
           .style("stroke", colour.point)
    }

    // axes
    var axes = d3.svg.axis()
        .ticks(4)
        .tickSize(1)
        .orient("left")
    this.chart.selectAll("g.axis")
        .data(data.traits)
        .enter().append("svg:g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) {
          return "translate("+((i*eachWidth)+padding)+","+padding+")"
        })
        .each(function(d){ d3.select(this).call(axes.scale(scale[d])); })
      .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
  }

  parallel.recolour = function() {
    parallel.chart.selectAll("line.path").style("stroke", colour.point)
  }

  return parallel
}
