var SimonWrapper = React.createClass({
	getInitialState: function(){
			return { 
				leftTop:0,
				leftBottom:0,
				rightTop:0,
				rightBottom:0,
				total: 0,
				gameOver:0,
				sequence:[],
				pressedSequence:[],
				gameNumber:1
			};
	},
	 incrementLeftTop: function(){
		this.setState( { leftTop:  this.state.leftTop + 1 } );
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(1);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.setSequenceValue();
  },
	incrementRightTop: function(){
		this.setState( { rightTop: this.state.rightTop + 1 } );		
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(2);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.setSequenceValue();
  },
	incrementLeftBottom: function(){
		this.setState( { leftBottom: this.state.leftBottom + 1 } );
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(4);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.setSequenceValue();
  },
	incrementRightBottom: function(){
		this.setState( { rightBottom: this.state.rightBottom + 1 } );
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(3);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.setSequenceValue();
  },
	generateSequence: function() {
		for(var counter=1; counter<= this.state.gameNumber; counter++){
			var sequenceNumber = Math.floor((Math.random()* 4)+1);
			this.state.sequence.push(sequenceNumber);
		}
		this.setState({sequence: this.state.sequence});	
		this.animateSecuence();
	},
	animateSecuence: function() {	
		var elementToAnimate='';
		var delay = 1000;
		for(var counter=0; counter<= this.state.sequence.length-1; counter++){
				switch (this.state.sequence[counter]){
					case 1:
						elementToAnimate = '.simonLeftTop';
						break;
					case 2:
						elementToAnimate = '.simonRightTop';
						break;
					case 3:
						elementToAnimate = '.simonRightBottom';
						break;
					case 4:
						elementToAnimate = '.simonLeftBottom';
						break;
				}
			this.animationSelect(elementToAnimate, delay);
			delay+=1000;
		}
	},
	animationSelect: function(element, delay){
		setTimeout(function(){
			$(element).animate({
				opacity: "0.2"
			}, 100, function() {
				$(element).animate({opacity:"1"});
			});	
		}, delay);
		
	},
	increaseSecuence: function(){
		this.state.gameNumber = this.state.gameNumber + 1;
		this.setState({gameNumber: this.state.gameNumber});
		this.generateSequence();
		var randomRotation =  Math.floor((Math.random()* 360)+1);
		this.containerRotation(randomRotation);
	},
	containerRotation:function(angle){
		$('.simonContainer').animate({  borderSpacing: angle }, {
    step: function(now,fx) {
      $(this).css('-webkit-transform','rotate('+now+'deg)'); 
      $(this).css('-moz-transform','rotate('+now+'deg)');
      $(this).css('transform','rotate('+now+'deg)');
		},
			duration:'slow'
		},'linear');
	},
	setSequenceValue: function(){	
		var totalElements = this.state.sequence.length;
		var totalElementsPressed = this.state.pressedSequence.length;
		var audioGood = $('audio')[0];
		var audioBad = $('audio')[1];
		
		if (totalElementsPressed <= totalElements){
			
			audioGood.play();
			for(var arrayCount=0; arrayCount <= totalElementsPressed - 1; arrayCount++){			
				if(this.state.pressedSequence[arrayCount] === this.state.sequence[arrayCount]){
					if ((arrayCount+1) === totalElements){
						this.clear();
						this.increaseSecuence();
					}
				} else {
					audioBad.play();
					this.gameOver();
					break;
				}
			}
		}				
	},
	startGame: function() {
		this.clear();
		$('.gameOver').hide();
		$('.simonContainer').show();
		this.state.gameNumber = 1;
		this.setState({gameNumber: this.state.gameNumber});
		this.generateSequence();
		this.containerRotation(0);
		console.log(this.state.sequence);
		console.log(this.state.pressedSequence);
	},
	gameOver: function() {
		$('.gameOver').show();
		$('.simonContainer').hide();
	},
	clear: function(){
		this.state.sequence = [];
		this.state.pressedSequence = [];
		
		this.setState( { rightBottom: 0 } );
		this.setState( { leftBottom: 0 } );
		this.setState( { rightTop: 0 } );
		this.setState( { leftTop: 0 } );
		this.setState( { total: 0 } );
		this.setState( { sequence: this.state.sequence });
		this.setState( { pressedSequence: this.state.pressedSequence });
	},
  render: function(){
    return (
      <div className="simonWrapper">
				<div className="simonContainer">
					<SimonLeftTop onClick={this.incrementLeftTop} />
					<SimonRightTop onClick={this.incrementRightTop} />
					<SimonCounter total={this.state.gameNumber}  />
					<SimonLeftBottom onClick={this.incrementLeftBottom} />
					<SimonRightBottom onClick={this.incrementRightBottom} />
				</div>
				<div className="actionButtons">
					<NewGame onClick={this.startGame} />
					<GameOver />
				</div>
      </div>
    );
  }
});

var SimonCounter = React.createClass({
  render: function(){
    return (
      <div className="simonCounter">
				<h2>{this.props.total}</h2>
      </div>
    );
  }
});

var SimonLeftTop = React.createClass({
	clickHandler: function (){
		 setTimeout(this.props.onClick(),500);
  },
	mouseDown: function(){
		$(this.getDOMNode()).addClass('selected-side');
	},
	mouseUp: function(){
		$(this.getDOMNode()).removeClass('selected-side');
	},
  render: function(){
    return (
      <div onClick={this.clickHandler}  onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonLeftTop">
      </div>
    );
  }
});

var SimonRightTop = React.createClass({
	clickHandler: function (){
		setTimeout(this.props.onClick(),500);
  },
	mouseDown: function(){
		$(this.getDOMNode()).addClass('selected-side');
	},
	mouseUp: function(){
		$(this.getDOMNode()).removeClass('selected-side');
	},
  render: function(){
    return (
      <div onClick={this.clickHandler} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonRightTop">
      </div>
    );
  }
});

var SimonLeftBottom = React.createClass({
	clickHandler: function (){
		 setTimeout(this.props.onClick(),500);
  },	
	mouseDown: function(){
		$(this.getDOMNode()).addClass('selected-side');
	},
	mouseUp: function(){
		$(this.getDOMNode()).removeClass('selected-side');
	},
  render: function(){
    return (
      <div onClick={this.clickHandler} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonLeftBottom">
      </div>
    );
  }
});

var SimonRightBottom = React.createClass({
	clickHandler: function (){
		 setTimeout(this.props.onClick(),1000);
  },
	mouseDown: function(){
		$(this.getDOMNode()).addClass('selected-side');
	},
	mouseUp: function(){
		$(this.getDOMNode()).removeClass('selected-side');
	},
  render: function(){
    return (
      <div onClick={this.clickHandler} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonRightBottom">
      </div>
    );
  }
});

var NewGame = React.createClass({
	clickHandler: function (){
		this.props.onClick();
  },
  render: function(){
    return (
      <a onClick={this.clickHandler} className="newGame medium alert button">New Game</a>
    );
  }
});

var GameOver = React.createClass({
  render: function(){
    return (
      <div className="gameOver">
				<h3>Game Over!</h3>
			</div>
    );
  }
});

React.render(
  <SimonWrapper/>,
	document.getElementsByClassName('content')[0]
);