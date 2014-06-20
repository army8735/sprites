var expect = require('expect.js');
var fs = require('fs');

var Sprites = require('../index');

describe('bgis test', function() {
  it('one background return one res', function() {
    var param = [{
      'string': 'p{background:url(x)}'
    }];
    var res = Sprites.parse(param);
    expect(res.length).to.eql(1);
    expect(res[0].bgis.length).to.eql(1);
  });
  it('one css can be an object too', function() {
    var param = {
      'string': 'p{background:url(x)}'
    };
    var res = Sprites.parse(param);
    expect(res.length).to.eql(1);
    expect(res[0].bgis.length).to.eql(1);
  });
  it('only background should has no repeat,position,units', function() {
    var param = [{
      'string': 'p{background:url(x)}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(0);
    expect(res.position.length).to.eql(0);
    expect(res.units.length).to.eql(0);
  });
  it('background with 1 repeat', function() {
    var param = [{
      'string': 'p{background:url(x) no-repeat}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(1);
    expect(res.position.length).to.eql(0);
    expect(res.units.length).to.eql(0);
  });
  it('background with 2 repeat', function() {
    var param = [{
      'string': 'p{background:url(x) no-repeat no-repeat}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(2);
    expect(res.repeat[1]).to.not.eql(res.repeat[0]);
    expect(res.position.length).to.eql(0);
    expect(res.units.length).to.eql(0);
  });
  it('background with 1 position', function() {
    var param = [{
      'string': 'p{background:url(x) 0}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(0);
    expect(res.position.length).to.eql(1);
    expect(res.units.length).to.eql(0);
  });
  it('background with 2 position', function() {
    var param = [{
      'string': 'p{background:url(x) 0 0}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(0);
    expect(res.position.length).to.eql(2);
    expect(res.units.length).to.eql(0);
  });
  it('background with 1 units', function() {
    var param = [{
      'string': 'p{background:url(x) 0px}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(0);
    expect(res.position.length).to.eql(1);
    expect(res.units.length).to.eql(1);
  });
  it('background with 2 units', function() {
    var param = [{
      'string': 'p{background:url(x) 0px 0px}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.repeat.length).to.eql(0);
    expect(res.position.length).to.eql(2);
    expect(res.units.length).to.eql(2);
  });
  it('no media should has 1x radio', function() {
    var param = [{
      'string': 'p{background:url(x)}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.radio).to.eql(1);
  });
  it('media min-device-pixel-ratio should be the radio', function() {
    var param = [{
      'string': '@media (-webkit-min-device-pixel-ratio: 2){p{background:url(x)}}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.radio).to.eql(2);
  });
  it('media min-device-pixel-ratio hack', function() {
    var param = [{
      'string': '@media (min--moz-device-pixel-ratio: 2/1){p{background:url(x)}}'
    }];
    var res = Sprites.parse(param)[0].bgis[0];
    expect(res.radio).to.eql(2);
  });
});