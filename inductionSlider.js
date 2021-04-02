function Scrollbar(x,y,w,h,minV,maxV,initV){
    this.x = x; 
	this.y = y; 
	this.w = w; 
	this.h= h;
    this.hh=h/2;	
	this.minV = minV; 
	this.maxV = maxV; 
	this.initV = initV;
    this.readyToChange=false;	
	this.isChanging=false;   
	this.canvasS = document.createElement("canvas");
	this.canvasS.style.position = "absolute";
	this.canvasS.width = this.w;
	this.canvasS.height = this.h;
 
    this.canvasS.style.zIndex="8";
	this.div = document.createElement("div");
    document.body.appendChild(this.div);
    this.div.appendChild(this.canvasS);	
	this.canvasSPosition();
    this.canvasS.addEventListener('mousedown',this.mouseDown.bind(this),false);
    this.canvasS.addEventListener('mousemove',this.mouseMove.bind(this),false);
    this.canvasS.addEventListener('mouseup',this.mouseUp.bind(this),false);
	this.canvasS.addEventListener('mouseout',this.mouseOut.bind(this),false);

	this.canvasS.addEventListener('touchstart', this.touchStart.bind(this), false);
	this.canvasS.addEventListener('touchmove', this.touchMove.bind(this), false); 
	this.canvasS.addEventListener('touchend', this.touchEnd.bind(this), false);
	
	this.cxtS = this.canvasS.getContext("2d");
	this.getInitPointerX();
	this.drawScrollbar();
   }
   
Scrollbar.prototype.canvasSPosition = function(){	
	this.canvasS.style.left = String(this.x + canvasLeft)+"px";
    this.canvasS.style.top = String(this.y + canvasTop)+"px";
}
   
Scrollbar.prototype.getInitPointerX = function(){
    this.pointerX = Math.round((this.initV-this.minV)*(this.w-12)/(this.maxV-this.minV))+6;
};
  
Scrollbar.prototype.value= function(){
return Math.round((this.pointerX-6)*(this.maxV-this.minV)/(this.w-12) + this.minV);
};
  
Scrollbar.prototype.drawScrollbar=function(){	
	this.cxtS.fillStyle = "orangered";
	this.cxtS.fillRect(0,0,this.w,this.h);	
	this.cxtS.fillRect(0,0,this.w,this.h);
	this.cxtS.fillStyle = "palegreen";
	this.cxtS.fillRect(0+6,this.hh-3,this.w-12,6);
	this.cxtS.fillStyle = "pink";	
	this.cxtS.fillRect(this.pointerX-2,this.hh-10,4,20);
	this.cxtS.fillStyle = "black";	
	this.cxtS.fillRect(this.pointerX-7,this.hh-10,6,20);
	this.cxtS.fillRect(this.pointerX+1,this.hh-10,5,20);
};	

// mouse events
Scrollbar.prototype.mouseDown = function(evt){ 
evt.preventDefault();
var coord = this.getMousePointerCoord(evt);
var mx = coord.x,my = coord.y; 
if (this.readyToChange ||(mx >= 0 && mx <= this.w-0 && my > this.hh-5 & my < this.hh+5)){

this.isChanging=true;
this.div.style.cursor = "ew-resize";
this.pointerX = mx;
	if (this.pointerX <= 6){
		this.pointerX = 6;
		}
	else if(this.pointerX >= this.w-6){
		this.pointerX = this.w-6;  
		}
	actionWhenSliderIsChanging();
	this.drawScrollbar();		
}
};

Scrollbar.prototype.mouseMove = function(evt){
var coord = this.getMousePointerCoord(evt);
var mx = coord.x,my = coord.y; 
evt.preventDefault();
if (this.isChanging){
	this.pointerX = mx; 
	if (this.pointerX <= 6){
		this.pointerX = 6;
		}
	else if(this.pointerX >= this.w-6){
		this.pointerX = this.w-6;  
		}
	else{
		}
	actionWhenSliderIsChanging();		
	this.drawScrollbar();	
}
 
else{ 
   if (mx > this.pointerX-5 && mx < this.pointerX+5 && my > this.hh-10 && my < this.hh+10){
	   this.readyToChange = true;
	   this.div.style.cursor = "ew-resize";
		}
   else{
	   this.readyToChange=false;
	   this.div.style.cursor = "default";
       }  
  } 
};

Scrollbar.prototype.mouseUp = function(evt){
 this.readyToChange = false;
 this.isChanging=false;
 this.div.style.cursor = "default";
};

Scrollbar.prototype.mouseOut = function(evt){
 this.isChanging=false;
 this.readyToChange = false;
 this.div.style.cursor = "default";
};

Scrollbar.prototype.getMousePointerCoord=function(evt){
   var rect = canvas.getBoundingClientRect();  
   var x =  evt.clientX-rect.left-parseInt(canvas.style.borderLeftWidth)-parseInt(canvas.style.paddingLeft)-this.x;			 
   var y =  evt.clientY-rect.top-parseInt(canvas.style.borderTopWidth)-parseInt(canvas.style.paddingTop)-this.y;			 
   return {x:x,y:y};
};
 
// touch events
Scrollbar.prototype.touchStart = function(evt){ 
var coord = this.getTouchCoord(evt);
var mx = coord.x; 
evt.preventDefault();
if (mx >= 0 && mx <= this.w-0){	
	this.isChanging=true;
	this.pointerX = mx;
		if (this.pointerX <= 6){
			this.pointerX = 6;
		}
		else if(this.pointerX >= this.w-6){
			this.pointerX = this.w-6;  
		}	
	actionWhenSliderIsChanging();
	this.drawScrollbar();
 } 
};

Scrollbar.prototype.touchMove = function(evt){
  if (this.isChanging){
	evt.preventDefault();
	var coord = this.getTouchCoord(evt);
	this.pointerX = coord.x; 
		if (this.pointerX <= 6){
			this.pointerX = 6;
		}
		else if(this.pointerX >= this.w-6){
			this.pointerX = this.w-6;  
		}
		else{		
		}
	actionWhenSliderIsChanging();	
	this.drawScrollbar();
  }
};

Scrollbar.prototype.touchEnd = function(evt){
	this.isChanging=false;  
};

Scrollbar.prototype.getTouchCoord=function(evt){
	var rect = canvas.getBoundingClientRect(); 
	var x =  evt.targetTouches[0].clientX-rect.left-parseInt(canvas.style.borderLeftWidth)-parseInt(canvas.style.paddingLeft)-this.x;			 
	var y =  evt.targetTouches[0].clientY-rect.top-parseInt(canvas.style.borderTopWidth)-parseInt(canvas.style.paddingTop)-this.y;			 
	return {x:x,y:y};
};