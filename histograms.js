function histograms(data) {
  var histograms={}
  data = wrapData(data)
  histograms.data = data

  var eachSize = 250
  d3.select("#graphic").html("")
  
  data.traits.forEach(function(trait) {
    histogram(data).setup(eachSize, eachSize,20,trait).plot("#graphic")
  });

  return histograms
}
