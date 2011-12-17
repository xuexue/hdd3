function setupScatter (height, width, padding, mainDiv)  {
  // scales and scaled-getters
  var xScales = getScales([0, width])
  var yScales = getScales([height, 0])

  // chart
  var chart = d3.select(mainDiv)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + 2*padding)
      .attr("height", height + 2*padding);

  var dots = chart.selectAll("circle")
      .data(data.values)
      .enter().append("circle")
      .attr("transform", "translate("+padding+","+padding+")")
      .attr("cx", width/2)
      .attr("cy", height/2)
      .attr("r", 3)
      .style("fill", "steelblue")

  function plotScatter(xtrait, ytrait) {
    dots.transition()
        .duration(1000)
        .attr("cx", function(d) { return xScales.scaleGet[xtrait](d); })
        .attr("cy", function(d) { return yScales.scaleGet[ytrait](d); })
  }

  return plotScatter
}


