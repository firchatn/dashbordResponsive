// METER

var Meter = function Meter($elm, config) {

	// DOM
	var $needle = void 0,
	    $value = void 0;

	// Others

	var steps = (config.valueMax - config.valueMin) / config.valueStep,
	    angleStep = (config.angleMax - config.angleMin) / steps;

	var margin = 10; // in %
	var angle = 0; // in degrees

	var value2angle = function value2angle(value) {
		var angle = value / (config.valueMax - config.valueMin) * (config.angleMax - config.angleMin) + config.angleMin;

		return angle;
	};

	this.setValue = function (v) {
		$needle.style.transform = "translate3d(-50%, 0, 0) rotate(" + Math.round(value2angle(v)) + "deg)";
		$value.innerHTML = config.needleFormat(v);
	};

	var switchLabel = function switchLabel(e) {
		e.target.closest(".meter").classList.toggle('meter--big-label');
	};

	var makeElement = function makeElement(parent, className, innerHtml, style) {

		var e = document.createElement('div');
		e.className = className;

		if (innerHtml) {
			e.innerHTML = innerHtml;
		}

		if (style) {
			for (var prop in style) {
				e.style[prop] = style[prop];
			}
		}

		parent.appendChild(e);

		return e;
	};

	// Label unit
	makeElement($elm, "label label-unit", config.valueUnit);

	for (var n = 0; n < steps + 1; n++) {
		var value = config.valueMin + n * config.valueStep;
		angle = config.angleMin + n * angleStep;

		// Graduation numbers

		// Red zone
		var redzoneClass = "";
		if (value > config.valueRed) {
			redzoneClass = " redzone";
		}

		makeElement($elm, "grad grad--" + n + redzoneClass, config.labelFormat(value), {
			left: 50 - (50 - margin) * Math.sin(angle * (Math.PI / 180)) + "%",
			top: 50 + (50 - margin) * Math.cos(angle * (Math.PI / 180)) + "%"
		});

		// Tick
		makeElement($elm, "grad-tick grad-tick--" + n + redzoneClass, "", {
			left: 50 - 50 * Math.sin(angle * (Math.PI / 180)) + "%",
			top: 50 + 50 * Math.cos(angle * (Math.PI / 180)) + "%",
			transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
		});

		// Half ticks
		angle += angleStep / 2;

		if (angle < config.angleMax) {
			makeElement($elm, "grad-tick grad-tick--half grad-tick--" + n + redzoneClass, "", {
				left: 50 - 50 * Math.sin(angle * (Math.PI / 180)) + "%",
				top: 50 + 50 * Math.cos(angle * (Math.PI / 180)) + "%",
				transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
			});
		}

		// Quarter ticks
		angle += angleStep / 4;

		if (angle < config.angleMax) {
			makeElement($elm, "grad-tick grad-tick--quarter grad-tick--" + n + redzoneClass, "", {
				left: 50 - 50 * Math.sin(angle * (Math.PI / 180)) + "%",
				top: 50 + 50 * Math.cos(angle * (Math.PI / 180)) + "%",
				transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
			});
		}

		angle -= angleStep / 2;

		if (angle < config.angleMax) {
			makeElement($elm, "grad-tick grad-tick--quarter grad-tick--" + n + redzoneClass, "", {
				left: 50 - 50 * Math.sin(angle * (Math.PI / 180)) + "%",
				top: 50 + 50 * Math.cos(angle * (Math.PI / 180)) + "%",
				transform: "translate3d(-50%, 0, 0) rotate(" + (angle + 180) + "deg)"
			});
		}
	}

	// NEEDLE

	angle = value2angle(config.value);

	$needle = makeElement($elm, "needle", "", {
		transform: "translate3d(-50%, 0, 0) rotate(" + angle + "deg)"
	});

	var $axle = makeElement($elm, "needle-axle").addEventListener("click", switchLabel);
	makeElement($elm, "label label-value", "<div>" + config.labelFormat(config.value) + "</div>" + "<span>" + config.labelUnit + "</span>").addEventListener("click", switchLabel);

	$value = $elm.querySelector(".label-value div");
};

// DOM LOADED FIESTA

document.addEventListener("DOMContentLoaded", function () {

	var rpmMeter = new Meter(document.querySelector(".meter--rpm"), {
		value: 4,
		valueMin: 0,
		valueMax: 10,
		valueStep: 1,
		valueUnit: "<span>BAR</span><div></div>",
		angleMin: 30,
		angleMax: 330,
		labelUnit: "BAR",
		labelFormat: function labelFormat(v) {
			return Math.round(v);
		},
		needleFormat: function needleFormat(v) {
			return Math.round(v);
		}
		
	});

	var speedMeter = new Meter(document.querySelector(".meter--speed"), {
		value: 1,
		valueMin: 0,
		valueMax: 10,
		valueStep: 1,
		valueUnit: "<span>BAR</span><div></div>",
		angleMin: 30,
		angleMax: 330,
		labelUnit: "BAR",
		labelFormat: function labelFormat(v) {
			return Math.round(v);
		},
		needleFormat: function needleFormat(v) {
			return Math.round(v);
		}
	});

	var gearMeter = document.querySelector('.meter--gear div');

	// USER INPUTS

	document.onkeydown = keyDown;
	document.onkeyup = keyUp;

	function keyDown(e) {

		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			isAccelerating = true;
		} else if (e.keyCode == '40') {
			// down arrow
			isBraking = true;
		} else if (e.keyCode == '37') {// left arrow
		} else if (e.keyCode == '39') {// right arrow
		}
	}

	function keyUp(e) {

		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			isAccelerating = false;
		} else if (e.keyCode == '40') {
			// down arrow
			isBraking = false;
		} else if (e.keyCode == '37') {
			// left arrow
			gearDown();
		} else if (e.keyCode == '39') {
			// right arrow
			gearUp();
		}
	}

	function gearUp() {
		if (gear < gears.length - 1) {
			gear++;
			gearMeter.innerHTML = gear;
		}
	}

	function gearDown() {
		if (gear > 1) {
			gear--;
			gearMeter.innerHTML = gear;
		}
	}

	// VEHICLE CONFIG

	var mass = 1000,
	    cx = 0.28,
	    gears = [0, 0.4, 0.7, 1.0, 1.3, 1.5, 1.68],
	    transmitionRatio = 0.17,
	    transmitionLoss = 0.15,
	    wheelDiameter = 0.5,
	    brakeTorqueMax = 300,
	    gear = 1,
	    speed = 10,
	    // in km/h
	overallRatio = void 0,
	    wheelRpm = void 0,
	    wheelTorque = void 0,
	    brakeTorque = void 0,
	    resistance = void 0,
	    acceleration = void 0;

	// MOTOR CONFIG

	var rpmIdle = 1200,
	    rpmMax = 8000,
	    rpmRedzone = 6500,
	    torqueMin = 20,
	    // in m.kg
	torqueMax = 45,
	    // in m.kg

	torque = void 0,
	    rpm = 0,
	    isAccelerating = false,
	    isBraking = false;

	// Helper functions

	var torqueByRpm = function torqueByRpm(rpm) {
		var torque = torqueMin + rpm / rpmMax * (torqueMax - torqueMin);
		return torque;
	};

	function kmh2ms(speed) {
		// Km/h to m/s
		return speed / 3.6;
	}

	// Physics 101
	/* 
  * P = C w
  * P(hp) = C(m.kg) w(rpm) / 716
  *
  * F = m.a
  * Force(newton) = mass(kg) * acceleration (m/s)
  *
  * a = Cr / (r.m)
  * acceleration (m/s) = torqueWheel (m.kg) / (wheelRadius (m) * mass (kg))
  */

	var lastTime = new Date().getTime(),
	    nowTime = void 0,
	    delta = void 0;

	// MAIN LOOP

	(function loop() {
		window.requestAnimationFrame(loop);

		// Delta time
		nowTime = new Date().getTime();
		delta = (nowTime - lastTime) / 1000; // in seconds
		lastTime = nowTime;

		var oldSpeed = speed,
		    oldRpm = rpm;

		// Torque

		if (isAccelerating && rpm < rpmMax) {
			// Gas!
			torque = torqueByRpm(rpm);
		} else {
			torque = -(rpm * rpm / 1000000);
		}

		if (isBraking) {
			// Ooops...
			brakeTorque = brakeTorqueMax;
		} else {
			brakeTorque = 0;
		}

		overallRatio = transmitionRatio * gears[gear];
		wheelTorque = torque / overallRatio - brakeTorque;

		acceleration = 20 * wheelTorque / (wheelDiameter * mass / 2);
		resistance = 0.5 * 1.2 * cx * kmh2ms(speed) ^ 2;

		// Speed

		speed += (acceleration - resistance) * delta;

		if (speed < 0) {
			speed = 0;
		}

		wheelRpm = speed / (60 * (Math.PI * wheelDiameter / 1000));
		rpm = speed / (60 * transmitionRatio * gears[gear] * (Math.PI * wheelDiameter / 1000));

		// Idle
		if (rpm < rpmIdle) {
			rpm = oldRpm;
			speed = oldSpeed;
		}

		// Gear shifter
		if (rpm > rpmRedzone) {
			gearMeter.classList.add('redzone');
		} else {
			gearMeter.classList.remove('redzone');
		}

		// Update GUI

		speedMeter.setValue(speed);
		rpmMeter.setValue(rpm);

		// Update engine sound
		if (source) {
			source.playbackRate.value = rpm / 4000;
		}

		if (source2) {
			source2.playbackRate.value = speed / 500;
		}
	})();

	///////////////////////////////////////////////
	// WEBAUDIO

	// Courtesy of https://mdn.github.io/decode-audio-data/

	// define variables

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var source, source2, gainNode;
	var songLength;

	var loader = document.querySelector('.loader');
	var btnVolume = document.querySelector('.btn-volume');

	// use XHR to load an audio track, and
	// decodeAudioData to decode it and stick it in a buffer.
	// Then we put the buffer into the source

	function getData() {
		source = audioCtx.createBufferSource();
		source2 = audioCtx.createBufferSource();
		var request = new XMLHttpRequest();

		request.open('GET', 'https://mdn.github.io/decode-audio-data/viper.ogg', true);
		request.responseType = 'arraybuffer';

		request.onload = function () {
			var audioData = request.response;

			audioCtx.decodeAudioData(audioData, function (buffer) {
				var myBuffer = buffer; // local buffer ?
				var myBuffer2 = buffer;
				//				songLength = buffer.duration; // in seconds
				source.buffer = myBuffer;
				source2.buffer = myBuffer2;

				source.loop = true;
				source2.loop = true;

				// Hacky granular engine sound!
				source.loopStart = 0.605;
				source.loopEnd = 0.650;

				source2.loopStart = 0.605;
				source2.loopEnd = 0.650;

				source.playbackRate.value = 1;
				source2.playbackRate.value = 1;

				// Create a gain node.
				gainNode = audioCtx.createGain();
				// Connect the source to the gain node.
				source.connect(gainNode);
				source2.connect(gainNode);
				// Connect the gain node to the destination.
				gainNode.connect(audioCtx.destination);

				// Remove loader
				loader.classList.remove('active');
			}, function (e) {
				"Error with decoding audio data" + e.err;
			});
		};

		request.send();
	}

	// wire up buttons

	btnVolume.onclick = function () {
		this.classList.toggle('active');

		if (this.classList.contains('active')) {
			gainNode.gain.value = 1;
		} else {
			gainNode.gain.value = 0;
		}
	};

	// Load the sample
	getData();
	// Launch loop playing
	source.start(0);
	source2.start(0);
});