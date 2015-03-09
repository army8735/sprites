var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

var Sprites = require('../index');
var Parser = require('../build/Parser').default;
var Puzzle = require('../build/Puzzle').default;

describe('Parser', function() {
  var s = fs.readFileSync(path.join(__dirname, './parser.css'), { encoding: 'utf-8' });
  var arr = s.split('\n\n');

  it('no w/h, no repeat, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[0]
    });
    expect(res).to.eql([{"url":"a.png","开始":21,"结束":28,"倍率":1,"重复":"no-repeat","插入位置":29,"宽":-1,"高":-1}]);
  });

  it('no w/h, repeat, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[1]
    });
    expect(res).to.eql([]);
  });

  it('no w/h, no-repeat, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[2]
    });
    expect(res).to.eql([{"url":"c.png","开始":21,"结束":28,"倍率":1,"重复":"no-repeat","插入位置":29,"宽":-1,"高":-1}]);
  });

  it('no w/h, repeat-x, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[3]
    });
    expect(res).to.eql([{"url":"d.png","开始":21,"结束":28,"倍率":1,"重复":"repeat-x","插入位置":29,"宽":-1,"高":-1}]);
  });

  it('no w/h, repeat-y, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[4]
    });
    expect(res).to.eql([{"url":"e.png","开始":21,"结束":28,"倍率":1,"重复":"repeat-y","插入位置":29,"宽":-1,"高":-1}]);
  });

  it('no w/h, no-repeat, pos, fixed', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[5]
    });
    expect(res).to.eql([]);
  });

  it('no w/h, no-repeat, no pos, fixed', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[6]
    });
    expect(res).to.eql([{"url":"g.png","开始":21,"结束":28,"倍率":1,"重复":"no-repeat","插入位置":29,"宽":-1,"高":-1}]);
  });

  it('no w/h, no-repeat, pos, fixed', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[7]
    });
    expect(res).to.eql([]);
  });

  it('no w/h, no-repeat, no pos, background-image', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[8]
    });
    expect(res).to.eql([]);
  });

  it('w/h, no-repeat, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[9]
    });
    expect(res).to.eql([{"url":"j.png","开始":21,"结束":28,"倍率":1,"重复":"no-repeat","插入位置":29,"宽":10,"高":10}]);
  });

  it('no w/h, no-repeat, no pos, hack', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[10]
    });
    expect(res).to.eql([]);
  });

  it('no w/h, no-repeat, no pos, radio 1', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[11]
    });
    expect(res).to.eql([{"url":"l.png","开始":69,"结束":76,"倍率":1,"重复":"no-repeat","插入位置":77,"宽":-1,"高":-1}]);
  });

  it('no w/h, no-repeat, no pos, radio 2', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[12]
    });
    expect(res).to.eql([{"url":"m.png","开始":69,"结束":76,"倍率":2,"重复":"no-repeat","插入位置":77,"宽":-1,"高":-1}]);
  });

  it('no w/h, no-repeat, no pos, radio 3', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[13]
    });
    expect(res).to.eql([{"url":"n.png","开始":71,"结束":78,"倍率":3,"重复":"no-repeat","插入位置":79,"宽":-1,"高":-1}]);
  });

  it('no w/h, no-repeat, no pos, no-radio', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[14]
    });
    expect(res).to.eql([{"url":"n.png","开始":42,"结束":49,"倍率":1,"重复":"no-repeat","插入位置":50,"宽":-1,"高":-1}]);
  });

  it('w 0, no-repeat, no pos', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[15]
    });
    expect(res).to.eql([]);
  });

  it('base64', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[16]
    });
    expect(res).to.eql([]);
  });

  it('http', function() {
    var parser = new Parser();
    var res = parser.解析({
      '内容': arr[17]
    });
    expect(res).to.eql([]);
  });
});

describe('Sprites', function() {
  it('file', function() {
    var css = [{
      '路径': path.join(__dirname, './file/1.css')
    }];
    var sprites = new Sprites(css);
    sprites.写根路径(__dirname);
    expect(sprites.读根路径()).to.eql(__dirname);
    var ret = sprites.解析();
    expect(ret.length).to.eql(3);
    //fs.writeFileSync(path.join(__dirname, './img/join0.png'), ret[0].图像);
    //fs.writeFileSync(path.join(__dirname, './img/join1.png'), ret[1].图像);
    //fs.writeFileSync(path.join(__dirname, './img/join2.png'), ret[2].图像);
    var join0 = fs.readFileSync(path.join(__dirname, './img/join0.png'));
    var join1 = fs.readFileSync(path.join(__dirname, './img/join1.png'));
    var join2 = fs.readFileSync(path.join(__dirname, './img/join2.png'));
    expect(ret[0].图像).to.eql(join0);
    expect(ret[1].图像).to.eql(join1);
    expect(ret[2].图像).to.eql(join2);
    var res = sprites.替换(['../img/join0.png', '../img/join1.png', '../img/join2.png']);
    //fs.writeFileSync(path.join(__dirname, './file/2.css'), res[0], { encoding: 'utf-8' });
    expect(res).to.eql([fs.readFileSync(path.join(__dirname, './file/2.css'), { encoding: 'utf-8' })]);
  });
  it('new kw', function() {
    Sprites.添加关键字('army');
    var parser = new Parser();
    var res = parser.解析({
      '内容': 'div{army:1;background:url(xxx) no-repeat;}'
    });
    expect(res).to.eql([{"url":"xxx","开始":26,"结束":29,"倍率":1,"重复":"no-repeat","插入位置":30,"宽":-1,"高":-1}]);
  });
});