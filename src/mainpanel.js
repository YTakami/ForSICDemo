// KPR Script file
var count = 0;
var lineNo = 0;
var stride = 16;
var state = [];
var pulse1 = 1.1;
var pulse2 = 2.2;
var servostate = false;
var rotate = false;
var preset = require("./preset");
var maincontainer;
var toastcontainer;
//var heatstate = false;
var state = 0;
var bitmap = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var heatarray;

var heatingCursor = 0;

function calculateHeaterStates(bitmap, stage) {
	var lower = [0, 0, 0, 0, 0, 0, 0, 0];
	if (stage < 14) {
		for (var i=0; i<8; i++) {
			lower[i] = bitmap[stage][15-(i*2+1)];
		}
	}

	var higher = [0, 0, 0, 0, 0, 0, 0, 0];
	if (stage > 2) {
		for (var i=0; i<8; i++) {
			higher[i] = bitmap[stage-3][15-(i*2)];
		}
	}

	return lower.concat(higher);
};

var Startbehavior = function(){
}
Startbehavior.prototype = Object.create(Object.prototype, {
	onTouchBegan: {
		value: function(p) {
			p.interval = 3000;
            p.start();
			heatingCursor = 0;
			state = 0;
            p.first.string = "stage :  " +heatingCursor + " , state : " + state;
            heatstate = true;
            
            p.container.remove(maincontainer);
            p.container.add(toastcontainer);
		}
	},
	onTimeChanged: {
		value: function(p){			
            p.first.string = "stage :  " +heatingCursor + " , state : " + state;
			if(heatingCursor <= 16)
			{
				//burn
				if(state == 0)
				{
					var heatarray = calculateHeaterStates(bitmap_test,heatingCursor);				
					trace(heatarray+"\n");
					for(var x = 0; x < 16; ++x){
						if(heatarray[x] == 1){
							application.invoke(new MessageWithObject("pins:/light/turnOn"+(x+1)));//Check whether it works							
						}else{
							application.invoke(new MessageWithObject("pins:/light/turnOff"+(x+1)));//Check whether it works							
						}
					}
					p.interval = 5000;
	                state = 1;
	             //cool
	             }else if(state == 1){
					for(var x = 0; x < 16; ++x){
						application.invoke(new MessageWithObject("pins:/light/turnOff"+(x+1)));//Check whether it works							
					}	
					p.interval = 3000;
					state = 2;
					if(heatingCursor == 16)
					{
						heatingCursor++;
						state = 0;
					}
				//lift
	             }else if(state == 2){
	                for(var x=0;x<23;x++){
	            		application.invoke(new MessageWithObject("pins:/motor/pulse1", pulse1));
	            		application.invoke(new MessageWithObject("pins:/motor/pulse2", pulse2));
	            	}
	            	for(var x=0;x<4;x++){
	            		application.invoke(new MessageWithObject("pins:/motor/pulse2", pulse2));
	            	}
					heatingCursor++;			
	             	state = 0;
	             }
			}else{
				for(var x = 0; x < 16; ++x){
					application.invoke(new MessageWithObject("pins:/light/turnOff"+(x+1)));//Check whether it works							
				}	
			}
		}
	},
});

var ResetPanel = function () {
}
ResetPanel.prototype = Object.create(Object.prototype, {
	//to use onTouchBegan, container must be active = true
	onTouchBegan: {
		value: function(p) {
			if(!servostate){
				servostate = true;
                p.interval = 3000;//the interval to call onTimeChanged function
                p.start();
                rotate = true;
                p.first.string = "rotating";
                //100*20ms = 2000ms
				//change it according to interval
                for(var x=0;x<60;x++){
            		application.invoke(new MessageWithObject("pins:/motor/pulse1", 1.5));
            		application.invoke(new MessageWithObject("pins:/motor/pulse2", 1.1));
            	}
            	for(var x=0;x<50;++x){
            		application.invoke(new MessageWithObject("pins:/motor/pulse2", 1.1));
            	}
            }
            else{
                servostate = false;
                rotate = false;
                p.stop();
                p.first.string = "stop";
                for(var x=0;x<50;x++){
            		application.invoke(new MessageWithObject("pins:/motor/pulse1", 1.3));
            		application.invoke(new MessageWithObject("pins:/motor/pulse2", 1.3));
            	}
            }
		}
	},
	onTimeChanged:{
		value: function(p){
			rotate = !rotate;
			servostate = false;
            if(rotate) {
            	p.first.string = "rotating";
            }
            else {
            	p.first.string = "pause";
            }         
		}
	},
});

var LeftDownPanel = function () {
}
LeftDownPanel.prototype = Object.create(Object.prototype, {
	//to use onTouchBegan, container must be active = true
	onTouchBegan: {
		value: function(p) {
			if(!servostate){
				servostate = true;
                p.interval = 2000;//the interval to call onTimeChanged function
                p.start();
                rotate = true;
				//change it according to interval
                for(var x=0;x<20;x++){
            		application.invoke(new MessageWithObject("pins:/motor/pulse1", 1.5));
            	}
            }
		}
	},
	onTimeChanged:{
		value: function(p){
			servostate = false;		
			rotate = !rotate;
		}
	},
});

var RightDownPanel = function () {
}
RightDownPanel.prototype = Object.create(Object.prototype, {
	//to use onTouchBegan, container must be active = true
	onTouchBegan: {
		value: function(p) {
			if(!servostate){
				servostate = true;
                p.interval = 2000;//the interval to call onTimeChanged function
                p.start();
                rotate = true;
				//change it according to interval
                for(var x=0;x<20;x++){
            		application.invoke(new MessageWithObject("pins:/motor/pulse2", 1.1));
            	}
            }
		}
	},
	onTimeChanged:{
		value: function(p){
			servostate = false;		
			rotate = !rotate;
		}
	},
});
var Panel = function () {
}
Panel.prototype = Object.create(Object.prototype, {
	onTouchBegan: {
		value: function(p) {
			var x = p.variant%stride;
			var y = Math.floor(p.variant/stride);
			if(bitmap[y][x] == 0){
				p.skin = new Skin("black");
				state[p.variant] = true;
				bitmap[y][x] = 1;
			}else{
				p.skin = new Skin("white");
				state[p.variant] = false;
				bitmap[y][x] = 0;
			}
		}
	},
	onTimeChanged: {
		value: function(p){
			var x = p.variant%stride;
			var y = Math.floor(p.variant/stride);
			if(bitmap[y][x] == 1){
				p.skin = new Skin("black");
			}else{
				p.skin = new Skin("white");
			}
		}
	},
});
var Presetbehavior = function(name){
	this.name = name;
}
Presetbehavior.prototype = Object.create(Object.prototype, {
	name: { value: "", writable: true },
	onTouchBegan: {
		value: function(p) {
			if(this.name == "heart") bitmap = preset.heart();
			else if(this.name == "flower") bitmap = preset.flower();
			else if(this.name == "dog") bitmap = preset.dog();
			else if(this.name == "nyancat") bitmap = preset.nyancat(); 
			else if(this.name == "smile") bitmap = preset.smile();
			else if(this.name == "sad") bitmap = preset.sad();
			else if(this.name == "angry") bitmap = preset.angry();
			else if(this.name == "nothing") bitmap = preset.nothing();
			else if(this.name == "man") bitmap = preset.man();
			else if(this.name == "woman") bitmap = preset.woman();
			else if(this.name == "kuku") bitmap = preset.kuku();
			else if(this.name == "mk10") bitmap = preset.mk10();
			else if(this.name == "apple") bitmap = preset.apple();
			else if(this.name == "kinoma") bitmap = preset.kinoma();
			else if(this.name == "banana") bitmap = preset.banana(); 
		}
	},
});
// KPR Script file
var build = function(container) {
	container.skin = new Skin("blue");
	maincontainer = new Container({left:0,top:0, width:320,height:240 });
	for(var x = 0; x < 16; ++x){
		application.invoke(new MessageWithObject("pins:/light/turnOff"+(x+1)));//Check whether it works							
	}
    var l=15;	
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			state[i+j*stride] = false;
			var p = new Content({left:i*l + 10,top:j*l + 15, width:l,height:l },new Skin("white"));
			p.behavior = new Panel();
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
			p.start();
		}
	}    	
	var start = new Container({left:240,top:180, width:80,height:30 },new Skin("gray"));
	start.behavior = new Startbehavior();
	start.active = true;
	var te = new Style("bold 20px", "white");
	var label = new Label(null, null, te, "start");
	start.add(label);
	container.add(start);
	
	var l=2;
	
	var heart = preset.heart();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 15, width:l,height:l },new Skin("white"));
			if(heart[j][i]>0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("heart");
			p.active = true;
			p.variant = i + j*stride;
			maincontainer.add(p);
			//p.start();
		}
	}
	var flower = preset.flower();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 15, width:l,height:l },new Skin("white"));
			if(flower[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("flower");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	var dog = preset.dog();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 45, width:l,height:l },new Skin("white"));
			if(dog[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("dog");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	var nyancat = preset.nyancat();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 45, width:l,height:l },new Skin("white"));
			if(nyancat[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("nyancat");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	var apple = preset.apple();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 75, width:l,height:l },new Skin("white"));
			if(apple[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("apple");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	
	var banana = preset.banana();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 75, width:l,height:l },new Skin("white"));
			if(banana[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("banana");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	/*
	var smile = preset.smile();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 75, width:l,height:l },new Skin("white"));
			if(smile[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("smile");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	
	var sad = preset.sad();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 75, width:l,height:l },new Skin("white"));
			if(sad[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("sad");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	*/
	/*
	var angry = preset.angry();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 105, width:l,height:l },new Skin("white"));
			if(angry[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("angry");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	
	var nothing = preset.nothing();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 105, width:l,height:l},new Skin("white"));
			if(nothing[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("nothing");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	*/
	
	var man = preset.man();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 105, width:l,height:l },new Skin("white"));
			if(man[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("man");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	
	var woman = preset.woman();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 105, width:l,height:l },new Skin("white"));
			if(woman[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("woman");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	
	var kuku = preset.kuku();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 253,top:j*l + 135, width:l,height:l },new Skin("white"));
			if(kuku[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("kuku");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	
	var mk10 = preset.mk10();
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride-2;j++){
			var p = new Content({left:i*l + 288,top:j*l + 135, width:l,height:l },new Skin("white"));
			if(mk10[j][i] >0) p.skin = new Skin("black");
			p.behavior = new Presetbehavior("mk10");
			p.active = true;
			p.variant = i + j*16;
			maincontainer.add(p);
		}
	}
	container.add(maincontainer);
	
	//add these after start
	toastcontainer = new Container({left:0,top:0, width:320,height:240 });
	var ldb = new Container({left:0,top:0,right:240,bottom:180}, new Skin("green"));
	ldb.active = true;
	ldb.behavior = new LeftDownPanel();
	ldb.add(new Label(null,null, new Style("bold 50px", "red"), "L"));
	toastcontainer.add(ldb);

	var rdb = new Container({left:240,top:0,right:0,bottom:180}, new Skin("green"));
	rdb.active = true;
	rdb.behavior = new RightDownPanel();
	rdb.add(new Label(null,null, new Style("bold 50px", "red"), "R"));
	toastcontainer.add(rdb);

	var resetbutton = new Container({left:80,top:60,right:80,bottom:120}, new Skin("green"));
	resetbutton.active = true;
	resetbutton.behavior = new ResetPanel();
	var resettext = new Style("bold 50px", "red");
	var rlabel = new Label(null, null, resettext, "reset");
	resetbutton.add(rlabel);
	toastcontainer.add(resetbutton);

}

application.behavior = {
	onAdapt: function(application) {
		application.empty();
		build(application);
	},
	onLaunch: function(application) {
		build(application);
	},
}
//check the pins before you use the program
/*
application.invoke(new MessageWithObject( "pins:configure", {
	motor:{
		require: "servo",
        pins:{
        	motor1: {pin: 4},
        	motor2: {pin: 23}
		}
	},
		    light: {
		        require: "led",
		        pins: {
		        led1: {pin: 37},
		        led2: {pin: 6},
		        led3: {pin: 38},
		        led4: {pin: 8},
		        led5: {pin: 39},
		        led6: {pin: 10},
		        led7: {pin: 11},
		        led8: {pin: 12},
		        led9: {pin: 15},
		        led10: {pin: 16},
		        led11: {pin: 17},
		        led12: {pin: 18},
		        led13: {pin: 19},
		        led14: {pin: 20},
		        led15: {pin: 21},
		        led16: {pin: 22}
		        }
		    }
	}));
*/