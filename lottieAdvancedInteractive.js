/*
	THIS CODE IS VERY OLD.
	I was new to JavaScript and fairly new to HTML/CSS when I created this, so please don't judge the code quality. I just wanted to share this old project of mine.
*/

/* 	
Lottie Nonlinear Hover
Created by Joshua Silveous

Here's how it works:
	function lottieNonliniearHover(container, anim, timeframeArray, loopStart)
			container: 		The node location of the HTML container for the lottie (such as a <div>)
				e.x. 		document.querySelector('.lottie');

			anim: 			the animation instance (already instantiated for manipulation outside of function)
							!! LOOP AND AUTOPLAY SHOULD BE FALSE !!
				e.x. 		let animationInstance = bodymovin.loadAnimation({
								container: document.querySelector('.lottie'),
								renderer: 'svg',
								loop: false,
								autoplay: false,
								path: "https://www.myserver.com/assets/mylottie.json"});
							You would then input "animationInstance" for "anim".

			timeframeArray: This is the tricky one. This is an array of arrays that contain "sequences" in the 
							following format: [EntryStart, EntryEnd, ExitStart, ExitEnd].
							On hover, this will play frames EntryStart to EntryEnd, then move on to the next sequence in the list provided.
							IF the user were to take their mouse off while this sequence is playing (before EntryEnd but after EntryStart),
							then frames ExitStart to ExitEnd will play.
							Think of frames ExitStart to ExitEnd to be an exit plan for frames EntryStart to EntryEnd if interrupted.

				e.x. 		[ [0,50,100,110] , [50,100,110,120] ]
							In this instance, when the user hovers over the lottie, frames 0-50 will play. If they continue hovering, frames 50-100 will play right after.
							IF the user takes their mouse off during frames 0-50, then it'll jump to frames 100-110.
							IF the user takes their mouse off during frames 50-100, then it'll jump to frames 110-120.

				e.x. 		[ [0,50,0] , [50,100,100,120] ]
							When my function detects only 3 variables in one of the arrays provided, it'll assume you want to reverse to the timeframe at index 2.
							So, in this case, if frames 0-50 are interrupted, it'll reverse back to frame 0.
			
			loopStart:		Specifies which index in the previous array will the loop start at. This sequence, and following sequences, will be looped until hover is ended.
						
							

*/

function lottieNonlinearHover(container, anim, timeframeArray, loopStart) {
	let inLoop = false
	let exitframe
	let exitStart

	container.addEventListener('mouseenter', () => {
		let isFirst = false
		for (i = 0; i < timeframeArray.length; i++) {
			if (i == loopStart) {
				anim.loop = true
			}

			if (i == 0) {
				isFirst = true
			} else {
				isFirst = false
			}

			anim.playSegments([timeframeArray[i][0], timeframeArray[i][1]], isFirst)
		}
	})

	container.addEventListener('mouseleave', (e) => {
		anim.loop = false

		exitframe = Math.round(anim.currentFrame + anim.firstFrame)

		for (let i = 0; i < timeframeArray.length; i++) {
			if (exitframe > timeframeArray[i][0] && exitframe < timeframeArray[i][1]) {
				if (timeframeArray[i].length == 4) {
					exitStart = timeframeArray[i][2]
				} else {
					exitStart = exitframe
				}

				anim.playSegments(
					[exitStart, timeframeArray[i][timeframeArray[i].length - 1]],
					true
				)
			}
		}
	})
}
