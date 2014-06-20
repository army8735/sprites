module homunculus from 'homunculus';
var CssNode = homunculus.getClass('Node', 'css');
var Token = homunculus.getClass('Token');

export default function(node, word) {
  var res = recursion(node, { 's': '', 'word': word });
  return res.s;
};

function recursion(node, res) {
  var isToken = node.name() == CssNode.TOKEN;
  var isVirtual = isToken && node.token().type() == Token.VIRTUAL;
  if(isToken) {
    if(!isVirtual) {
      var token = node.token();
      res.s += token.content();
    }
  }
  else {
    node.leaves().forEach(function(leaf) {
      recursion(leaf, res);
    });
  }
  return res;
}