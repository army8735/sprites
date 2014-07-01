class Puzzle {
  constructor() {
    this.history = {};
  }

  parse(csses = []) {
    csses.forEach(function(css) {
      css.bgis.forEach(function(bgi) {
        console.log(bgi)
      });
    });
    return csses;
  }

  static parse(csses) {
    puzzle = puzzle || new Puzzle();
    return puzzle.parse(csses);
  }
}

var puzzle;

export default Puzzle;