// colour
var colour = {
  "main":"steelblue",
  "selector": "lightgreen",
  "drag" : "green",
  "active": "blue",
  "notbrushed" : "#AAAAAA"
}
colour.nav = function(d) {
  return d.active ? colour.active : colour.main
}

// load data in CSV
function loadCustomData(newdata) {
  var custom = {}
  custom.values = d3.csv.parse(newdata)
  // @TODO: check for null
  // There are a lot of things that could go wrong here...
  custom.traits = []
  for (var key in custom.values[0]) {
    if (key === 'length' || !custom.values[0].hasOwnProperty(key)) {
      continue;
    }
    if (key == 'category') {
      custom.category = []
    } else {
      custom.traits.push(key);
    }
  }
  // make an exhaustive list of possible "category" values
  if (custom.category) { //note [] evaluates to true in javascript =s
    for (var i=0; i<custom.values.length; i++) {
      var cat = custom.values[i].category
      if (custom.category.indexOf(cat) == -1) {
        custom.category.push(cat)
      }
    }
  }
  // parse to integer
  custom.values.forEach(function(d) {
    custom.traits.forEach(function(t) {
      d[t] = parseFloat(d[t])
    })
  })
  return custom
}

// wrap 
function wrapData(data) { 
  // getter and scale
  data.getScales = function(range) {
    var o = {
      scale: {},
      scaleGet: {}
    }
    data.traits.forEach(function(trait) {
      getter = function(d) { return d[trait] }
      domain = [d3.min(data.values, getter), d3.max(data.values, getter)]
      o.scale[trait] = d3.scale.linear().domain(domain).range(range)
      o.scaleGet[trait] = function(d) { return o.scale[trait](d[trait]) }
    });
    return o
  }
  // brushing
  data.deactivatePoints = function() {
    data.values.forEach(function(v) {
      v._active = false
    })
  }
  data.activatePoints = function() {
    data.values.forEach(function(v) {
      v._active = true
    })
  }
  data.activatePoints()
  // make colour scheme
  colour.scheme = d3.scale.category10(data.category)
  colour.point = function(d) {
    if (d._active) {
      return colour.scheme(d.category)
    }
    return colour.notbrushed
  }
  // function to draw a legend in the given div
  colour.legend = function(div) {
    if (data.category) {
      var legend = d3.select(div).append('div').attr("id", "legend")
      legend.text("Categories: ")
      legend.selectAll("legend")
        .data(data.category)
        .enter().append("span")
        .attr("class", "legend")
        .style("color", function(d) { return colour.scheme(d) })
        .text(function(d) { return d+" " })
    }
  }
  return data
}
