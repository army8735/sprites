var gConfig = {};

module fs from 'fs';

import BackgroundImage from './BackgroundImage';
module parser from './parser';
import Puzzle from './Puzzle';

class Sprites {
  constructor(csses = []) {
    this.csses = Array.isArray(csses) ? csses : [csses];
    this.puzzle = new Puzzle();
  }

  parse(csses = []) {
    if(csses) {
      this.csses = Array.isArray(csses) ? csses : [csses];
    }
    //解析每个css文件的图片属性，赋值bgis上
    this.csses.forEach(function(css) {
      if(!css.hasOwnProperty('string')) {
        if(!css.hasOwnProperty('path')) {
          throw new Error('css file missing path when no string: ' + JSON.stringify(css));
        }
        css.string = fs.readFileSync(css.path, { encoding: 'utf-8' });
      }
      css.bgis = parser.bgis(css);
    });
    //拼图
    return this.puzzle.parse(this.csses);
  }

  static config(data = {}) {
    Object.keys(data).forEach(function(k) {
      gConfig[k] = data[k];
    });
  }
  static parse(csses) {
    return new Sprites().parse(csses);
  }
}

export default Sprites;