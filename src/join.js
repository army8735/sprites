module homunculus from 'homunculus';
var CssNode = homunculus.getClass('Node', 'css');
var Token = homunculus.getClass('Token', 'css');

export default function(node, word) {
  var res = recursion(node, { 's': '', 'word': word });
  return res.s;
};

function recursion(node, res) {
  var isToken = node.isToken();
  if(isToken) {
    var token = node.token();
    var isVirtual = token.isVirtual();
    if(!isVirtual) {
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