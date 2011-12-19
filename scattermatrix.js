function scattermatrix(data) {
  var smatrix = {}
  data = wrapData(data)
  smatrix.data = data

  var width = height = 800;
  var eachSize = width/data.traits.length;

  var pairs = []
  for (var i=0; i<data.traits.length; i++) {
    for (var j=0; j<data.traits.length; j++) {
      pairs.push([i,j])
    }
  }
  d3.select("#graphic").html("")

  smatrix.scatters = []

  for (var i=0; i<pairs.length; i++) {
    var plot = scatter(data, smatrix).setup(eachSize, eachSize, 10)
      .plot('#graphic') .frame()
      .position(data.traits[pairs[i][1]],data.traits[pairs[i][0]], 0.5)
    // add label on diagonal
    if (pairs[i][0] == pairs[i][1]) {
      plot.label(data.traits[pairs[i][0]])
    }
    // y-axis on the right side
    if ((i+1) % data.traits.length == 0) {
      plot.yAxis("right")
    }
    // x-axis at bottom
    if (i >= data.traits.length*(data.traits.length-1)) {
      plot.xAxis("bottom")
    }
    smatrix.scatters.push(plot);
  }

  smatrix.recolour = function() {
    smatrix.scatters.forEach(function(s) { s.recolour(); });
  }
}
