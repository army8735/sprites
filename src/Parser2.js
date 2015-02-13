module homunculus from 'homunculus';
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token', 'css');

class Parser {
  constructor() {
  }

  解析(css) {
    var 解析器 = homunculus.getParser('css');
    var 语法树 = 解析器.parse(css.内容);
    this.递归(语法树, 1);
  }
  递归(节点, 倍率) {
    var 自己 = this;
    if(!节点.isToken()) {
      switch(节点.name()) {
        case CssNode.MEDIA:
          倍率 = 自己.获取倍率(节点.leaf(1));
          break;
        case CssNode.STYLE:
          break;
      }
      节点.leaves().forEach(function(子节点) {
        自己.递归(子节点, 倍率);
      });
    }
  }
  获取倍率(节点) {
    if(节点.name() == CssNode.MEDIAQLIST) {
      for(var i = 0, len = 节点.size(); i < len; i += 2) {
        var 子节点 = 节点.leaf(i);
        if(子节点.name() == CssNode.MEDIAQUERY) {
          for(var j = 0, len2 = 子节点.size(); j < len2; j++) {
            var 表达式 = 子节点.leaf(j);
            if(表达式.name() == CssNode.EXPR) {
              var 键 = 表达式.leaf(1);
              if(键.last().content().toLowerCase().indexOf('device-pixel-ratio') > -1) {
                var 值 = 表达式.leaf(3);
                return parseInt(值.content()) || 1;
              }
            }
          }
        }
      }
    }
    return 1;
  }
}