function parallel(data, parent) {
  var parallel = {}

  parallel.setup = function(height, width, padding, mainDiv) {
    // scales and scaled-getters
    this.o = data.getScales([height, 0]);
    this.scale = this.o.scale;
    this.scaleGet = this.o.scaleGet;
    this.width = width
    this.height = height
    this.padding = padding
    return parallel
  }

  parallel.plot = function(mainDiv) {
    // chart
    var eachWidth = this.width / (data.traits.length - 1)
    this.chart = d3.select(mainDiv).html("")
        .append("svg")
        .attr("class", "chart")
        .attr("width", this.width + 2*this.padding)
        .attr("height", this.height + 2*this.padding);

    // lines
    for (var i=1; i< data.traits.length; i++) {
      var prev = data.traits[i-1],
          current = data.traits[i]
      parallel.chart.selectAll("linechart")
          .data(data.values)
           .enter().append("svg:line")
          .attr("transform", "translate(0,"+this.padding+")")
           .attr("class", "path")
           .attr("x1", this.padding + (i-1)*eachWidth)
           .attr("y1", function(d) { return parallel.o.scaleGet[prev](d) })
           .attr("x2", this.padding + i*eachWidth)
           .attr("y2", function(d) { return parallel.o.scaleGet[current](d) })
           .attr("width", 1)
           .style("stroke-opacity", 0.5)
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
          return "translate("+((i*eachWidth)+parallel.padding)+","+parallel.padding+")"
        })
        .each(function(d){ d3.select(this).call(axes.scale(parallel.scale[d])); })
      .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
    return parallel
  }

  parallel.recolour = function() {
    parallel.chart.selectAll("line.path").style("stroke", colour.point)
    return parallel
  }

  return parallel
}
