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

  colour.scheme = d3.scale.category10(data.category)
  colour.point = function(d) {
    if (d._active) {
      return colour.scheme(d.category)
    }
    return colour.notbrushed
  }

  return data
}
