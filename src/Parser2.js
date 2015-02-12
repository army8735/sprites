module homunculus from 'homunculus';
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token', 'css');

class Parser {
  constructor() {
  }

  解析(css) {
    var 解析器 = homunculus.getParser('css');
    var 语法树 = 解析器.parse(css.内容);
    this.递归(语法树);
  }
  递归(节点) {

  }
}