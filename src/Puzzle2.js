module path from 'path';
module fs from 'fs';
module Buffer from 'buffer';

//module images from 'images';

class Puzzle {
  constructor(css列表, 根路径, 映射) {
    this.css列表 = css列表;
    this.根路径 = 根路径;
    this.映射 = 映射;
  }
  解析() {
    var 自己 = this;
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {
        console.log(背景)
      });
    });
  }
}

export default Puzzle;