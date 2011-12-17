scatter = {}

scatter.setupScatter = function (height, width, padding, mainDiv)  {
  // scales and scaled-getters
  this.xScales = getScales([0, width])
  this.yScales = getScales([height, 0])

  // chart
  var chart = d3.select(mainDiv)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + 2*padding)
      .attr("height", height + 2*padding);

  this.dots = chart.selectAll("circle")
      .data(data.values)
      .enter().append("circle")
      .attr("transform", "translate("+padding+","+padding+")")
      .attr("cx", width/2)
      .attr("cy", height/2)
      .attr("r", 3)
      .style("fill", "steelblue")
}

scatter.plotScatter = function(xtrait, ytrait) {
  if (!this.xtrait || this.xtrait == xtrait || this.ytrait == ytrait) {
    this.xtrait = xtrait
    this.ytrait = ytrait
  } else {
    this.xtrait = ytrait
    this.ytrait = xtrait
  }

  this.dots.transition()
      .duration(1000)
      .attr("cx", function(d) {
        return scatter.xScales.scaleGet[scatter.xtrait](d);
      })
      .attr("cy", function(d) {
        return scatter.yScales.scaleGet[scatter.ytrait](d);
      })
}

