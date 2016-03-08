jQuery.fn.CampoMinado = function(columns, lines, qtBombs) {

	var game = {
		$el: null,
		bombs: [],
		locationBombs: [],

		init: function(el, columns, lines, qtBombs) {
			this.$el = el;
			this.columns = columns;
			this.lines = lines;
			this.qtBombs = qtBombs;

			this.initializeBombs();
			this.drawBoard();
			this.generateBombs();
			this.getDistances();
			this.addEvents();
		},

		/**
		 *	Frontend
		 */
		drawBoard: function() {
			var html = '<h1>Campo minado</h1>';

			for(i=0;i<this.columns;i++) {
				for(j=0;j<this.lines;j++) {
					html += this.appendBlock(i,j);
				}
				html += this.breakLine();
			}

			this.$el.html(html);
		},

		appendBlock: function(line, column) {
			return '<div class="block" data-column="' + column + '" data-line="' + line + '">&nbsp;</div>';
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
		},

		checkBomb: function(self, el) {
			el.addClass('opened');
			el.html(self.bombs[el.data('column')][el.data('line')]);
		},

		/**
		 * Logic Game
		 */
		initializeBombs: function() {
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
			while(bombs < this.qtBombs) {
				var column = Math.floor((Math.random() * this.columns));
				var line = Math.floor((Math.random() * this.lines));

				if(this.bombs[column][line] != 'x') {
					this.bombs[column][line] = 'x';
					this.locationBombs.push([column,line]);
					bombs++;
				}
			}
		},

		getDistances: function() {
			var qt=this.locationBombs.length;

			for(k=0;k<qt;k++) {
				currentBomb = this.locationBombs[k];
				position = [currentBomb[0], currentBomb[1]];

				this.getArround(position);
			}
		},

		getArround: function(position) {
			columnMin = Math.max(0, parseInt(position[0])-1);
			columnMax = Math.min(this.columns-1, parseInt(position[0])+1);

			lineMin = Math.max(0, parseInt(position[1])-1);
			lineMax = Math.min(this.columns-1, parseInt(position[1])+1);

			points = [];
			for(i=columnMin;i<=columnMax;i++) {
				for(j=lineMin;j<=lineMax;j++) {
					if(this.bombs[i][j] != 'x'){
						points.push([i,j]);
						this.bombs[i][j] = parseInt(this.bombs[i][j])+1;
					}
				}
			}
		},
	}

	game.init($(this), columns, lines, qtBombs);
};