class Puzzle {
  constructor() {
    this.history = {};
  }

  parse(csses = []) {
    var res = [];
    csses.forEach(function(css) {
      console.log(css)
    });
    return res;
  }

  static parse(csses) {
    puzzle = puzzle || new Puzzle();
    return puzzle.parse(csses);
  }
}

var puzzle;

export default Puzzle;