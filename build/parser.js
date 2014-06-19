var homunculus=require('homunculus');
var CssParser = homunculus.getParser('css');
var CssNode = homunculus.getNode('css');

var BackgroundImage=require('BackgroundImage');

exports.bgis=bgis;function bgis(css) {
  var ast = CssParser.parse(css.string);
  var res = recursion(ast);
}

function recursion(node, res ) {
  if(res===void 0)res = [ ];var isToken = node.name() == CssNode.TOKEN;
  var isVirtual = isToken && node.token().type() == Token.VIRTUAL;
  if(isToken) {
    if(!isVirtual) {
      var token = node.token();
      if(token.type() == CssNode.KEYWORD) {
        var s = token.content().toLowerCase();
        if(s == 'background'
          || s == 'background-image') {
          var params = parse(token);
          var bgi = new BackgroundImage(params);
          res.push(bgi);
        }
      }
    }
  }
  else {
    node.leaves().forEach(function(leaf, i) {
      recursion(leaf, res);
    });
  }
  return res;
}

function parse(token) {

}