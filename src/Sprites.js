var gConfig = {};
var single;

module fs from 'fs';

module BackgroundImage from './BackgroundImage';
module parser from './parser';

class Sprites {
  constructor(csses = []) {
    this.csses = Array.isArray(csses) ? csses : [csses];
  }

  parse(csses = []) {
    if(csses) {
      this.csses = Array.isArray(csses) ? csses : [csses];
    }
    this.csses.forEach(function(css) {
      if(!css.hasOwnProperty('string')) {
        if(!css.hasOwnProperty('path')) {
          throw new Error('css file missing path when no string: ' + JSON.stringify(css));
        }
        css.string = fs.readFileSync(css.path, { encoding: 'utf-8' });
      }
      css.bgis = parser.bgis(css);
    });
    return this.csses;
  }

  static config(data = {}) {
    Object.keys(data).forEach(function(k) {
      gConfig.k = data[k];
    });
  }
  static parse(csses) {
    if(!single) {
      single = new Sprites();
    }
    return single.parse(csses);
  }
}

export default Sprites;