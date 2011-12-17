  // generate random data
  function randpoint() {
    return {
      x:Math.random()*5,
      y:Math.random(),
      z:Math.random()*3,
      t:Math.random()*7,
      a:Math.random()*4,
    }
  }
  var data = {
    'traits': ['x', 'y', 'z', 't', 'a'],
    'category': 1,
    'values' : d3.range(50).map(randpoint)
  };

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

