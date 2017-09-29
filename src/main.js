import * as opentype from '/node_modules/opentype.js/dist/opentype.js`';
var defaultParams = {
		inputString: 'Hello',
		parentElement: 'my-div',
		fontFile: '/fonts/abc5.otf',
		fontSize: 75,
		fontColor: 'Red',
		animationType: 'oneByOne',
		duration: 1,
		delay: 0
	},
	init = function(inputString, divId, options) {
		Object.assign(defaultParams, { inputString: inputString }, { divId: divId }, options);
	},
	setSvgHeader = function(width, height) {
		var parentElement = document.querySelector(defaultParams.parentElement);
		parentElement.innerHTML =
			'<svg width=' +
			width +
			' height=' +
			height +
			' version="1.1" xmlns="http://www.w3.org/2000/svg" id="handwriting_svg"></svg>';
	},
	generateSvg = function() {
		opentype.load('/fonts/abc5.otf', function(err, font) {
			if (err) {
				alert('Font could not be loaded: ' + err);
			} else {
				var paths = [],
					parentElement = document.querySelector(defaultParams.parentElement),
					svgElement,
					svgPaths,
					splitSring = defaultParams.inputString.split(''),
					x = parentElement.getBoundingClientRect().left,
					y = 100,
					width = parentElement.getBoundingClientRect().width,
					height = 100;

				setSvgHeader(width, height);

				svgElement = document.getElementById('handwriting_svg');

				svgPaths = document.querySelectorAll('#handwriting_svg path');

				for (var i = 0; i < splitSring.length; i++) {
					if (i > 0) {
						x += svgPaths[i - 1].getBoundingClientRect().width;
					}
					if (splitSring[i] == ' ') x += defaultParams.fontSize / 2;
					paths.push(font.getPath(splitSring[i], x, y, defaultParams.fontSize));
					var html = paths[i].toSVG(2);
					svgElement.innerHTML += html;
				}
			}
		});
	},
	animateSvg = function() {
		svgElement = document.getElementById('handwriting_svg');

		svgPaths = document.querySelectorAll('#handwriting_svg path');
		for (var i = 0; i < svgPaths.length; i++) {
			var length = svgPaths[i].getTotalLength();

			svgPaths[i].setAttribute('stroke', defaultParams.fontColor);
			svgPaths[i].setAttribute('fill', 'none');
			svgPaths[i].setAttribute('stroke-width', '5');

			// Clear any previous transition
			svgPaths[i].style.animation = path.style.WebkitTransition = 'none';
			// Set up the starting positions
			svgPaths[i].style.strokeDasharray = length + ' ' + length;
			svgPaths[i].style.strokeDashoffset = length;
			// Trigger a layout so styles are calculated & the browser
			// picks up the starting position before animating
			svgPaths[i].getBoundingClientRect();
			// Define our transition
			svgPaths[i].style.animation = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
			svgPaths[i].style.animationDelay = path.style.webkitTransitionDelay = i * 2 + 's';
			// Go!
			svgPaths[i].style.strokeDashoffset = '0';
		}
	};

var HandWriting = function(inputString, divId, options) {
	init();
	generateSvg();
	animateSvg();
};

window.HandWriting = HandWriting;
