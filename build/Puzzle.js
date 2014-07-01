
  function Puzzle() {
    this.history = {};
  }

  Puzzle.prototype.parse = function(csses ) {
    if(csses===void 0)csses = [ ];csses.forEach(function(css) {
      css.bgis.forEach(function(bgi) {
        console.log(bgi)
      });
    });
    return csses;
  }

  Puzzle.parse=function(csses) {
    puzzle = puzzle || new Puzzle();
    return puzzle.parse(csses);
  }


var puzzle;

module.exports=Puzzle;