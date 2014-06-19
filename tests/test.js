var expect = require('expect.js');
var fs = require('fs');

var Sprites = require('../index');

describe('bgis test', function() {
  it('one background return one res', function() {
    var param = [{
      'string': 'p{background:url(x)}'
    }];
    var res = Sprites.parse(param);console.log(res[0]);
    expect(res.length).to.eql(1);
  });
  it('one css can be an object too', function() {
    var param = {
      'string': 'p{background:url(x)}'
    };
    var res = Sprites.parse(param);console.log(res[0]);
    expect(res.length).to.eql(1);
  });
});