scatter = {}

scatter.setup = function (height, width, padding, mainDiv)  {
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
      .style("fill", function(d) { return colour.point(d.category) })
}

scatter.plot = function(xtrait, ytrait, transition) {
  if (!this.xtrait || this.xtrait == xtrait || this.ytrait == ytrait) {
    this.xtrait = xtrait
    this.ytrait = ytrait
  } else {
    this.xtrait = ytrait
    this.ytrait = xtrait
  }

  this.dots.transition()
      .ease("linear")
      .duration(1000*transition)
      .attr("cx", function(d) {
        return scatter.xScales.scaleGet[scatter.xtrait](d);
      })
      .attr("cy", function(d) {
        return scatter.yScales.scaleGet[scatter.ytrait](d);
      })
}

scatter.interpolate = function(xtrait, ytrait, ratio, transition) {
  if (this.xtrait && (this.xtrait != xtrait && this.ytrait != ytrait)) {
    var tmp = ytrait
    ytrait = xtrait
    xtrait = tmp
  }

  this.dots.transition()
      .ease("linear")
      .duration(1000*transition)
      .attr("cx", function(d) {
        return (ratio*scatter.xScales.scaleGet[scatter.xtrait](d) + 
                (1-ratio)*scatter.xScales.scaleGet[xtrait](d)) ;
      })
      .attr("cy", function(d) {
        return (ratio*scatter.yScales.scaleGet[scatter.ytrait](d) + 
                (1-ratio)*scatter.yScales.scaleGet[ytrait](d)) ;
      })

}
