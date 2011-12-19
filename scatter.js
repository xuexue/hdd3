function scatter(data, parent) {
  var scatter = {}

  scatter.setup = function (height, width, padding)  {
    this.width = width
    this.height = height
    this.padding = padding
    // scales and scaled-getters
    this.xScales = data.getScales([padding, width+padding])
    this.yScales = data.getScales([height+padding, padding])
    // an identity scale used for brushing
    this.identityX = d3.scale.linear()
          .domain([padding, width+padding])
          .range([padding, width+padding])
    this.identityY = d3.scale.linear()
          .domain([height+padding, padding])
          .range([height+padding, padding])
    return scatter;
  }

  scatter.plot = function(mainDiv) {
    // chart
    this.chart = d3.select(mainDiv)
        .append("svg")
        .attr("class", "chart")
        .attr("width", this.width + 2*this.padding)
        .attr("height", this.height + 2*this.padding)

    this.dots = this.chart.selectAll("circle")
        .data(data.values)
        .enter().append("circle")
        .attr("cx", this.width/2)
        .attr("cy", this.height/2)
        .attr("r", 3)
        .style("fill", colour.point)

    this.brush = d3.svg.brush()
         .on("brushstart", brushstart)
         .on("brush", brushing)
         .on("brushend", brushend);
    this.brush.hasSelected = false
    function brushstart(p) {
      scatter.brush.hasSelected = false
      scatter.chart.selectAll("rect.extent").style("fill-opacity", 0.125)
    }
    // Highlight the selected circles.
    function brushing() {
      var e = scatter.brush.extent();
      data.deactivatePoints()
      data.values.forEach(function(d) {
        if (e[0][1] <= scatter.getY(d) &&
            e[1][1] >= scatter.getY(d) && 
            e[0][0] <= scatter.getX(d) &&
            e[1][0] >= scatter.getX(d)) {
          d._active= true
          scatter.brush.hasSelected = true
        }
      }); 
      parent.recolour()
    }
    // If the brush is empty, select all circles.
    function brushend(p) {
      if (!scatter.brush.hasSelected)  {
        data.activatePoints()
        parent.recolour()
      } else {
        scatter.chart.selectAll("rect.extent").style("fill-opacity", 0)
      }
    }
    return scatter;
  }

  scatter.recolour = function() {
    scatter.dots.style("fill", colour.point)
  }

  scatter.getX = null
  scatter.getY = null

  scatter.position = function(xtrait, ytrait, transition) {
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
    scatter.chart.call(scatter.brush.y(scatter.identityY).x(scatter.identityX))
    return scatter
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
    return scatter
  }

  return scatter;
}
