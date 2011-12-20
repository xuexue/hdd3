function histogram(data, parent) {
  var histogram = {}
  histogram.setup = function(height, width, padding, trait) {
    this.width = width
    this.height = height
    this.padding = padding
    this.trait = trait
    // make a histogram object
    this.useddata = data.values.map(function(d) { return d[trait]; })
    this.hist = d3.layout.histogram()(this.useddata);
    // make the scales
    this.xScale = d3.scale.ordinal()
      .domain(this.hist.map(function(d) { return d.x; }))
      .rangeRoundBands([0, width]);
    this.yScale = d3.scale.linear()
      .domain([0, d3.max(this.hist, function(d) { return d.y; })])
      .range([0, height]);
    // calculate the percentiles of data, used for summary
    this.useddata.sort(function(a,b) { return a-b }) // sort data
    function percentile(p) {
      var idx = histogram.useddata.length*p - 1
      if (idx % 1 == 0) {
        return histogram.useddata[idx]
      }
      return (0.5*histogram.useddata[Math.ceil(idx)] +
              0.5*histogram.useddata[Math.floor(idx)])
    }
    // calculate the approximate magnitudes of data, used for rounding
    var min = this.useddata[0],
        max = this.useddata[this.useddata.length-1];
    var pow = -Math.floor(Math.log(max-min)/Math.log(10) -1)
    function round(x) {
      return pow >= 0 ? d3.round(x, pow).toFixed(pow) : d3.round(x, pow)
    }
    // ROUNDED and presentable summary data
    this.summary = {
      'min': round(min),
      'q1': round(percentile(0.25)),
      'med': round(percentile(0.5)),
      'q3': round(percentile(0.75)),
      'max': round(max) 
    }
    return histogram
  }

  histogram.plot = function(mainDiv) {
    this.plot = d3.select(mainDiv).append("svg:svg")
        .attr("width", this.width+2*this.padding)
        .attr("height", this.height+2*this.padding+30)
    // grouping
    this.plot.append("svg:g")
        .attr("transform", "translate("+this.padding+","+this.padding+")");
    // add the bars
    this.plot.selectAll("rect")
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
    // add x-axis line 
    this.plot.append("svg:line")
        .attr("x1", 0)
        .attr("x2", this.width)
        .attr("y1", this.height)
        .attr("y2", this.height)
        .style("stroke", "black")
    // add min and max
    this.plot.selectAll("axeslabel")
        .data(['min', 'max'])
        .enter().append("text")
        .attr("x", function(d) {
          return d=='max' ? histogram.width - histogram.padding/2 : histogram.padding/2
        })
        .attr("y", this.height + this.padding*.75)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(function(d) { return histogram.summary[d]})
    // add axis label
    this.plot.append("text")
        .attr("x", this.width/2)
        .attr("y", this.height + this.padding*1.25)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(this.trait)
    return histogram
  }

  histogram.plotsummary = function() {
    this.plot.attr("height", this.height+2*this.padding+30+50)

    var baseheight = this.height+2*this.padding+10
    this.plot.selectAll("summarytext")
        .data(['min', 'q1', 'med', 'q3', 'max'])
        .enter().append("text")
        .attr("x", this.width/2 - 40)
        .attr("y", function(d,i) { return baseheight+15*i })
        .attr("text-anchor", "right")
        .text(function(d) { return d+":" })

    this.plot.selectAll("summarytext")
        .data(['min', 'q1', 'med', 'q3', 'max'])
        .enter().append("text")
        .attr("x", this.width/2)
        .attr("y", function(d,i) { return baseheight+15*i })
        .attr("text-anchor", "right")
        .text(function(d) { return histogram.summary[d] })

    return histogram
  }


  return histogram
}
