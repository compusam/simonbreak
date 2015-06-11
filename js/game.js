var GameVariables = (function(){
	var level = 'basic';
	var introContainer = $('.intro');
	var gameContainer = $('.game');
	var initialColors = {
		leftTopBackground:'#2EFE2E',
		leftBottomBackground:'#FFFF00',
		rightTopBackground:'#FF0000',
		rightBottomBackground:'#0080FF'
	};
			
	var changeLevel = function(levelValue) {
		this.level = levelValue;
	};
	
	var dateNow = function() {
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();
		var day = today.getDay();
		
		if (month <= 9){
			month = '0' + month;
		}
		if (day <= 9){
			day = '0'+day;
		}
		return  year+'/'+month+'/'+day;
	};
	
	return{
		introContainer:introContainer,
		gameContainer:gameContainer,
		level: level,
		changeLevel:changeLevel,
		initialColors:initialColors,
		dateNow: dateNow
	}
})();

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
				gameNumber:1,
				audioContext:new AudioContext(),
				maxScore:0
			};
	},
	componentDidMount: function() {
		 window.addEventListener('keydown', this.handleKeyPress);
	},
	handleKeyPress: function(e){		
		if (GameVariables.level === 'blind') {
			
			switch (e.keyCode){
				case 81:
					this.incrementLeftTop();
				break;
				case 87:
					this.incrementRightTop();
				break;
				case 65:
					this.incrementLeftBottom();
				break;
				case 83:
					this.incrementRightBottom();
				break;
			}
		}
	},
	 incrementLeftTop: function(){
		this.setState( { leftTop:  this.state.leftTop + 1 } );
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(1);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.animationSelect(constants.leftTopElementClass, constants.leftTop, 0);
		this.setSequenceValue();
  },
	incrementRightTop: function(){
		this.setState( { rightTop: this.state.rightTop + 1 } );		
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(2);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.animationSelect(constants.rightTopElementClass, constants.rightTop, 0);
		this.setSequenceValue();
  },
	incrementLeftBottom: function(){
		this.setState( { leftBottom: this.state.leftBottom + 1 } );
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(4);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.animationSelect(constants.leftBottomElementClass, constants.leftBottom, 0);
		this.setSequenceValue();
  },
	incrementRightBottom: function(){
		this.setState( { rightBottom: this.state.rightBottom + 1 } );
		this.setState({total: this.state.total + 1});
		this.state.pressedSequence.push(3);	
		this.setState({pressedSequence: this.state.pressedSequence});
		this.animationSelect(constants.rightBottomElementClass, constants.rightBottom, 0);
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
	keyQ: function(){
		this.audio(constants.leftTop);
	},
	keyW: function(){
		this.audio(constants.rightTop);
	},
	keyA: function(){
		this.audio(constants.leftBottom);
	},
	keyS: function(){
		this.audio(constants.rightBottom);
	},
	animateSecuence: function() {	
		var elementToAnimate='';
		var audioElement='';
		var delay = 800;
		for(var counter=0; counter<= this.state.sequence.length-1; counter++){
				switch (this.state.sequence[counter]){
					case 1:
						elementToAnimate = constants.leftTopElementClass;
						audioElement = constants.leftTop;
						break;
					case 2:
						elementToAnimate = constants.rightTopElementClass;
						audioElement = constants.rightTop;
						break;
					case 3:
						elementToAnimate = constants.rightBottomElementClass;
						audioElement = constants.rightBottom;
						break;
					case 4:
						elementToAnimate = constants.leftBottomElementClass;
						audioElement = constants.leftBottom;
						break;
				}
			this.animationSelect(elementToAnimate, audioElement, delay);
			delay+=800;
		}
	},
	animationSelect: function(element, audioElement,  delay){
		var scope = this;
		setTimeout(function(){	
			$(element).animate({
				opacity: "0"
			}, 100, function() {
				$(element).animate({opacity:"1"});
				scope.audio(audioElement);			
			});	
		}, delay);
		
		
		//this.audio(audioElement);
		
	},
	increaseSecuence: function(){
		this.state.gameNumber = this.state.gameNumber + 1;
		this.setState({gameNumber: this.state.gameNumber});
		this.generateSequence();
		this.gameLevel();
	},
	gameLevel: function(){
		switch (GameVariables.level) {
			case 'rotational':
				var randomRotation =  Math.floor((Math.random()* 360)+1);
				this.containerRotation(randomRotation);		
				break;
			case 'overlap':
				this.containerOverlap();
				break;
			case 'blind':
				$('.simonContainer').hide();
				break;
		}
	},
	containerRotation:function(angle){
		$('.simonContainer').animate({  borderSpacing: angle }, {
    step: function(angle,fx) {
      $(this).css('-webkit-transform','rotate('+angle+'deg)'); 
      $(this).css('-moz-transform','rotate('+angle+'deg)');
      $(this).css('transform','rotate('+angle+'deg)');
		},
			duration:'slow'
		},'linear');
	},
	containerOverlap: function(){
		var blocks = $('.simonBlock');
		var bgColors = [];
		
		$.each(blocks, function(key, value){
			bgColors.push($(value).css('background-color'));
		});
			
		$.each(blocks, function(key,value){			
			$(value).css('background-color', bgColors[(bgColors.length - 1)-key]);
		});
	},
	audio:function(soundPath){
	 var context = this.state.audioContext;
    // Create lineOut
    var lineOut = new WebAudiox.LineOut(this.state.audioContext);

    // load a sound and play it immediatly
    WebAudiox.loadBuffer(context, soundPath, function(buffer){
        // init AudioBufferSourceNode
        var source  = context.createBufferSource();
        source.buffer   = buffer;
        source.connect(lineOut.destination);

        // start the sound now
        source.start(0);
    });
	},
	setSequenceValue: function(){	
		var totalElements = this.state.sequence.length;
		var totalElementsPressed = this.state.pressedSequence.length;
		
		if (totalElementsPressed <= totalElements){
			for(var arrayCount=0; arrayCount <= totalElementsPressed - 1; arrayCount++){			
				if(this.state.pressedSequence[arrayCount] === this.state.sequence[arrayCount]){
					if ((arrayCount+1) === totalElements){
						this.clear();
						this.increaseSecuence();
					}
				} else {
					this.clear();
					this.gameOver();
					break;
				}
			}
		}				
	},
	startGame: function() {
		this.clearGame();
		this.generateSequence();
		this.gameLevel();
	},
	returnIntro: function(){
		this.clearGame();
		$(GameVariables.gameContainer).addClass('hide');
		$(GameVariables.introContainer).removeClass('hide');
	},
	savePoints: function(){
		var loadSavedData = JSON.parse(localStorage.getItem('brainBreak'));
		var gameDate = GameVariables.dateNow();
		var currentScore = {'level': GameVariables.level, 'score': this.state.gameNumber, 'date': gameDate};
		var score = [];
		score.push(currentScore);
		
		if (loadSavedData){
			loadSavedData.push(currentScore);	
		} else {
			loadSavedData = score;
		}
		
		localStorage.setItem('brainBreak', JSON.stringify(loadSavedData));
	},
	gameOver: function() {
		if (this.state.gameNumber > this.state.maxScore) {
			this.state.maxScore = this.state.gameNumber;
			this.setState({maxScore: this.state.maxScore });
		}
		this.savePoints();
		this.audio(constants.errorSound);
		$('.gameOver').show();
		$('.newGame').text('Restart Game');
	},
	clearGame: function() {
		this.clear();
		$('.gameOver').hide();
		$('.simonContainer').show();
		this.state.gameNumber = 1;
		this.setState({gameNumber: this.state.gameNumber});
		this.containerRotation(0);
		$.each($('.simonBlock'), function(key, value){
			$(value).hasClass('simonLeftTop') ? $(value).css('background-color', GameVariables.initialColors.leftTopBackground ) : '';
			$(value).hasClass('simonRightTop') ? $(value).css('background-color', GameVariables.initialColors.rightTopBackground ) : '';
			$(value).hasClass('simonLeftBottom') ? $(value).css('background-color', GameVariables.initialColors.leftBottomBackground ) : '';
			$(value).hasClass('simonRightBottom') ? $(value).css('background-color',GameVariables.initialColors.rightBottomBackground ) : '';			
		});
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
				<div className="panel callout radius blindModeSteps hide">
					<p>Please use your keyboard, if you forget the sounds, use this buttons to test (with your mouse).</p>
						<ul className="button-group radius">
						<li><a href="#" className="small button success " onClick={this.keyQ}>Q</a></li>
						<li><a href="#" className="small button success " onClick={this.keyW}>W</a></li>
						<li><a href="#" className="small button success " onClick={this.keyA}>A</a></li>
						<li><a href="#" className="small button success " onClick={this.keyS}>S</a></li>
					</ul>
				</div>
				<div className="actionButtons">
					<NewGame onClick={this.startGame} />
					<ReturnIntro onClick={this.returnIntro} />
					<GameOver maxScore={this.state.maxScore} />
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
      <div onClick={this.clickHandler}  onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonLeftTop simonLeftTopBaseColor simonBlock">
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
      <div onClick={this.clickHandler} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonRightTop simonRightTopBaseColor simonBlock">
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
      <div onClick={this.clickHandler} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonLeftBottom simonLeftBottomBaseColor simonBlock">
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
      <div onClick={this.clickHandler} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} className="simonRightBottom simonRightBottomBaseColor simonBlock">
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
      <a onClick={this.clickHandler} className="newGame medium alert button">Start Game</a>
    );
  }
});

var ReturnIntro = React.createClass({
	clickHandler: function (){
		this.props.onClick();
  },
  render: function(){
    return (
      <a onClick={this.clickHandler} className="returnIntro medium button">Return</a>
    );
  }
});

var GameOver = React.createClass({
  render: function(){
    return (
      <div className="gameOver">
				<h3>Game Over!</h3>
			  <p>Your Max Score: {this.props.maxScore} </p>
			</div>
    );
  }
});

React.render(
  <SimonWrapper/>,
	document.getElementsByClassName('content')[0]
);

/*External Components*/
var IntroWrapper = React.createClass({
	clickBasic: function (){
		GameVariables.changeLevel('basic');
		$('.blindModeSteps').addClass('hide');
		$('.simonContainer').removeClass('hide');
		this.loadIntroAnimation();
  },
	clickRotational: function(){
		GameVariables.changeLevel('rotational');
		$('.blindModeSteps').addClass('hide');
		$('.simonContainer').removeClass('hide');
		this.loadIntroAnimation();
	},
	clickOverlap: function(){
		GameVariables.changeLevel('overlap');
		$('.blindModeSteps').addClass('hide');
		$('.simonContainer').removeClass('hide');
		this.loadIntroAnimation();
	},
	clickBlind: function(){
		GameVariables.changeLevel('blind');
		$('.blindModeSteps').removeClass('hide');
		$('.simonContainer').addClass('hide');
		this.loadIntroAnimation();
	},
	loadIntroAnimation: function(){
		$(GameVariables.gameContainer).removeClass('hide');
		$(GameVariables.introContainer).addClass('hide');
	},
  render: function(){
    return (
			<div className="introWrapper">
				<h2>Welcome to Brain Break!</h2>
				<p className="panel">Brain Break! is a game based on the principles of "Saimon Says" a game to
				exercise your memory, Brain Break has new challenges for your memory!</p>
				<div className="large-centered large-7 columns">
					<p>How is your memory today? try! and do your best!</p>
					<ul className="button-group round">
						<li><a href="#" onClick={this.clickBasic} className="button">Basic</a></li>
						<li><a href="#" onClick={this.clickRotational} className="button yellow">Rotational</a></li>
						<li><a href="#" onClick={this.clickOverlap} className="button orange">Overlap</a></li>
						<li><a href="#" onClick={this.clickBlind} className="button red">Blind</a></li>
					</ul>
				</div>
				<div className="best-points">
					<h4>Your Best Scores</h4>
					<ScoresTable scoreData="" />
				</div>
			</div>
    );
  }
});


var ScoreRow = React.createClass({
	render: function(){
		return(
			<tr>
				<td>{this.props.score.level}</td>
				<td>{this.props.score.score}</td>
				<td>{this.props.score.date}</td>
			</tr>
		);
	}
});

var ScoresTable = React.createClass({
  render: function() {
		var scoreData = JSON.parse(localStorage.getItem('brainBreak'));
		var sortedObjs = _.sortBy( scoreData, 'score' );
		var sortedObjs = sortedObjs.reverse();
		var scoreToShow = [];
		_.each(sortedObjs, function(key, value){
			if (value <= 4){
				scoreToShow.push(key);
			}
		});
		var rows = scoreToShow.map(function(score) {
			return <ScoreRow key={score.id} score={score} />;
		});
    return (
      <div className="scoresTable">
				<table>
					<thead>
						<tr>
							<td>Level</td>
							<td>Score</td>
							<td>Date</td>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
    );
  }
});



React.render(
  <IntroWrapper />,
	document.getElementsByClassName('intro-content')[0]
);