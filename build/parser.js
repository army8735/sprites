var homunculus=require('homunculus');
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token');

var BackgroundImage=require('./BackgroundImage');
var join=require('./join');

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
var SIZE = {
  'auto': true,
  'cover': true,
  'right': true,
  'contain': true
};
var DP_RADIO = {
  'min-device-pixel-ratio': true,
  'min--moz-device-pixel-ratio': true
};

var history;

exports.bgis=bgis;function bgis(css) {
  history = {};
  var cssParser = homunculus.getParser('css');
  var ast = cssParser.parse(css.string);
  var res = recursion(ast);
  return res;
}

function recursion(node, res ) {
  if(res===void 0)res = [ ];var isToken = node.name() == CssNode.TOKEN;
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
      && HASH.hasOwnProperty(leaf.first().first().token().content().toLowerCase())) {
      style = leaf;
      key = style.first();
      value = style.leaf(2);
      copy = copy.slice(i + 1);
      break;
    }
  }
  history[style.nid()] = true;
  var hasP = key.first().token().content().toLowerCase() == 'background';
  var params = bgi(key, value, hasP);
  //background会覆盖掉前面的设置，background-image则不会，据此传入整个节点或后面兄弟节点
  repeat(params, hasP ? copy : leaves);
  position(params, hasP ? copy : leaves);
  size(params, leaves);
  media(params, block);
  return params;
}
function bgi(key, value, hasP) {
  var params = [];
  //仅background可能写repeat和position，background-image没有
  value.leaves().forEach(function(leaf) {
    if(leaf.name() == CssNode.URL) {
      var url = leaf.leaf(2).token();
      var param = { url: {
        'string': url.content(),
        'index': url.sIndex()
      }, repeat: [], position: [], units: [], size:[], sunits: [] };
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
              else {
                param.units.push(null);
              }
            }
            else {
              param.units.push(null);
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
    var style = leaves[i];
    if(style.name() == CssNode.STYLE) {
      var key = style.first();
      if(key.first().token().content().toLowerCase() == 'background-repeat') {
        var index = 0;
        var count = 0;
        var value = leaves[i].leaf(2);
        var param;
        value.leaves().forEach(function(leaf) {
          if(leaf.name() == CssNode.TOKEN) {
            var token = leaf.token();
            if(token.type() == Token.PROPERTY) {
              if(count % 2 == 0) {
                param = params[index++];
                param.repeat = [];
              }
              count++;
              param.repeat.push({
                'string': token.content(),
                'index': token.sIndex()
              });
            }
          }
        });
        break;
      }
    }
  }
}
function position(params, leaves) {
  //后面的background-position会覆盖掉前面的相应索引的url
  for(var i = leaves.length - 1; i > -1; i--) {
    var style = leaves[i];
    if(style.name() == CssNode.STYLE) {
      var key = style.first();
      if(key.first().token().content().toLowerCase() == 'background-position') {
        var index = 0;
        var count = 0;
        var value = leaves[i].leaf(2);
        var param;
        value.leaves().forEach(function(leaf) {
          if(leaf.name() == CssNode.TOKEN) {
            var token = leaf.token();
            var s = token.content().toLowerCase();
            if(token.type() == Token.NUMBER
              || POSITION.hasOwnProperty(s)) {
              if(count % 2 == 0) {
                param = params[index++];
                param.position = [];
                param.units = [];
              }
              count++;
              param.position.push({
                'string': token.content(),
                'index': token.sIndex()
              });
              var next = leaf.next();
              if(next && next.token().type() == Token.UNITS) {
                param.units.push({
                  'string': token.content(),
                  'index': token.sIndex()
                });
              }
              else {
                param.units.push(null);
              }
            }
          }
        });
        break;
      }
    }
  }
}

function size(params, leaves) {
  //后面的background-size会覆盖掉前面的
  for(var i = leaves.length - 1; i > -1; i--) {
    var style = leaves[i];
    if(style.name() == CssNode.STYLE) {
      var key = style.first();
      if(key.first().token().content().toLowerCase() == 'background-size') {
        var index = 0;
        var count = 0;
        var value = leaves[i].leaf(2);
        var param;
        value.leaves().forEach(function(leaf) {
          if(leaf.name() == CssNode.TOKEN) {
            var token = leaf.token();
            var s = token.content().toLowerCase();
            if(token.type() == Token.NUMBER
              || SIZE.hasOwnProperty(s)) {
              if(count % 2 == 0) {
                param = params[index++];
                param.size = [];
                param.sunits = [];
              }
              count++;
              param.size.push({
                'string': token.content(),
                'index': token.sIndex()
              });
              var next = leaf.next();
              if(next && next.token().type() == Token.UNITS) {
                param.sunits.push({
                  'string': token.content(),
                  'index': token.sIndex()
                });
              }
              else {
                param.sunits.push(null);
              }
            }
          }
        });
        break;
      }
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