var homunculus=require('homunculus');
var CssNode = homunculus.getClass('Node', 'css');
var Token = homunculus.getClass('Token');

var media=require('./media');

module.exports=function(node) {
  var res = recursion(node, { '1': {} }, 1);
  return res;
};

function recursion(node, res, radio) {
  var isToken = node.name() == CssNode.TOKEN;
  var isVirtual = isToken && node.token().type() == Token.VIRTUAL;
  if(isToken) {
    if(!isVirtual) {
      var token = node.token();
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