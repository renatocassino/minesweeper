/**
 * Class to create the game
 */
var Minesweeper = {
    $el: null,
    bombs: [],
    locationBombs: [],

    /**
     * Creating in easy way
     * @param el - jQuery element
     * @param columns - Number of columns
     * @param qtBombs - Number of bombs in the game
     * @return void
     */
    init: function(el, columns, lines, qtBombs) {
        this.setVars(el, columns, lines, qtBombs);

        this.initializeBombs();
        this.drawBoard();
        this.generateBombs();
        this.getDistances();
        this.addEvents();
    },

    /**
     * Set attributes to game
     * @param el - jQuery element
     * @param columns - Number of columns in the game
     * @param lines - Number of lines in the game
     * @param qtBombs - Number of bombs (Attention! Could not be more than blocks!)
     * @return void
     */
    setVars: function(el, columns, lines, qtBombs) {
        this.$el = el;
        this.columns = columns;
        this.lines = lines;
        this.qtBombs = qtBombs;
    },

    /**
     * Frontend to draw the board with html and css
     * @return void
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

    /**
     * Append a block with id and datas
     * @return string
     */
    appendBlock: function(column, line) {
        return '<div class="block" id="'+column+'-'+line+'" data-column="' + column + '" data-line="' + line + '">&nbsp;</div>';
    },

    /**
     *      Break line with css
     * @return string
     */
    breakLine: function() {
        return '<div class="clearfix"></div>';
    },

    /**
     * Events - Click and right click
     * @return void
     */
    addEvents: function() {
        var self = this;
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
     * @param self - The game
     * @param el - Block
     * @return void
     */
    checkBomb: function(self, el) {
        var spaceValue = el.html();
        if(spaceValue === '?' || spaceValue === '!') return null;

        el.addClass('opened');

        var column = el.data('column');
        var line = el.data('line');

        var value = self.bombs[column][line];
        el.html(value);

        if('x' === value) {
            self.endGame(self, true, el);
            return;
        } else if(0 === parseInt(value)) {
            self.removeNextCleanedArea(self,column,line);
        }
        self.checkIfWinGame(self);
    },

    /**
     * Ending the game
     * @param self - The game
     * @param lost - Boolean - If the user win or lost the game
     * @param el - jQuery element of the block
     * @return void
     */
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

    /**
     * Checking if the user win the game after mark a block
     * @param self - The game
     * @return void
     */
    checkIfWinGame: function(self) {
        var qtPossibleBlocks = self.$el.find('.block:not(.opened)').length - self.qtBombs;
        self.$el.find('#result').val('Falta(m) ' + qtPossibleBlocks + ' bloco(s).');
        if(qtPossibleBlocks === 0) {
            self.endGame(self, false);
        }
    },

    /**
     * Adding a bomb to a block
     * @param column - Number of column
     * @param line - Number of line
     * @return void
     */
    addBomb: function(column,line) {
        this.locationBombs.push([column,line]);
        this.bombs[column][line] = 'x';
    },

    /**
     * Initializing the game
     * @return void
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

    /**
     * Generating random bombs
     * @return void
     */
    generateBombs: function() {
        var bombs = 0;

        if(this.qtBombs >= this.columns*this.lines) {
            throw new Error('There isn\'t space for all bombs');
        }

        while(bombs < this.qtBombs) {
            var column = Math.floor((Math.random() * this.columns));
            var line = Math.floor((Math.random() * this.lines));

            if(this.bombs[column][line] !== 'x') {
                this.addBomb(column,line);
                bombs++;
            }
        }
    },

    /**
     * Adding number of bombs around each block
     * @return void
     */
    getDistances: function() {
        var qt=this.locationBombs.length;

        for(var i=0;i<qt;i++) {
            currentBomb = this.locationBombs[i];
            position = [currentBomb[0], currentBomb[1]];

            this.addNextValue(position);
        }
    },

    /**
     * @param point - Format [column, line]
     * @return void
     */
    addNextValue: function(point) {
        var points = this.getAround(point,'x',false);

        for(var i=0; i < points.length; i++) {
            var currentPoint = points[i];
            this.bombs[currentPoint[0]][currentPoint[1]] = parseInt(this.bombs[currentPoint[0]][currentPoint[1]])+1;
        }
    },

    /**
     * Recursivity to get around bombs with no bombs and check with 0
     * @param self - game
     * @param column - number of column
     * @param line - number of line
     * @return void
     */
    removeNextCleanedArea: function(self,column,line) {
        var positions = self.getAround([column,line],'x',false);

        for(var i=0;i<positions.length;i++) {
            var currentColumn = positions[i][0];
            var currentLine   = positions[i][1];

            var element = self.$el.find('#'+currentColumn+'-'+currentLine);
            if(!element.hasClass('opened')) {

                element.addClass('opened');
                element.html(self.bombs[currentColumn][currentLine]);

                if(parseInt(self.bombs[currentColumn][currentLine]) === 0) {
                    self.removeNextCleanedArea(self,currentColumn,currentLine);
                }
            }
        }
    },

    /**
     * Return the around blocks considering a condition
     *
     * @param position - Must be in format [column, line]
     * @param match - String to test the conditional (0|<n>|x)
     * @param equals - Consider true or false value in block comparing with param `match`
     * @return matrix - Array of points. Ex: [[0,0],[0,1][1,0][1,1]...]
     */
    getAround: function(position, match, equals) {
        columnMin = Math.max(0, parseInt(position[0])-1);
        columnMax = Math.min(this.columns-1, parseInt(position[0])+1);

        lineMin = Math.max(0, parseInt(position[1])-1);
        lineMax = Math.min(this.columns-1, parseInt(position[1])+1);

        points = [];
        for(j=lineMin;j<=lineMax;j++) {
            for(var i=columnMin;i<=columnMax;i++) {
                if(position[0] === i && position[1] === j) {
                    continue;
                }

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

    /**
     * Draw board in console.log
     * @return void
     */
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

jQuery.fn.minesweeper = function(columns, lines, qtBombs) {
    Minesweeper.init($(this), columns, lines, qtBombs);
};
