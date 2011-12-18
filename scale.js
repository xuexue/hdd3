// getter and scale
function getScales(range) {
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

var colour = {
  "main":"steelblue",
  "selector": "lightgreen",
  "drag" : "green",
  "active": "blue",
}
colour.nav = function(d) {
  if (d.active) {
    return colour.active
  }
  return colour.main
}

if (!data.category) {
  colour.point = function(d) { return colour.main }
} else if (data.category.length <= 10) {
  colour.point = d3.scale.category10(data.category)
} else {
  colour.point = d3.scale.category20(data.category)
}


