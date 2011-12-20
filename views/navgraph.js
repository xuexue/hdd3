function navgraph(data) {
  var navgraph = {}
  data = wrapData(data)
  navgraph.data = data

  navgraph.scatter = scatter(data, navgraph)
  navgraph.parallel = parallel(data, navgraph)
  navgraph.nav = nav(data, navgraph)

  navgraph.recolour = function() {
    navgraph.scatter.recolour();
    navgraph.parallel.recolour();
  }

  // setup
  d3.select("#graphic").html(
      '<div id="leftPanel">' +
        '<div id="nav"></div>' +
        '<div id="parallel"></div>' +
      '</div>' +
      '<div id="rightPanel">' +
      '</div>');

  navgraph.scatter.setup(550, 550, 20)
                  .plot('#rightPanel')
  navgraph.parallel.setup(200,300,20)
                   .plot('#parallel');
  navgraph.nav.setup(200,200,80).plot("#nav");
  colour.legend('#leftPanel')
  return navgraph;
}

