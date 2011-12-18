parallel = {}

parallel.setup = function(height, width, padding, mainDiv) {
  // scales and scaled-getters
  var o = getScales([height, 0]);
  var scale = o.scale,
      scaleGet = o.scaleGet;

  // chart
  var eachWidth = width / (data.traits.length - 1)
  var parallel = d3.select(mainDiv)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + 2*padding)
      .attr("height", height + 2*padding);

   // lines
   var lines = parallel.selectAll("g.line")
       .data(data.values)
       .enter().append("svg:g")
       .attr("transform", "translate(0,"+padding+")")
       .each (plotLines)

  function plotLines(point) {
    var lines = d3.select(this)
    for (var i = 0; i < data.traits.length - 1; i++) {
      current = data.traits[i]
      next = data.traits[i+1]

      lines.append("svg:line")
          .attr("x1", padding + i*eachWidth)
          .attr("y1", scaleGet[current](point))
          .attr("x2", padding + (i+1)*eachWidth)
          .attr("y2", scaleGet[next](point))
          .attr("width", 1)
          .attr("stroke", function(d) { return colour.point(d.category) })
    }
  }
  // axes
  var axes = d3.svg.axis()
      .ticks(4)
      .tickSize(1)

  parallel.selectAll("g.axis")
      .data(data.traits)
      .enter().append("svg:g")
      .attr("class", "y axis")
      .attr("transform",
            function(d, i) {
              return "translate("+((i*eachWidth)+padding)+","+padding+")"
            })
      .each(function(d){
        d3.select(this).call(axes.scale(scale[d]).orient("left"));
      });

  parallel.selectAll("textlabel")
      .data(data.traits)
      .enter().append("text")
      .attr("x", function(d, i) { return eachWidth*i + padding})
      .attr("y", height + padding + 17.5)
      .attr("text-anchor", "middle")
      .text(function(d) { return d; })
}
