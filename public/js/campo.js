/**
 *
 */
var game = {
	$el: null,
	bombs: [],
	locationBombs: [],

	init: function(el, columns, lines, qtBombs) {
		this.setVars(el, columns, lines, qtBombs);

		this.initializeBombs();
		this.drawBoard();
		this.generateBombs();
		this.getDistances();
		this.addEvents();
	},

	setVars: function(el, columns, lines, qtBombs) {
		this.$el = el;
		this.columns = columns;
		this.lines = lines;
		this.qtBombs = qtBombs;
	},

	/**
	 *	Frontend
	 */
	drawBoard: function() {
		var html = '<h1>Minesweeper</h1>';

		// Format [column][line]
		for(var j=0;j<this.lines;j++) {
			for(var i=0;i<this.columns;i++) {
				html += this.appendBlock(i,j);
			}
			html += this.breakLine();
		}

		html += '<input type="text" id="result" readonly="readonly">';
		this.$el.html(html);
	},

	appendBlock: function(column, line) {
		return '<div class="block" id="'+column+'-'+line+'" data-column="' + column + '" data-line="' + line + '">&nbsp;</div>';
	},

	breakLine: function() {
		return '<div class="clearfix"></div>';
	},

	/**
	 * Events
	 */
	addEvents: function() {
		self = this;
		this.$el.find('.block').click(function() {
			self.checkBomb(self,$(this));
		});

		this.$el.find('.block').bind("contextmenu",function(e){
			e.preventDefault();
			var value = $(this).html();

			switch(value) {
				case '!': $(this).html('?'); break;
				case '?': $(this).html('&nbsp;'); break;
				case '&nbsp;': $(this).html('!'); break;
			}

			return false;
		});
	},

	/**
	 * @param self Object game
	 * @param el - Block
	 */
	checkBomb: function(self, el) {
		var spaceValue = el.html();
		if(spaceValue == '?' || spaceValue == '!') return null;

		el.addClass('opened');

		var column = el.data('column');
		var line = el.data('line');

		var value = self.bombs[column][line];
		el.html(value);

		if(value == 'x') {
			self.endGame(self, true, el);
			return;
		} else if(parseInt(value) == 0) {
			self.removeNextCleanedArea(self,column,line);
		}
		self.checkIfWinGame(self);
	},

	endGame: function(self, lost, el) {
		self.$el.find('.block').unbind("click");
		self.$el.find('.block').unbind("contextmenu");

		if(lost) {
			alert('Kabooooom! Você perdeu!');
			el.addClass('lost');
			self.$el.find('#result').val('Kabooooooooooooom!');
		} else {
			alert('Parabéns! Você venceu! xD');
			self.$el.find('#result').val('Você venceu!');
		}
	},

	checkIfWinGame: function(self) {
		var qtPossibleBlocks = self.$el.find('.block:not(.opened)').length - self.qtBombs;
		self.$el.find('#result').val('Falta(m) ' + qtPossibleBlocks + ' bloco(s).');
		if(qtPossibleBlocks == 0) {
			self.endGame(self, false);
		}
	},

	addBomb: function(column,line) {
		this.locationBombs.push([column,line]);
		this.bombs[column][line] = 'x';
	},

	/**
	 * Logic Game
	 */
	initializeBombs: function() {
		this.locationBombs = [];
		this.bombs = new Array(this.columns);
			for (var i = 0; i < this.columns; i++) {
					this.bombs[i] = new Array(this.lines);

					for(j=0;j<this.lines;j++) {
						this.bombs[i][j] = 0;
					}
			}
	},

	generateBombs: function() {
		var bombs = 0;

		if(this.qtBombs >= this.columns*this.lines) {
			throw new Error('There isn\'t space for all bombs');
		}

		while(bombs < this.qtBombs) {
			var column = Math.floor((Math.random() * this.columns));
			var line = Math.floor((Math.random() * this.lines));

			if(this.bombs[column][line] != 'x') {
				this.addBomb(column,line);
				bombs++;
			}
		}
	},

	// Adicionando os valores em volta das bombas
	getDistances: function() {
		var qt=this.locationBombs.length;

		for(var i=0;i<qt;i++) {
			currentBomb = this.locationBombs[i];
			position = [currentBomb[0], currentBomb[1]];

			this.addNextValue(position);
		}
	},

	// Adicionar valores para os que estão em volta
	addNextValue: function(point) {
		var points = this.getArround(point,'x',false);

		for(var i=0; i < points.length; i++) {
			var currentPoint = points[i];
			this.bombs[currentPoint[0]][currentPoint[1]] = parseInt(this.bombs[currentPoint[0]][currentPoint[1]])+1;
		}
	},

	// Remove os valores em volta com 0 bombas
	removeNextCleanedArea: function(self,column,line) {
		var positions = self.getArround([column,line],'x',false);

		for(var i=0;i<positions.length;i++) {
			var currentColumn = positions[i][0];
			var currentLine   = positions[i][1];

			var element = self.$el.find('#'+currentColumn+'-'+currentLine);
			if(!element.hasClass('opened')) {

				element.addClass('opened');
				element.html(self.bombs[currentColumn][currentLine]);

				if(parseInt(self.bombs[currentColumn][currentLine]) == 0) {
					self.removeNextCleanedArea(self,currentColumn,currentLine);
				}
			}
		}
	},

	// Retorna as posições em volta do ponto corrente
	getArround: function(position, match, equals) {
		columnMin = Math.max(0, parseInt(position[0])-1);
		columnMax = Math.min(this.columns-1, parseInt(position[0])+1);

		lineMin = Math.max(0, parseInt(position[1])-1);
		lineMax = Math.min(this.columns-1, parseInt(position[1])+1);

		points = [];
		for(var i=columnMin;i<=columnMax;i++) {
			for(j=lineMin;j<=lineMax;j++) {
				if(equals) {
					if(this.bombs[i][j] == match) {
						points.push([i,j]);
					}
				} else {
					if(this.bombs[i][j] != match) {
						points.push([i,j]);
					}
				}
			}
		}
		return points;
	},

	drawBoardInConsole: function() {
		consoleLog = '';
		for(var j=0;j<this.lines;j++) {
			for(var i=0;i<this.columns;i++) {
				consoleLog += "["+this.bombs[i][j]+"]";
			}
			consoleLog += "\n";
		}
		console.log(consoleLog);
	}
}

jQuery.fn.CampoMinado = function(columns, lines, qtBombs) {
	game.init($(this), columns, lines, qtBombs);
};
