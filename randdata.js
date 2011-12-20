// generate random data
function randpoint() {
  return {
    x:Math.random()*5,
    y:Math.random(),
    z:Math.random()*3,
    t:Math.random()*7,
    a:Math.random()*4,
    b:Math.random()*4,
    c:Math.random()*4,
    d:Math.random()*4,
    e:Math.random()*4,
    f:Math.random()*4,
  }
}
var random = {
  'traits': ['x', 'y', 'z', 't', 'a', 'b', 'c', 'd', 'e', 'f'],
  'values' : d3.range(500).map(randpoint)
};
