var homunculus=require('homunculus');
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token', 'css');

var BackgroundImage=function(){var _0=require('./BackgroundImage');return _0.hasOwnProperty("BackgroundImage")?_0.BackgroundImage:_0.hasOwnProperty("default")?_0.default:_0}();
var join=function(){var _1=require('./join');return _1.hasOwnProperty("join")?_1.join:_1.hasOwnProperty("default")?_1.default:_1}();
var media=function(){var _2=require('./media');return _2.hasOwnProperty("media")?_2.media:_2.hasOwnProperty("default")?_2.default:_2}();
var prepare=function(){var _3=require('./prepare');return _3.hasOwnProperty("prepare")?_3.prepare:_3.hasOwnProperty("default")?_3.default:_3}();
var property=require('./property');

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

exports.bgis=bgis;function bgis(css) {
  var history = {};
  var cssParser = homunculus.getParser('css');
  var ast = cssParser.parse(css.string);
  var pre = prepare(ast);
  var res = recursion(ast, pre, history, 1, []);
  return res;
}

function recursion(node, pre, history, radio, res) {
  var isToken = node.isToken();
  if(!isToken) {
    switch(node.name()) {
      case CssNode.URL:
        var value = node.parent();
        if(value.name() == CssNode.VALUE) {
          var key = value.prev().prev();
          var s = key.first().token().content().toLowerCase();
          if(HASH.hasOwnProperty(s)) {
            var style = key.parent();
            //防止同一个background设置多个背景图重复
            if(!history.hasOwnProperty(style.nid())) {
              history[style.nid()] = true;
              var params = parse(style, key, value, pre, history, radio);
              params.forEach(function(param) {
                var backgroundImage = new BackgroundImage(param);
                res.push(backgroundImage);
              });
            }
          }
        }
        break;
      case CssNode.MEDIA:
        radio = media(node);
        break;
    }
    node.leaves().forEach(function(leaf) {
      recursion(leaf, pre, history, radio, res);
    });
  }
  return res;
}

function parse(style, key, value, pre, history, radio) {
  var block = style.parent();
  var leaves = block.leaves();
  var i = leaves.indexOf(style, 1);
  var copy = leaves.slice(i + 1, leaves.length - 1);
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
  //是否background-position
  var hasP = key.first().token().content().toLowerCase() == 'background';
  var params = bgi(value, hasP, radio);
  //background会覆盖掉前面的设置，background-image则不会，据此传入整个节点或后面兄弟节点
  repeat(params, hasP ? copy : leaves);
  position(params, hasP ? copy : leaves);
  size(params, leaves);
  //其它属性值
  var w = property.cal(leaves, 'width');
  var h = property.cal(leaves, 'height');
  var mw = property.cal(leaves, 'max-width');
  var mh = property.cal(leaves, 'max-height');
  var pd = property.cal(leaves, 'padding');
  var pdt = property.cal(leaves, 'padding-top');
  var pdr = property.cal(leaves, 'padding-right');
  var pdb = property.cal(leaves, 'padding-bottom');
  var pdl = property.cal(leaves, 'padding-left');
  //如果w或h等为%或没有，自动计算父类继承下来的实际px尺寸，只限绝对继承和单选择器
  //如：p a{width:100px} p a span{width:100%}将继承
  //但：p a{width:100px} a span{width:100%}不被继承
  //但：p a{width:100px} p a span,p span{width:100%}也不被继承，因为多选择器会出现多继承歧义，处理比较麻烦
  var selectors = block.prev();
  if(selectors.size() == 1) {
    var selector = selectors.first();
    if(!w || w.units && w.units.string == '%') {
      w = property.extend(pre, selector, 'width', w, radio);
    }
    if(!h || h.units && h.units.string == '%') {
      h = property.extend(pre, selector, 'height', h, radio);
    }
    if(!mw || mw.units && mw.units.string == '%') {
      mw = property.extend(pre, selector, 'max-width', mw, radio);
    }
    if(!mh || mh.units && mh.units.string == '%') {
      mh = property.extend(pre, selector, 'max-height', mh, radio);
    }
    //padding空不继承，但%继承
    if(pd && pd.units && pd.units.some(function(o){ return o && o.string == '%' })) {
      pd = property.extend(pre, selector, 'padding', pd, radio);
    }
    if(pdt && pdt.units && pdt.units.string == '%') {
      pdt = property.extend(pre, selector, 'padding-top', pdt, radio);
    }
    if(pdr && pdr.units && pdr.units.string == '%') {
      pdr = property.extend(pre, selector, 'padding-right', pdr, radio);
    }
    if(pdb && pdb.units && pdb.units.string == '%') {
      pdb = property.extend(pre, selector, 'padding-bottom', pdb, radio);
    }
    if(pdl && pdl.units && pdl.units.string == '%') {
      pdl = property.extend(pre, selector, 'padding-left', pdl, radio);
    }
  }
  //赋值并返回
  params.forEach(function(param) {
    if(w) {
      param.width = w.property;
      param.wunits = w.units;
    }
    if(h) {
      param.height = h.property;
      param.hunits = h.units;
    }
    if(mw) {
      param.mwidth = mw.property;
      param.mwunits = mw.units;
    }
    if(mh) {
      param.mheight = mh.property;
      param.mhunits = mh.units;
    }
    if(pd) {
      param.padding = pd.property;
      param.punits = pd.units;
    }
    if(pdt) {
      param.paddingtop = pdt.property;
      param.ptunits = pdt.units;
    }
    if(pdr) {
      param.paddingright = pdr.property;
      param.prunits = pdr.units;
    }
    if(pdb) {
      param.paddingbottom = pdb.property;
      param.pbunits = pdb.units;
    }
    if(pdl) {
      param.paddingleft = pdl.property;
      param.plunits = pdl.units;
    }
    //padding和padding-left等都有时确定优先级关系
    if(param.padding) {
      for(var i = 0; i < 4; i++) {
        var o = param.padding[i];
        o = o || (i == 3 ? param.padding[1] : param.padding[0]);
        o = o || param.padding[0];
        var u = param.punits[i];
        if(u === void 0) {
          u = i == 3 ? param.punits[1] : param.punits[0];
        }
        if(u === void 0) {
          u = param.punits[0];
        }
        switch(i) {
          case 3:
            if(!param.paddingleft || o.index > param.paddingleft.index) {
              param.paddingleft = { 'string': o.string, 'index': o.index };
              param.plunits && u && (param.plunits.string = u.string);
            }
            break;
          case 2:
            if(!param.paddingbottom || o.index > param.paddingbottom.index) {
              param.paddingbottom = { 'string': o.string, 'index': o.index };
              param.pbunits && u && (param.pbunits.string = u.string);
            }
            break;
          case 1:
            if(!param.paddingright || o.index > param.paddingright.index) {
              param.paddingright = { 'string': o.string, 'index': o.index };
              param.prunits && u && (param.prunits.string = u.string);
            }
            break;
          case 0:
            if(!param.paddingtop || o.index > param.paddingtop.index) {
              param.paddingtop = { 'string': o.string, 'index': o.index };
              param.ptunits && u && (param.ptunits.string = u.string);
            }
            break;
        }
      }
    }
  });
  return params;
}
function bgi(value, hasP, radio) {
  var params = [];
  //仅background可能写repeat和position，background-image没有
  value.leaves().forEach(function(leaf) {
    if(leaf.name() == CssNode.URL) {
      var url = leaf.leaf(2).token();
      var param = { url: {
          'string': url.content(),
          'index': url.sIndex()
        }, radio: radio,
        repeat: [],
        position: [],
        units: [], size:[],
        sunits: [],
        width: null,
        height: null,
        wunits: null,
        hunits: null,
        padding: null,
        punits: null,
        paddingleft: null,
        paddingtop: null,
        paddingright: null,
        paddingbottom: null
      };
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