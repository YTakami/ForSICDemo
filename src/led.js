// KPR Script file
// KPR Script file
exports.pins = {
    led1: {type: "Digital", direction: "output"},
    led2: {type: "Digital", direction: "output"},
    led3: {type: "Digital", direction: "output"},
    led4: {type: "Digital", direction: "output"},
    led5: {type: "Digital", direction: "output"},
    led6: {type: "Digital", direction: "output"},
    led7: {type: "Digital", direction: "output"},
    led8: {type: "Digital", direction: "output"},
    led9: {type: "Digital", direction: "output"},
    led10: {type: "Digital", direction: "output"},
    led11: {type: "Digital", direction: "output"},
    led12: {type: "Digital", direction: "output"},
    led13: {type: "Digital", direction: "output"},
    led14: {type: "Digital", direction: "output"},
    led15: {type: "Digital", direction: "output"},
    led16: {type: "Digital", direction: "output"},
};

exports.configure = function() {
    this.led1.init();
    this.led2.init();
    this.led3.init();
    this.led4.init();
    this.led5.init();
    this.led6.init();
    this.led7.init();
    this.led8.init();
    this.led9.init();
    this.led10.init();
    this.led11.init();
    this.led12.init();
    this.led13.init();
    this.led14.init();
    this.led15.init();
    this.led16.init();
}

exports.turnOn1 = function() {
    this.led1.write(	1 );
}	
exports.turnOff1 = function() {
    this.led1.write( 0 );
}

exports.turnOn2 = function() {
    this.led2.write(	1 );
}	
exports.turnOff2 = function() {
    this.led2.write( 0 );
}

exports.turnOn3 = function() {
    this.led3.write(	1 );
}	
exports.turnOff3 = function() {
    this.led3.write( 0 );
}

exports.turnOn4 = function() {
    this.led4.write(	1 );
}
exports.turnOff4 = function() {
    this.led4.write( 0 );
}

exports.turnOn5 = function() {
    this.led5.write(	1 );
}	
exports.turnOff5 = function() {
    this.led5.write( 0 );
}

exports.turnOn6 = function() {
    this.led6.write(	1 );
}	
exports.turnOff6 = function() {
    this.led6.write( 0 );
}

exports.turnOn7 = function() {
    this.led7.write(	1 );
}	
exports.turnOff7 = function() {
    this.led7.write( 0 );
}

exports.turnOn8 = function() {
    this.led8.write(	1 );
}	
exports.turnOff8 = function() {
    this.led8.write( 0 );
}

exports.turnOn9 = function() {
    this.led9.write(	1 );
}	
exports.turnOff9 = function() {
    this.led9.write( 0 );
}

exports.turnOn10 = function() {
    this.led10.write(	1 );
}	
exports.turnOff10 = function() {
    this.led10.write( 0 );
}

exports.turnOn11 = function() {
    this.led11.write(	1 );
}	
exports.turnOff11 = function() {
    this.led11.write( 0 );
}

exports.turnOn12 = function() {
    this.led12.write(	1 );
}	
exports.turnOff12 = function() {
    this.led12.write( 0 );
}

exports.turnOn13 = function() {
    this.led13.write(	1 );
}	
exports.turnOff13 = function() {
    this.led13.write( 0 );
}

exports.turnOn14 = function() {
    this.led14.write(	1 );
}	
exports.turnOff14 = function() {
    this.led14.write( 0 );
}

exports.turnOn15 = function() {
    this.led15.write(	1 );
}	
exports.turnOff15 = function() {
    this.led15.write( 0 );
}

exports.turnOn16 = function() {
    this.led16.write(	1 );
}	
exports.turnOff16 = function() {
    this.led16.write( 0 );
}

exports.close = function() {
	this.led1.close();
	this.led2.close();
	this.led3.close();
	this.led4.close();
	this.led5.close();
	this.led6.close();
	this.led7.close();
	this.led8.close();
	this.led9.close();
	this.led10.close();
	this.led11.close();
	this.led12.close();
	this.led13.close();
	this.led14.close();
	this.led15.close();
	this.led16.close();
}
