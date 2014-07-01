
  function Puzzle() {
    this.history = {};
  }

  Puzzle.prototype.parse = function(csses ) {
    if(csses===void 0)csses = [ ];var res = [];
    csses.forEach(function(css) {
      console.log(css)
    });
    return res;
  }

  Puzzle.parse=function(csses) {
    puzzle = puzzle || new Puzzle();
    return puzzle.parse(csses);
  }


var puzzle;

module.exports=Puzzle;