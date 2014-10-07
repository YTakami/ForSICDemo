// KPR Script file

var pwmFrequency = 20;
var pulseWidth = 1.1;
var repeat = pwmFrequency - pulseWidth;


exports.pins = {
    motor1: {type: "Digital", direction: "output"},
    motor2: {type: "Digital", direction: "output"}    
};

exports.configure = function() {
    this.motor1.init();
    this.motor2.init();
}
exports.pulse1 = function(pw){

	pulseWidth = pw;
	repeat = pwmFrequency - pw;
	
    this.motor1.write(1);
    sensorUtils.udelay(pulseWidth * 1000);
    this.motor1.write(0);
    sensorUtils.udelay(repeat * 1000);
    
}
exports.pulse2 = function(pw){

	pulseWidth = pw;
	repeat = pwmFrequency - pw;
	
	this.motor2.write(1);
    sensorUtils.udelay(pulseWidth * 1000);
    this.motor2.write(0);
    sensorUtils.udelay(repeat * 1000);
}
exports.close = function() {
	this.motor1.close();
	this.motor2.close();
}
