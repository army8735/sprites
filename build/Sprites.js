var fs=require('fs');

var Parser=function(){var _0=require('./Parser');return _0.hasOwnProperty("Parser")?_0.Parser:_0.hasOwnProperty("default")?_0.default:_0}();
var Puzzle=function(){var _1=require('./Puzzle');return _1.hasOwnProperty("Puzzle")?_1.Puzzle:_1.hasOwnProperty("default")?_1.default:_1}();


  function Sprites(css列表, 映射, 根路径, 间距) {
    if(映射===void 0)映射=null;if(根路径===void 0)根路径='';if(间距===void 0)间距=10;this.css列表 = Array.isArray(css列表) ? css列表 : [css列表];
    this.映射 = 映射;
    this.根路径 = 根路径;
    this.间距 = 间距;
  }

  //一个项目所有需要处理的css数据通过列表传入
  Sprites.prototype.解析 = function() {
    var 解析器 = new Parser();

    //遍历处理每个，解析全部后进行合并图片步骤
    this.css列表.forEach(function(css) {
      if(!css.hasOwnProperty('内容')) {
        if(!css.hasOwnProperty('路径')) {
          throw new Error('css没有内容也没有可读取路径：' + JSON.stringify(css));
        }
        css.内容 = fs.readFileSync(css.路径, { encoding: 'utf-8' });
      }
      css.背景列表 = 解析器.解析(css);
    });

    var 拼图 = new Puzzle(this.css列表, this.读根路径(), this.读映射());
    return 拼图.解析(this.读间距());
  }

  Sprites.prototype.读映射 = function() {
    return this.映射;
  }
  Sprites.prototype.写映射 = function(映射) {
    this.映射 = 映射;
    return this.映射;
  }

  Sprites.prototype.读根路径 = function() {
    return this.根路径;
  }
  Sprites.prototype.写根路径 = function(根路径) {
    this.根路径 = 根路径;
    return this.根路径;
  }

  Sprites.prototype.读间距 = function() {
    return this.间距;
  }
  Sprites.prototype.写间距 = function(间距) {
    this.间距 = 间距;
    return this.间距;
  }


exports.default=Sprites;