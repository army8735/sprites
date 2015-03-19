var homunculus=require('homunculus');
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token', 'css');


  function Parser() {
    this.列表 = [];
  }

  Parser.prototype.解析 = function(css) {
    var 解析器 = homunculus.getParser('css');
    var 语法树 = 解析器.parse(css.内容);
    this.递归(语法树, 1);
    return this.列表;
  }
  Parser.prototype.递归 = function(节点, 倍率) {
    var 自己 = this;
    if(!节点.isToken()) {
      switch(节点.name()) {
        case CssNode.MEDIA:
          倍率 = 自己.获取倍率(节点.leaf(1));
          break;
        case CssNode.STYLE:
          //识别规律必须是简写background，且无前缀hack，分开写background-image忽略
          if(节点.first().first().token().content().toLowerCase() == 'background') {
            自己.分析背景(节点, 倍率);
          }
          break;
      }
      节点.leaves().forEach(function(子节点) {
        自己.递归(子节点, 倍率);
      });
    }
  }
  Parser.prototype.获取倍率 = function(节点) {
    if(节点.name() == CssNode.MEDIAQLIST) {
      for(var i = 0, len = 节点.size(); i < len; i += 2) {
        var 子节点 = 节点.leaf(i);
        if(子节点.name() == CssNode.MEDIAQUERY) {
          for(var j = 0, len2 = 子节点.size(); j < len2; j++) {
            var 表达式 = 子节点.leaf(j);
            if(表达式.name() == CssNode.EXPR) {
              var 键 = 表达式.leaf(1);
              if(键.last().token().content().toLowerCase().indexOf('device-pixel-ratio') > -1) {
                var 值 = 表达式.leaf(3);
                return Math.ceil(parseFloat(值.first().token().content())) || 1;
              }
            }
          }
        }
      }
    }
    return 1;
  }
  Parser.prototype.分析背景 = function(节点, 倍率) {
    //此选择器必须有width和height属性，且为px，否则忽略
    var 父节点 = 节点.parent();
    //高宽可以省略，默认-1
    var 宽 = -1;
    var 高 = -1;
    //边距可以为0
    var 边距上 = 0;
    var 边距右 = 0;
    var 边距下 = 0;
    var 边距左 = 0;
    //遍历同级样式节点
    父节点.leaves().forEach(function(样式节点) {
      //忽略非style节点，如{}
      if(样式节点.name() != CssNode.STYLE) {
        return;
      }
      var 键 = 样式节点.first().first().token().content().toLowerCase();
      var 值节点 = 样式节点.leaf(2);
      //仅支持px
      switch(键) {
        case 'width':
          if(值节点.size() > 1) {
            宽 = 值节点.leaf(1).token().content().toLowerCase() == 'px' ?
              parseInt(值节点.first().token().content()) : -1;
          }
          else {
            宽 = 0;
          }
          break;
        case 'height':
          if(值节点.size() > 1) {
            高 = 值节点.leaf(1).token().content().toLowerCase() == 'px' ?
              parseInt(值节点.first().token().content()) : -1;
          }
          else {
            高 = 0;
          }
          break;
        case 'padding':
          var 值 = [];
          //遍历，按上右下左顺序进行，如果单位不为px，则视为0
          值节点.leaves().forEach(function(node) {
            var token = node.token();
            if(token.type() == Token.NUMBER) {
              var next = node.next().token();
              if(next.type() == Token.UNITS) {
                if(next.content() == 'px') {
                  值.push(parseInt(token.content()));
                  return;
                }
              }
              值.push(0);
            }
          });
          //2种缩写
          if(值.length == 1) {
            边距上 = 边距右 = 边距下 = 边距左 = 值[0];
          }
          else if(值.length == 2) {
            边距上 = 边距下 = 值[0];
            边距右 = 边距左 = 值[1];
          }
          else if(值.length == 3) {
            边距上 = 值[0];
            边距右 = 边距左 = 值[1];
            边距下 = 值[2];
          }
          else if(值.length == 4) {
            边距上 = 值[0];
            边距右 = 值[1];
            边距下 = 值[2];
            边距左 = 值[3];
          }
          break;
        case 'padding-top':
          if(值节点.size() > 1) {
            边距上 = 值节点.leaf(1).token().content().toLowerCase() == 'px' ?
              parseInt(值节点.first().token().content()) : -1;
          }
          else {
            边距上 = 0;
          }
          break;
        case 'padding-right':
          if(值节点.size() > 1) {
            边距右 = 值节点.leaf(1).token().content().toLowerCase() == 'px' ?
              parseInt(值节点.first().token().content()) : -1;
          }
          else {
            边距右 = 0;
          }
          break;
        case 'padding-bottom':
          if(值节点.size() > 1) {
            边距下 = 值节点.leaf(1).token().content().toLowerCase() == 'px' ?
              parseInt(值节点.first().token().content()) : -1;
          }
          else {
            边距下 = 0;
          }
          break;
        case 'padding-left':
          if(值节点.size() > 1) {
            边距左 = 值节点.leaf(1).token().content().toLowerCase() == 'px' ?
              parseInt(值节点.first().token().content()) : -1;
          }
          else {
            边距左 = 0;
          }
          break;
      }
    });
    //0高宽忽略
    if(!宽 || !高) {
      return;
    }
    //遍历background的值节点，简写的url后面必须标明repeat且无position，否则忽略
    var 值节点 = 节点.leaf(2);
    for(var i = 0, len = 值节点.size(); i < len; i++) {
      var 子节点 = 值节点.leaf(i);
      if(子节点.name() == CssNode.URL) {
        //无视使用base64、线上路径
        var url节点 = 子节点.leaf(2);
        if(/^(data:|http:|https:|ftp:)/i.test(url节点.token().val())) {
          return;
        }
        //repeat类型的也忽略
        var repeat节点 = 子节点.next();
        if(repeat节点 && !{
            'no-repeat': true,
            'repeat-x': true,
            'repeat-y': true
          }.hasOwnProperty(repeat节点.token().content().toLowerCase())) {
          return;
        }
        var 位置节点 = (repeat节点 || 子节点).next();
        //可能存在的attachment节点需忽略
        if(位置节点
          && 位置节点.name() == CssNode.TOKEN
          && {
            'fixed': true,
            'scroll': true
          }.hasOwnProperty(位置节点.token().content().toLowerCase())) {
          位置节点 = 位置节点.next();
        }
        if(位置节点
          && 位置节点.name() == CssNode.TOKEN
          && 位置节点.token().type() == Token.NUMBER) {
          return;
        }
        this.记录(url节点, 倍率, repeat节点, 宽, 高, 边距上, 边距右, 边距下, 边距左);
        return;
      }
    }
  }
  Parser.prototype.记录 = function(url节点, 倍率, repeat节点, 宽, 高, 边距上, 边距右, 边距下, 边距左) {
    var token = url节点.token();
    var 右括号 = url节点.parent().last().token();
    this.列表.push({
      'url': token.val(),
      '开始': token.sIndex(),
      '结束': token.sIndex() + token.content().length,
      '倍率': 倍率,
      '重复': repeat节点 ? repeat节点.token().content().toLowerCase() : 'no-repeat',
      '插入位置': 右括号.sIndex() + 右括号.content().length,
      '宽': 宽 > 0 ? 宽 * 倍率 : 宽,
      '高': 高 > 0 ? 高 * 倍率 : 高,
      '边距上': 边距上 > 0 ? 边距上 * 倍率 : 边距上,
      '边距右': 边距右 > 0 ? 边距右 * 倍率 : 边距右,
      '边距下': 边距下 > 0 ? 边距下 * 倍率 : 边距下,
      '边距左': 边距左 > 0 ? 边距左 * 倍率 : 边距左
    });
  }


exports.default=Parser;