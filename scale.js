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

