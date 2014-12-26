var gConfig = {};

var fs=require('fs');

var BackgroundImage=function(){var _0=require('./BackgroundImage');return _0.hasOwnProperty("BackgroundImage")?_0.BackgroundImage:_0.hasOwnProperty("default")?_0.default:_0}();
var parser=require('./parser');
var Puzzle=function(){var _1=require('./Puzzle');return _1.hasOwnProperty("Puzzle")?_1.Puzzle:_1.hasOwnProperty("default")?_1.default:_1}();


  function Sprites(csses) {
    if(csses===void 0)csses=[];this.csses = Array.isArray(csses) ? csses : [csses];
    this.puzzle = new Puzzle();
  }

  Sprites.prototype.parse = function(csses) {
    if(csses===void 0)csses=[];if(csses) {
      this.csses = Array.isArray(csses) ? csses : [csses];
    }
    //解析每个css文件的图片属性，赋值bgis上
    this.csses.forEach(function(css) {
      if(!css.hasOwnProperty('string')) {
        if(!css.hasOwnProperty('path')) {
          throw new Error('css file missing path when no string: ' + JSON.stringify(css));
        }
        css.string = fs.readFileSync(css.path, { encoding: 'utf-8' });
      }
      css.bgis = parser.bgis(css);
    });
    //拼图
    return this.puzzle.parse(this.csses);
  }

  Sprites.config=function(data) {
    if(data===void 0)data={};Object.keys(data).forEach(function(k) {
      gConfig[k] = data[k];
    });
  }
  Sprites.parse=function(csses) {
    return new Sprites().parse(csses);
  }


exports.default=Sprites;