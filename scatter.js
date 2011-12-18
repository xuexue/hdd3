scatter = {}

scatter.setup = function (height, width, padding, mainDiv)  {
  // scales and scaled-getters
  this.xScales = getScales([padding, width+padding])
  this.yScales = getScales([height+padding, padding])

  this.identityX = d3.scale.linear()
        .domain([padding, width+padding])
        .range([padding, width+padding])
  this.identityY = d3.scale.linear()
        .domain([height+padding, padding])
        .range([height+padding, padding])

  // chart
  this.chart = d3.select(mainDiv)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + 2*padding)
      .attr("height", height + 2*padding);

  this.dots = this.chart.selectAll("circle")
      .data(data.values)
      .enter().append("circle")
      .attr("cx", width/2)
      .attr("cy", height/2)
      .attr("r", 3)
      .style("fill", colour.point)

  brush = d3.svg.brush()
       .on("brushstart", brushstart)
       .on("brush", brushing)
       .on("brushend", brushend);
  brush.hasSelected = false
  function brushstart(p) {
    brush.hasSelected = false
    scatter.chart.selectAll("rect.extent").style("fill-opacity", 0.125)
  }
  // Highlight the selected circles.
  function brushing() {
    var e = brush.extent();
    deactivatePoints()
    data.values.forEach(function(d) {
      if (e[0][1] <= scatter.getY(d) &&
          e[1][1] >= scatter.getY(d) && 
          e[0][0] <= scatter.getX(d) &&
          e[1][0] >= scatter.getX(d)) {
        d._active= true
        brush.hasSelected = true
      }
    }); 
    scatter.dots.style("fill", colour.point)
    parallel.replot();
  }
  // If the brush is empty, select all circles.
  function brushend(p) {
    if (!brush.hasSelected)  {
      activatePoints()
      scatter.dots.style("fill", colour.point)
      parallel.replot();
    } else {
      scatter.chart.selectAll("rect.extent").style("fill-opacity", 0)
    }
  }
}

scatter.getX = null
scatter.getY = null

scatter.plot = function(xtrait, ytrait, transition) {
  if (!this.xtrait || this.xtrait == xtrait || this.ytrait == ytrait) {
    this.xtrait = xtrait
    this.ytrait = ytrait
  } else {
    this.xtrait = ytrait
    this.ytrait = xtrait
  }

  scatter.getX =  function(d) {
    return scatter.xScales.scaleGet[scatter.xtrait](d);
  }
  scatter.getY = function(d) {
    return scatter.yScales.scaleGet[scatter.ytrait](d);
  }

  scatter.dots.transition()
      .ease("linear")
      .duration(1000*transition)
      .attr("cx", scatter.getX)
      .attr("cy", scatter.getY)
  scatter.chart.call(brush.y(scatter.identityY).x(scatter.identityX))
}

scatter.interpolate = function(xtrait, ytrait, ratio, transition) {
  if (this.xtrait && (this.xtrait != xtrait && this.ytrait != ytrait)) {
    var tmp = ytrait
    ytrait = xtrait
    xtrait = tmp
  }
  scatter.getX = function(d) {
    return (ratio*scatter.xScales.scaleGet[scatter.xtrait](d) + 
            (1-ratio)*scatter.xScales.scaleGet[xtrait](d)) ;
  }
  scatter.getY = function(d) {
    return (ratio*scatter.yScales.scaleGet[scatter.ytrait](d) + 
            (1-ratio)*scatter.yScales.scaleGet[ytrait](d)) ;
  }
  this.dots.transition()
      .ease("linear")
      .duration(1000*transition)
      .attr("cx", scatter.getX)
      .attr("cy", scatter.getY)
}


