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


