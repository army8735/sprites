module homunculus from 'homunculus';
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token');

module BackgroundImage from './BackgroundImage';
module join from './join';

var HASH = {
  'background': true,
  'background-image': true
};
var REPEAT = {
  'repeat': true,
  'no-repeat': true,
  'repeat-x': true,
  'repeat-y': true,
  'round': true,
  'space': true
};
var POSITION = {
  'center': true,
  'left': true,
  'right': true,
  'bottom': true
};
var DP_RADIO = {
  'min-device-pixel-ratio': true,
  'min--moz-device-pixel-ratio': true
};

var history;

export function bgis(css) {
  history = {};
  var cssParser = homunculus.getParser('css');
  var ast = cssParser.parse(css.string);
  var res = recursion(ast);
  return res;
}

function recursion(node, res = []) {
  var isToken = node.name() == CssNode.TOKEN;
  if(!isToken) {
    node.leaves().forEach(function(leaf) {
      recursion(leaf, res);
    });
    if(node.name() == CssNode.URL) {
      var value = node.parent();
      if(value.name() == CssNode.VALUE) {
        var key = value.prev().prev();
        var s = key.first().token().content().toLowerCase();
        if(HASH.hasOwnProperty(s)) {
          var style = key.parent();
          //防止同一个background设置多个背景图重复
          if(!history.hasOwnProperty(style.nid())) {
            history[style.nid()] = true;
            var params = parse(style, key, value);
            params.forEach(function(param) {
              var bgi = new BackgroundImage(param);
              res.push(bgi);
            });
          }
        }
      }
    }
  }
  return res;
}

function parse(style, key, value) {
  var block = style.parent();
  var leaves = block.leaves();
  var i = leaves.indexOf(style, 1);
  var copy = leaves.slice(i + 1);
  //后面的background会覆盖掉前面的
  for(i = copy.length - 1; i > -1; i--) {
    var leaf = copy[i];
    if(leaf.name() == CssNode.STYLE
      && HASH.hasOwnProperty(leaf.first().token().content().toLowerCase())) {
      style = leaf;
      key = style.first();
      value = style.leaf(2);
      leaves = leaves.slice(i);
      break;
    }
  }
  history[style.nid()] = true;
  var params = bgi(key, value);
  repeat(params, leaves);
  position(params, leaves);
  media(params, style);
  return params;
}
function bgi(key, value) {
  var params = [];
  //仅background可能写repeat和position，background-image没有
  var hasP = key.first().token().content().toLowerCase() == 'background';
  value.leaves().forEach(function(leaf) {
    if(leaf.name() == CssNode.URL) {
      var url = leaf.leaf(2).token();
      var param = { url: {
        'string': url.content(),
        'index': url.sIndex()
      }, repeat: [], position: [], units: [] };
      if(hasP) {
        var next = leaf;
        while((next = next.next())
          && next.name() == CssNode.TOKEN) {
          var token = next.token();
          if(token.type() == Token.NUMBER) {
            param.position.push({
              'string': token.content(),
              'index': token.sIndex()
            });
            var units = next.next();
            if(units && units.name() == CssNode.TOKEN) {
              token = units.token();
              if(token.type() == Token.UNITS) {
                param.units.push({
                  'string': token.content(),
                  'index': token.sIndex()
                });
              }
            }
          }
          else if(token.type() == Token.PROPERTY) {
            var s = token.content().toLowerCase();
            if(REPEAT.hasOwnProperty(s)) {
              param.repeat.push({
                'string': token.content(),
                'index': token.sIndex()
              });
            }
          }
          else if(token.type() == Token.SIGN
            && [',', ';', '}'].indexOf(token.content()) > -1) {
            break;
          }
        }
      }
      params.push(param);
    }
  });
  return params;
}
function repeat(params, leaves) {
  //后面的background-repeat会覆盖掉前面的所有url
  for(var i = leaves.length - 1; i > -1; i--) {
    if(leaves[i].name().toLowerCase() == 'background-repeat') {
      var value = leaves[i].leaf(2);
      var rpx = value.first().token();
      var rpy = value.last().token();
      params.forEach(function(param) {
        param.repeat = [{
          'string': rpx.content(),
          'index': rpx.sIndex()
        }, {
          'string': rpy.content(),
          'index': rpy.sIndex()
        }];
      });
      break;
    }
  }
}
function position(params, leaves) {
  //后面的background-position会覆盖掉前面的相应索引的url
  for(var i = leaves.length - 1; i > -1; i--) {
    if(leaves[i].name().toLowerCase() == 'background-position') {
      var value = leaves[i].leaf(2);
      var index = 0;
      var index2 = 0;
      var param = params[index];
      value.leaves().forEach(function(leaf) {
        if(leaf.name() == CssNode.TOKEN) {
          var token = leaf.first().token();
          var s = token.content().toLowerCase();
          if(token.type() == Token.NUMBER
            || POSITION.hasOwnProperty(s)) {
            param.repeat[index2] = {
              'string': token.content(),
              'index': token.sIndex()
            };
            index2++;
          }
          else if(token.type() == Token.SIGN &&
            token.content() == ',') {
            param = params[++index];
            index2 = 0;
          }
        }
      });
      break;
    }
  }
}
function media(params, style) {
  var parent = style.parent();
  outer:
  while(parent = parent.parent()) {
    if(parent.name() == CssNode.MEDIA) {
      var mql = parent.leaf(1);
      var leaves = mql.leaves();
      for(var i = 0; i < leaves.length; i++) {
        var mq = leaves[i];
        var leaves2 = mq.leaves();
        for(var j = 0; j < leaves2.length; j++) {
          var expression = leaves2[j];
          if(expression.name() == CssNode.EXPR) {
            var key = expression.leaf(1);
            var value = expression.leaf(3);
            if(key && key.name() == CssNode.KEY
              && value && value.name() == CssNode.VALUE) {
              if(DP_RADIO.hasOwnProperty(key.last().token().content().toLowerCase())) {
                var val = join(value);
                try {
                  val = parseInt(val);
                  params.forEach(function(param) {
                    param.radio = val;
                  });
                  return;
                } catch(e) {
                  break outer;
                }
              }
            }
          }
        }
      }
    }
  }
  params.forEach(function(param) {
    param.radio = 1;
  });
}