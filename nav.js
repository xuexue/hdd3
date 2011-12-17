Array.prototype.intersects = function(search){
  for (var i=0; i<this.length; i++)
    for (var j=0; j<search.length; j++)
      if (this[i] == search[j]) return true;
  return false;
} 

function generateGraph(width, height) {
  var nodes = [],
      edges = [],
      ntraits = data.traits.length,
      numNodes = ntraits * (ntraits-1) / 2

  var k = 0
  for (var i = 0; i < ntraits; i++) {
    for (var j = i+1; j < ntraits; j++) {
      // push the node identifying pairs of coordinates
      var node = {
        id: k,
        name: data.traits[i]+':'+data.traits[j],
        traits: [data.traits[i], data.traits[j]],
        x: Math.cos(2*Math.PI*k/numNodes),
        y: Math.sin(2*Math.PI*k/numNodes),
      }
      nodes.push(node)
      // push each edge where 2 nodes share at least one trait
      for (var l = 0; l < k; l++) {
        var otherNode = nodes[l]
        if (node.traits.intersects(otherNode.traits)) {
          edges.push({ source: node, target: otherNode });
        }
      }
      k += 1
    }
  }
  return { nodes:nodes, edges:edges }
}

function setupNav(height, width, padding, mainDiv) {
  graph = generateGraph(width, height)

  var nav = d3.select(mainDiv).append("svg")
      .attr("width", width + 2*padding)
      .attr("height", height + 2*padding);

  function scale(a, shift, length) {
    if (!length) {
      length = shift
    }
    return a*length/2 + shift/2;
  }

  var node = nav.selectAll("circle.node")
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("transform", "translate("+padding+","+padding+")")
        .attr("cx", function(d) { return scale(d.x, width); })
        .attr("cy", function(d) { return scale(d.y, height); })
        .attr("r", 15)
        .style("fill", "steelblue")

  var edges = nav.selectAll("line.link")
        .data(graph.edges)
      .enter().append("line")
        .attr("class", "link")
        .attr("transform", "translate("+padding+","+padding+")")
        .attr("x1", function(d) { return scale(d.source.x, width); })
        .attr("y1", function(d) { return scale(d.source.y, height); })
        .attr("x2", function(d) { return scale(d.target.x, width); })
        .attr("y2", function(d) { return scale(d.target.y, height); })
        .style("stroke-width", 2)
        .style("fill", "steelblue")
        .style("stroke", "steelblue")

  var labels = nav.selectAll("labeltext")
        .data(graph.nodes)
      .enter().append("text")
        .attr("class", "text")
        .attr("transform", "translate("+padding+","+(padding+3)+")")
        .attr("x", function(d) { return scale(d.x, width, width+45)})
        .attr("y", function(d) { return scale(d.y, height, height+45)})
        .text(function(d) { return d.name })
        .attr("text-anchor", "middle")

  var selector = nav.selectAll("selectornode")
        .data([1])
      .enter().append("circle")
        .attr("class", "node")
        .attr("transform", "translate("+padding+","+padding+")")
        .attr("cx", scale(1, width))
        .attr("cy", scale(0, height))
        .attr("r", 13)
        .style("fill", "lightblue")

}
