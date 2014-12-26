var homunculus=require('homunculus');
var CssNode = homunculus.getClass('Node', 'css');
var Token = homunculus.getClass('Token', 'css');

var media=function(){var _0=require('./media');return _0.hasOwnProperty("media")?_0.media:_0.hasOwnProperty("default")?_0.default:_0}();

exports.default=function(node) {
  var res = recursion(node, { '1': {} }, 1);
  return res;
};

function recursion(node, res, radio) {
  var isToken = node.isToken();
  if(isToken) {
    var token = node.token();
    var isVirtual = token.isVirtual();
    if(!isVirtual) {
    }
  }
  else {
    switch(node.name()) {
      case CssNode.MEDIA:
        radio = media(node);
        res[radio] = res[radio] || {};
        break;
      case CssNode.STYLESET:
        record(node, res, radio);
        break;
    }
    node.leaves().forEach(function(leaf) {
      recursion(leaf, res, radio);
    });
  }
  return res;
}

function record(node, res, radio) {
  var selectors = node.first();
  selectors.leaves().forEach(function(selector) {
    var key = [];
    var last;
    selector.leaves().forEach(function(node) {
      var token = node.token();
      var s = token.content();
      //不相邻的两个选择器以空格链接
      if(last && last.tid() < token.tid() - 1) {
        key.push(' ');
      }
      last = token;
      key.push(s);
    });
    res[radio][key.join('')] = node.last();
  });
}