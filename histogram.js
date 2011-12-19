function histogram(data) {
  var histogram = {}
  histogram.setup = function(height, width, padding, trait) {
    this.width = width
    this.height = height
    this.padding = padding
    this.trait = trait
    this.hist = d3.layout.histogram()
      (data.values.map(function(d) { return d[trait]; }));
    this.xScale = d3.scale.ordinal()
      .domain(this.hist.map(function(d) { return d.x; }))
      .rangeRoundBands([0, width]);
    this.yScale = d3.scale.linear()
      .domain([0, d3.max(this.hist, function(d) { return d.y; })])
      .range([0, height]);
    return histogram
  }

  histogram.plot = function(mainDiv) {
    var vis = d3.select(mainDiv).append("svg:svg")
        .attr("width", this.width+2*this.padding)
        .attr("height", this.height+2*this.padding+10)
      .append("svg:g")
        .attr("transform", "translate("+this.padding+","+this.padding+")");

    vis.selectAll("rect")
        .data(this.hist)
      .enter().append("svg:rect")
        .attr("transform", function(d) {
          return "translate(" + histogram.xScale(d.x) + "," + (histogram.height - histogram.yScale(d.y)) + ")";
        })
        .attr("width", this.xScale.rangeBand())
        .attr("y", 0)
        .attr("height", function(d) { return histogram.yScale(d.y); })
        .style("stroke", "white")
        .style("fill", colour.scheme(this.trait))
     
    vis.append("svg:line")
        .attr("x1", 0)
        .attr("x2", this.width)
        .attr("y1", this.height)
        .attr("y2", this.height)
        .style("stroke", "black")

    vis.append("text")
        .attr("x", this.width/2)
        .attr("y", this.height + this.padding)
        .attr("text-anchor", "middle")
        .text(this.trait)
    return histogram
  }
  return histogram
}
