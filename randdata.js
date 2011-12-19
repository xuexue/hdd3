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
var random = {
  'traits': ['x', 'y', 'z', 't', 'a'],
  'values' : d3.range(200).map(randpoint)
};
