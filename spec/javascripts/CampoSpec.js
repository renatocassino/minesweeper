describe("CampoMinado", function() {
  beforeEach(function() {
    jQuery('#campo').remove();
    jQuery('body').append('<div id="game" style="display:none;"></div>');
  });

  describe("Verify if the", function() {
    it("title was created", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('h1').html();
      expect('Campo minado').toBe(result);
    });

    it("invisible field was created", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('#result').length;
      expect(1).toBe(result);
    });

    it("invisible field was created", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('#result').length;
      expect(1).toBe(result);
    });
  });

  describe("Validate if", function() {
    it("the appendBlock has the correct attributes", function() {
      var block = game.appendBlock(2, 4);

      var result = jQuery(block);
      expect(result.attr('id')).toBe('4-2');
      expect(result.attr('data-line')).toBe('2');
      expect(result.attr('data-column')).toBe('4');
    });

    it("the drawBoard has the correct number of spaces", function() {
      game.setVars(jQuery('#game'), 4, 4, 2);
      game.drawBoard();

      var result = jQuery('#game').find('.block');
      expect(16).toBe(result.length);
    });

    it("isn't possible to set a number of bombs greater than spaces", function() {
      game.setVars(jQuery('#game'), 4, 4, 20);
      expect(function() {game.generateBombs()}).toThrow();
    });
  });
});
