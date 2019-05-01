$(document).ready(function(){

	// size constants ; size%15 = 0
	const width = 450;
	const height = 450;
	
	const container = $('div#snakeContainer');
	const snakeBody = $('#snakePieces');
	let snakeScore = $('div #snakeScore');
	let Gameover = false;
	let StartTriggered = false;
	window.timerSetting = 200;
	
	// initial positions; 4 items;
	var positionList = {
		top: [0],
		left: [0]
		};
	
	var direction = {
		horizontal: 0,
		vertical: 0
	};



	var getNextPosition = function(elem){
		var position = {};
        //***
		if(direction.horizontal == 1 || direction.horizontal == -1) {
		position.left = Number($(elem).css('left').replace('px','')) + (direction.horizontal * 15);	
		position.top = Number($(elem).css('top').replace('px',''));	
		}
		if(direction.vertical == 1 || direction.vertical == -1) {
		position.top = Number($(elem).css('top').replace('px','')) + (direction.vertical * 15);
		position.left = Number($(elem).css('left').replace('px',''));	
		}
		
		var elemPos = {top: $(elem).css('top').replace('px',''), left:  $(elem).css('left').replace('px','') };
		
		// Stop snake and trigger gameover in case it touches borders
		if((elemPos.top == $(snakeBody).height()-15) && direction.vertical == 1) {
			position.top = $(snakeBody).height()-15;
			TriggerGameOver();
		}
		if(elemPos.top == 0 && direction.vertical == -1) {
			position.top = 0;
			TriggerGameOver();
		}
		if(elemPos.left == $(snakeBody).width()-15  && direction.horizontal == 1) {
			position.left = $(snakeBody).width()-15;
			TriggerGameOver();
		}
		if(elemPos.left == 0  && direction.horizontal == -1) {
			position.left = 0;
			TriggerGameOver();
		}

		return position;
	};

	var getElement = function(){
		var targetArea = {
			top: Number($('.snakeBody:first').css('top').replace('px','')) + (direction.vertical && direction.vertical * 15),
			left: Number($('.snakeBody:first').css('left').replace('px','')) + (direction.horizontal && direction.horizontal * 15)
		};
		return $(document.elementFromPoint(targetArea.left, targetArea.top));
	};

	var saveGameData = function(){
		localStorage.setItem('positionList', JSON.stringify(positionList));
		localStorage.setItem('direction', JSON.stringify(direction));
	};


	// key counter for first start
	let keyCounter = 0;
	$(document).keydown(function(e){

		// accept arrow keys and space key (if game is not over)
		if(($.inArray(e.keyCode , [32,37,38,39,40]) == -1) || Gameover == true) { return; } else { keyCounter++; }
		if(keyCounter==1) { TriggerStart(); }

		if(e.keyCode == 32){
			saveGameData();
			(getElement().length > 0) && (getElement()[0].click());
			e.preventDefault();
			return;
		}



		// keyboard listener to Prevent Redirection on same axis	
		if(e.keyCode) {	
			let key = e.keyCode;	
			if (key == 37 && direction.horizontal == 0) { direction.horizontal = -1; direction.vertical = 0; } // arrow left
			else if(key == 39 && direction.horizontal == 0) { direction.horizontal = 1; direction.vertical = 0; }  // arrow right
			else if(key == 38 && direction.vertical == 0) { direction.vertical = -1; direction.horizontal = 0;  } // arrow up
			else if(key == 40 && direction.vertical == 0) { direction.vertical = 1; direction.horizontal = 0; }  // arrow down
			else e.preventDefault();

		}	

	});


		TriggerNewBait();

	window.snakeMover = setInterval(snakeMoverFunction, window.timerSetting);
			window.snakePCS = 1;
function snakeMoverFunction() {
			if(StartTriggered==true) {
					
		$('.snakeBody').each(function(key){
			positionList[key] = {
				top: Number($(this).css('top').replace('px','')),
				left: Number($(this).css('left').replace('px',''))
			};
	


		if(window.baitPos.left == positionList[0].left && window.baitPos.top == positionList[0].top) {

		if(window.snakePCS == 1) {
		var lastPos = { top: $('.snakeBody:last').css('top').replace('px',''),
					    left: $('.snakeBody:last').css('left').replace('px','')
		};
		}
		else {
		var lastPos = { top: $('.snakeBody').eq(window.snakePCS-2).css('top').replace('px',''),
					    left: $('.snakeBody').eq(window.snakePCS-2).css('left').replace('px','')
		};
		console.log(lastPos);
		}
		
		snakeBody.append('<div class="snakeBody"></div>').css(lastPos);
		window.snakePCS++;
		TriggerNewBait();
		}

		
			if(key == 0) {
				$(this).css(getNextPosition($(this)));
		
			}
			else if(key > 0 && Gameover != true) {
				let prevTop = positionList[key-1].top;
				let prevLeft = positionList[key-1].left;		
				$(this).css('top', prevTop-15).css('left', prevLeft);	
		
			}
		});
			}

	
}	


	snakeBody.append('<div class="snakeBody"></div>');
	var snakeFirstChild = $('.snakeBody:first-child');
	
	snakeFirstChild.css('top', positionList.top[0]);
	snakeFirstChild.css('left', positionList.left[0]);

	/*
	$(positionList.top).each(function (key, element) {
		snakeBody.append(snakeFirstChild.clone());
	});
	*/

function TriggerStart() {
	
	// fadeout big text
	$('.bigText').fadeOut();
	
	// Trigger new bait and show it slowly at first time
	$('#snakeBait').fadeIn(500);
	
	let snakeSecond = 0;
	let snakeSecondText;
	let snakeScoreVal = snakeScore.text();

	var secondInterval = setInterval(function () {
		if(Gameover == false) {
	snakeSecond++;
	snakeScoreVal++;
	$('#snakeTime').text(snakeSecond);
	$('#snakeScore').text(snakeScoreVal);
		}
	}, 500);

	StartTriggered = true;
}

function TriggerGameOver() {
	Gameover = true;
	var pos = {top: $('.snakeBody:first').css('top'), left: $('.snakeBody:first').css('left')};
	console.log(pos);
	// fade in big text
	$('.bigText').html('Game Over &#9785;<br /><br />Your Score is: '+snakeScore.text());
	$('.bigText').fadeIn();
	$('#snakeBait').fadeOut();
	clearInterval(snakeMover);	

}

function TriggerNewBait() {

	// randomly locate new bait
	var offSetsX = Math.floor(Math.random() * Math.ceil(width / 15) + 1);
	var offSetsY = Math.floor(Math.random() * Math.ceil(height / 15) + 1);
	$('#snakeBait').css('top', (offSetsX-1) * 15);
	$('#snakeBait').css('left', (offSetsY-1) * 15);

	window.baitPos = {
		top: (offSetsX-1) * 15,
		left: (offSetsY-1) * 15
	};
	
	/* accelerattor
					var TotalPieces = $('.snakeBody').length;
					if(TotalPieces > 1) {
					clearInterval(window.snakeMover);	
					let newTimer = window.timerSetting - ((TotalPieces) * 4);
					if(newTimer < 100) { newTimer = 100; }
					let snakeMover = setInterval(snakeMoverFunction, window.timerSetting);
					console.log(newTimer);
					}
	*/				
	
}

});