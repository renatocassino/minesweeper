describe("Minesweeper", function() {
  beforeEach(function() {
    jQuery('#campo').remove();
    jQuery('body').append('<div id="game" style="display:none;"></div>');
    jQuery('body').append('<style>#campo {margin: 0 auto;text-align: center;margin-top: 40px;}#campo #result {text-align:center;margin-top:10px;border-radius:10px;padding: 5px 10px;border: 1px solid #ccc;box-shadow:3px 3px 2px #dfdfdf;}.block {width:25px;height:25px;background: #339;display: inline-block;border: 1px solid #fff;color: #fff;cursor: pointer;}.block.lost {background: #933;}.block.opened:not(.lost) {background: #393;}.block:not(.lost,.opened):hover {background: #55B;}.clearfix {clear: both;}')
  });

  describe("Verify if the", function() {
    it("title was created", function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 2);
      Minesweeper.drawBoard();

      var result = jQuery('#game').find('h1').html();
      expect('Minesweeper').toBe(result);
    });

    it("invisible field was created", function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 2);
      Minesweeper.drawBoard();

      var result = jQuery('#game').find('#result').length;
      expect(1).toBe(result);
    });

    it("invisible field was created", function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 2);
      Minesweeper.drawBoard();

      var result = jQuery('#game').find('#result').length;
      expect(1).toBe(result);
    });
  });

  describe("Validate if", function() {
    it("the appendBlock has the correct attributes", function() {
      var block = Minesweeper.appendBlock(4, 2);

      var result = jQuery(block);
      expect(result.attr('id')).toBe('4-2');
      expect(result.attr('data-line')).toBe('2');
      expect(result.attr('data-column')).toBe('4');
    });

    it("the drawBoard has the correct number of spaces", function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 2);
      Minesweeper.drawBoard();

      var result = jQuery('#game').find('.block');
      expect(16).toBe(result.length);
    });

    it("isn't possible to set a number of bombs greater than spaces", function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 20);
      expect(function() {Minesweeper.generateBombs()}).toThrow();
    });
  });

  describe("Check bombs", function() {
    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 0);
      Minesweeper.drawBoard();
      Minesweeper.initializeBombs();
    });

    it("distance in zero bombs", function() {
      Minesweeper.getDistances();

      expect(Minesweeper.bombs[1][1]).toBe(0);
      expect(Minesweeper.bombs[2][2]).toBe(0);
    });

    it("distance in one bomb", function() {
      // [1][1][1]
      // [1][x][1]
      // [1][1][1]
      Minesweeper.addBomb(1,1);
      Minesweeper.getDistances();

      for(var i = 0; i< 3; i++) {
        for(var j=0; j< 3; j++) {
          if(i == 1 && j == 1) {
            expect(Minesweeper.bombs[i][j]).toBe('x');
          } else {
            expect(Minesweeper.bombs[i][j]).toBe(1);
          }
        }
      }
    });

    it("distance between two bombs", function() {
      // [1][2][1]
      // [x][2][x]
      // [1][2][1]
      Minesweeper.addBomb(0,1);
      Minesweeper.addBomb(2,1);

      Minesweeper.getDistances();
      Minesweeper.addEvents();

      expect(Minesweeper.bombs[0][0]).toBe(1);
      expect(Minesweeper.bombs[0][2]).toBe(1);
      expect(Minesweeper.bombs[1][0]).toBe(2);
      expect(Minesweeper.bombs[1][1]).toBe(2);
      expect(Minesweeper.bombs[1][2]).toBe(2);
      expect(Minesweeper.bombs[2][0]).toBe(1);
      expect(Minesweeper.bombs[2][2]).toBe(1);
    });

    it("distance between three bombs", function() {
      // [x][3][1]
      // [x][x][1]
      // [2][2][1]
      Minesweeper.addBomb(0,0);
      Minesweeper.addBomb(0,1);
      Minesweeper.addBomb(1,1);

      Minesweeper.getDistances();

      expect(Minesweeper.bombs[1][0]).toBe(3);
      expect(Minesweeper.bombs[2][0]).toBe(1);
      expect(Minesweeper.bombs[2][1]).toBe(1);
      expect(Minesweeper.bombs[0][2]).toBe(2);
      expect(Minesweeper.bombs[1][2]).toBe(2);
      expect(Minesweeper.bombs[2][2]).toBe(1);
    });

    it("distance between three bombs", function() {
      // [x][3][1]
      // [x][x][1]
      // [2][2][1]
      Minesweeper.addBomb(0,0);
      Minesweeper.addBomb(0,1);
      Minesweeper.addBomb(1,1);

      Minesweeper.getDistances();

      expect(Minesweeper.bombs[1][0]).toBe(3);
      expect(Minesweeper.bombs[2][0]).toBe(1);
      expect(Minesweeper.bombs[2][1]).toBe(1);
      expect(Minesweeper.bombs[0][2]).toBe(2);
      expect(Minesweeper.bombs[1][2]).toBe(2);
      expect(Minesweeper.bombs[2][2]).toBe(1);
    });

  });

  describe("Test event", function() {
    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 0);
      Minesweeper.drawBoard();
      Minesweeper.addEvents();
    });
    it("checking as a bomb in place", function() {
      var block = jQuery('#game .block');

      block.trigger('contextmenu');
      expect(block.html()).toBe('!');
    });

    it("asking as a bomb in place", function() {
      var block = jQuery('#game .block')

      block.trigger('contextmenu');
      block.trigger('contextmenu');

      expect(block.html()).toBe('?');
    });

    it("removing ask a bomb in place", function() {
      var block = jQuery('#game .block');

      block.trigger('contextmenu');
      block.trigger('contextmenu');
      block.trigger('contextmenu');

      expect(block.html()).toBe('&nbsp;');
    });

  });

  describe('Checking bomb', function() {
    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 0);
      Minesweeper.drawBoard();
      Minesweeper.initializeBombs();
      Minesweeper.addEvents();

      window.alert = function(){return;};
    });

    it('is called on click', function() {
      spyOn(Minesweeper, 'checkBomb');

      var block = jQuery('#game .block');
      block.trigger('click');

      expect(Minesweeper.checkBomb).toHaveBeenCalled();
    });

    it('return null if checked as "!"', function() {
      var block = jQuery('#game .block');
      block.trigger('contextmenu');

      var finalValue = Minesweeper.checkBomb(Minesweeper, block);

      expect(finalValue).toBeNull();
    });

    it('return null if checked as "?"', function() {
      var block = jQuery('#game .block');
      block.trigger('contextmenu');
      block.trigger('contextmenu');

      var finalValue = Minesweeper.checkBomb(Minesweeper, block);

      expect(finalValue).toBeNull();
    });

    it('checking if lost the game', function() {
      Minesweeper.addBomb(0, 0);
      var block = jQuery(jQuery('#game .block')[0]);
      spyOn(Minesweeper, 'endGame');

      var finalValue = Minesweeper.checkBomb(Minesweeper, block);

      expect(Minesweeper.endGame).toHaveBeenCalledWith(Minesweeper, true, block);
    });

    it('checking call win the game', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      spyOn(Minesweeper, 'checkIfWinGame');

      var finalValue = Minesweeper.checkBomb(Minesweeper, block);

      expect(Minesweeper.checkIfWinGame).toHaveBeenCalled();
    });

    it('and marking around area with 0 bombs', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      spyOn(Minesweeper, 'removeNextCleanedArea');

      var finalValue = Minesweeper.checkBomb(Minesweeper, block);

      expect(Minesweeper.removeNextCleanedArea).toHaveBeenCalledWith(Minesweeper, 0, 0);
    });

    it('and marking block as opened', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      var finalValue = Minesweeper.checkBomb(Minesweeper, block);

      expect(block.hasClass('opened')).toBe(true);
    });
  });

  describe('Ending game', function() {
    beforeEach(function() {
      window.alert = function(){return;};
    });

    it('adding class when lost a game', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      Minesweeper.endGame(Minesweeper, true, block);

      expect(block.hasClass('lost')).toBe(true);
    });

    it('changing text status', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      var result = jQuery('#result');
      Minesweeper.endGame(Minesweeper, true, block);

      expect(result.val()).toBe('Kabooooooooooooom!');
    });

    it('changing text status when win the game', function() {
      var block = jQuery(jQuery('#game .block')[0]);
      var result = jQuery('#result');
      Minesweeper.endGame(Minesweeper, false, block);

      expect(result.val()).toBe('Você venceu!');
    });
  });

  describe('Checking if win a game', function() {
    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 2, 2, 0);
      Minesweeper.drawBoard();
      Minesweeper.initializeBombs();
      Minesweeper.addEvents();
    });

    it('close the game', function() {
      spyOn(Minesweeper, 'endGame');
      jQuery('#game .block').addClass('opened');
      Minesweeper.checkIfWinGame(Minesweeper);

      expect(Minesweeper.endGame).toHaveBeenCalledWith(Minesweeper, false);
    });

    it('not close the game', function() {
      spyOn(Minesweeper, 'endGame');
      jQuery('#game .block');
      Minesweeper.checkIfWinGame(Minesweeper);

      expect(Minesweeper.endGame).not.toHaveBeenCalledWith();
    });
  });

  describe('Adding next values with bombs', function() {
    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 0);
      Minesweeper.drawBoard();
      Minesweeper.initializeBombs();
      Minesweeper.addEvents();
    });

    it('test next values in blocks', function() {
      // [1][2][2][1]
      // [1][x][x][1]
      // [1][2][2][1]
      for(var i=1;i<=2;i++) {
        Minesweeper.addBomb(i, 1);
        Minesweeper.addNextValue([i,1]);
      }
      Minesweeper.addEvents();

      expect(Minesweeper.bombs[0][0]).toBe(1);
      expect(Minesweeper.bombs[1][0]).toBe(2);
      expect(Minesweeper.bombs[2][0]).toBe(2);
      expect(Minesweeper.bombs[3][0]).toBe(1);
      expect(Minesweeper.bombs[0][1]).toBe(1);
      expect(Minesweeper.bombs[3][1]).toBe(1);
      expect(Minesweeper.bombs[0][2]).toBe(1);
      expect(Minesweeper.bombs[1][2]).toBe(2);
      expect(Minesweeper.bombs[2][2]).toBe(2);
      expect(Minesweeper.bombs[3][2]).toBe(1);
    });
  });

  describe('Recursive clean area with no bombs', function() {
    var expectValue = function(block, value) {
      expect(block.hasClass('opened')).toBe(true);
      expect(block.html()).toBe(value);
    }

    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 8, 8, 0);
      Minesweeper.drawBoard();
      Minesweeper.initializeBombs();
      Minesweeper.addEvents();
    });

    it('removing blocks with zeros', function() {
      // [0][0][1][x]
      // [0][0][1][1]
      // [0][0][0][0]
      Minesweeper.addBomb(3,0);
      Minesweeper.getDistances();
      var block = jQuery('#game #0-0');

      block.trigger('click');

      expectValue(jQuery('#game #0-0'), '0');
      expectValue(jQuery('#game #1-0'), '0');
      expectValue(jQuery('#game #0-1'), '0');
      expectValue(jQuery('#game #1-1'), '0');
      expectValue(jQuery('#game #0-2'), '0');
      expectValue(jQuery('#game #1-2'), '0');
      expectValue(jQuery('#game #2-2'), '0');
      expectValue(jQuery('#game #3-2'), '0');
      expectValue(jQuery('#game #4-2'), '0');

      // Values with 1
      expectValue(jQuery('#game #2-0'), '1');
      expectValue(jQuery('#game #2-1'), '1');
      expectValue(jQuery('#game #3-1'), '1');
    });

    it('checking opened blocks in recursivity', function() {
      // [0][0][1][x]
      // [0][0][1][1]
      // [0][0][0][0]
      Minesweeper.addBomb(3,0);
      Minesweeper.getDistances();
      var block = jQuery('#game #0-0');

      var expectValue = function(block, value) {
        expect(block.hasClass('opened')).toBe(true);
        expect(block.html()).toBe(value);
      }

      block.trigger('click');

      // Values with 1
      expectValue(jQuery('#game #2-0'), '1');
      expectValue(jQuery('#game #2-1'), '1');
      expectValue(jQuery('#game #3-1'), '1');
    });
  });

  describe('Testing get around', function() {
    beforeEach(function() {
      Minesweeper.setVars(jQuery('#game'), 4, 4, 0);
      Minesweeper.drawBoard();
      Minesweeper.initializeBombs();
      Minesweeper.addEvents();

      Minesweeper.addBomb(1,1);
      Minesweeper.addBomb(2,2);
      Minesweeper.getDistances();
    });

    // [1][1][1][0]
    // [1][x][2][1]
    // [1][2][x][1]
    // [0][1][1][1]

    it('Testing get equals 1', function() {
      var points = Minesweeper.getAround([1,1], '1', true);
      expect(points).toEqual([ [0,0],[1,0],[2,0],[0,1],[0,2] ]);
    });

    it('Testing get equals x', function() {
      var points = Minesweeper.getAround([2,2], 'x', true);
      expect(points).toEqual([ [1,1] ]);
    });

    it('Testing get not equals 1', function() {
      var points = Minesweeper.getAround([1,1], '1', false);
      expect(points).toEqual([ [2,1],[1,2],[2,2] ]);
    });

    it('Testing get not equals x', function() {
      var points = Minesweeper.getAround([2,2], 'x', false);
      expect(points).toEqual([ [2,1],[3,1], [1,2],[3,2], [1,3],[2,3],[3,3] ]);
    });

    it('Testing in first column', function() {
      var points = Minesweeper.getAround([0,1], 'n', false); // n param to get all
      expect(points).toEqual([ [0,0],[1,0], [1,1], [0,2],[1,2] ]);
    });

    it('Testing in first line', function() {
      var points = Minesweeper.getAround([1,0], 'n', false); // n param to get all
      expect(points).toEqual([ [0,0],[2,0], [0,1],[1,1],[2,1] ]);
    });

    it('Testing in last column', function() {
      var points = Minesweeper.getAround([3,1], 'n', false); // n param to get all
      expect(points).toEqual([ [2,0],[3,0], [2,1], [2,2],[3,2] ]);
    });

    it('Testing in last line', function() {
      var points = Minesweeper.getAround([1,3], 'n', false); // n param to get all
      expect(points).toEqual([ [0,2],[1,2],[2,2], [0,3],[2,3] ]);
    });

    it('Testing first column and line', function() {
      var points = Minesweeper.getAround([0,0], 'n', false); // n param to get all
      expect(points).toEqual([ [1,0],[0,1],[1,1] ]);
    });

    it('Testing last column and line', function() {
      var points = Minesweeper.getAround([3,3], 'n', false); // n param to get all
      expect(points).toEqual([ [2,2],[3,2],[2,3] ]);
    });
  });

});
