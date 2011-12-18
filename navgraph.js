function navgraph(data) {
  navgraph = {}
  navgraph.data = data

  navgraph.scatter = scatter(data, navgraph)
  navgraph.parallel = parallel(data, navgraph)
  navgraph.nav = nav(data, navgraph)

  navgraph.recolour = function() {
    navgraph.scatter.recolour();
    navgraph.parallel.recolour();
  }

  // setup
  navgraph.scatter.setup(550, 550, 20, "#rightPanel");
  navgraph.parallel.setup(200,300,20, "#parallel");
  navgraph.nav.setup(200,200,80, "#navgraph");
  if (data.category) {
    legend = d3.select("#legend")
    legend.text("Categories: ")
    legend.selectAll("legend")
      .data(data.category)
      .enter().append("span")
      .attr("class", "legend")
      .style("color", function(d) { return colour.scheme(d) })
      .text(function(d) { return d+" " })
  }
  return navgraph
}

