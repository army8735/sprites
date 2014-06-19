module homunculus from 'homunculus';
var CssParser = homunculus.getParser('css');
var CssNode = homunculus.getNode('css');

export function bgis(css) {
  var ast = CssParser.parse(css.string);
  var res = recursion(ast, []);
}

function recursion(node, res) {
  var isToken = node.name() == CssNode.TOKEN;
  var isVirtual = isToken && node.token().type() == Token.VIRTUAL;
  if(isToken) {
    if(!isVirtual) {
      //
    }
  }
  else {
    node.leaves().forEach(function(leaf, i) {
      recursion(leaf, res);
    });
  }
  return res;
}