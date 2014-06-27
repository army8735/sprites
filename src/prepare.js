module homunculus from 'homunculus';
var CssNode = homunculus.getClass('Node', 'css');
var Token = homunculus.getClass('Token');

module media from './media';

export default function(node) {
  radio = 1;
  var res = recursion(node, { '1': {} });
  return res;
};

var radio;

function recursion(node, res) {
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
        record(node, res);
        break;
    }
    node.leaves().forEach(function(leaf) {
      recursion(leaf, res);
    });
  }
  return res;
}

function record(node, res) {
  var selectors = node.first();
  var block = node.last();
  var key = [];
  selectors.leaves().forEach(function(selector) {
    selector.leaves().forEach(function(node) {

    });
  });
}