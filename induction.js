var width,height;
var then,now,delta,interval;
var myrequest=0;
var cxt;
var leftHand,rightHand;
var reverse = 1,bStrength=50,velocity=0.15;
var barX = 15.0,barY= 30.0,arrowHalfLength=0,oldBX,oldMX,mouseX,initialX,finalX;
var forward = true,showForce=false;
var youPull = false,handPull=false;
var gld;
var leftOut,leftIn,topOut,topIn,canvasLeft,canvasTop,bSlider,velSlider;

	window.onload = function(){
	canvas = document.getElementById("induction");	
	leftHand = document.createElement("img");
	rightHand = document.createElement("img");
	leftHand.src = "left.gif";
	rightHand.src = "right.gif";

		if (canvas && canvas.getContext){
		
			leftOut = parseInt(canvas.style.left)+parseInt(canvas.style.marginLeft);
			leftIn = parseInt(canvas.style.borderLeftWidth)+parseInt(canvas.style.paddingLeft);
			topOut = parseInt(canvas.style.top)+parseInt(canvas.style.marginTop);
			topIn = parseInt(canvas.style.borderTopWidth)+parseInt(canvas.style.paddingLeft);
			canvasLeft = leftOut+leftIn;
			canvasTop = topOut+topIn;		
			
			var b1 = document.getElementById("bStart");
				b1.style.left = String(20+canvasLeft)+"px";
				b1.style.top = String(300+canvasTop)+"px";
			var b2 = document.getElementById("bStop");
				b2.style.left = String(160+canvasLeft)+"px";
				b2.style.top = String(300+canvasTop)+"px";
			var b3 = document.getElementById("ckb1");
				b3.style.left = String(165+canvasLeft)+"px";
				b3.style.top = String(345+canvasTop)+"px";			
			var b4 = document.getElementById("lb1");
				b4.style.left = String(190+canvasLeft)+"px";
				b4.style.top = String(345+canvasTop)+"px"
			var b5 = document.getElementById("ckb2");
				b5.style.left = String(10+canvasLeft)+"px";
				b5.style.top = String(345+canvasTop)+"px"; 
			var b6 = document.getElementById("lb2");
				b6.style.left = String(35+canvasLeft)+"px";
				b6.style.top = String(345+canvasTop)+"px"; 			
			var b7 = document.getElementById("lb3");
				b7.style.left = String(350+canvasLeft)+"px";
				b7.style.top = String(305+canvasTop)+"px"; 						
			var b8 = document.getElementById("lb4");
				b8.style.left = String(540+canvasLeft)+"px";
				b8.style.top = String(305+canvasTop)+"px"; 
			
			vSlider = new Scrollbar(280,320,212,50,10,40,15);
            bSlider = new Scrollbar(525,320,212,50,40,70,50); 
	
			canvas.addEventListener('mousedown',mouseDown,false);
			canvas.addEventListener('mousemove',mouseMove,false);
			canvas.addEventListener('mouseup',mouseUp,false);
			canvas.addEventListener('mouseout',mouseUp,false);
			canvas.addEventListener('touchstart', touchDown, false);
			canvas.addEventListener('touchmove', touchMove, false); 
			canvas.addEventListener('touchend', touchUp, false);
            canvas.addEventListener('touchleave', touchUp, false);
			
			cxt = canvas.getContext("2d");
			width = canvas.width;
			height = canvas.height;
			gld = cxt.createLinearGradient(0, 0, 1000, 0);
			gld.addColorStop(0,"rgb(166,176,156)");			       
			gld.addColorStop(1,"white");   
			paint(cxt);
		}
	}

	window.onunload = function(){
	stop();
	}
    
	function startv(){
	start();
    }

	function start(){
	  if (!myrequest){
		 then = Date.now();  
		 myrequest = window.requestAnimationFrame(animate);  
		 
		 if (!youPull){
		    velocity = vSlider.value()/100;
			interval = 5;
			handPull=true;
			}
		 else{
            velocity = 0;  		 	    
			interval = 0.1;
			initialX=mouseX;
			}
	   }
   }

	function stop(){
	  if (myrequest){
		window.cancelAnimationFrame(myrequest);
		myrequest = 0;
		handPull=false;
		youPull=false;
		arrowHalfLength = 0;		
		paint(cxt);
		}
	}

	function animate(time){ 

	if (canvas && canvas.getContext){ 
      now =  Date.now();    
	  myrequest = window.requestAnimationFrame(animate);    
	  delta = now - then;
	  if (delta > interval){
	  paint(cxt); 
	  then = now-(delta%interval);
      }	  
	}
	}

    function paint(g){
	   
	if (youPull)
        dragToGenerateEMF();
	if (handPull)
        calculate();
		
		var hotness = Math.abs(arrowHalfLength);
	    gld = g.createLinearGradient(0, 0, 1000-8*hotness, 0);
    	gld.addColorStop(0,"rgb(166,176,156)");			       
		gld.addColorStop(1,"white");	 
		
	    g.clearRect(0,0,width,height);
        g.fillStyle=gld;
        g.fillRect(0,0,width,height); 		
		
	    drawFilament(g);
		drawRails(g);			    	    
	    drawBar(g);
	    drawField(g);
	   g.fillStyle="orangered";
       g.fillRect(0,height-80,width,80); 
	}
	
	function calculate(){
    	 var interval=10;
         if (barX > 740 - 201)
		    forward = false;
		    
		 if (barX < 16)
		    forward = true;
		    
         	    if (forward){
            		barX+= velocity * interval;
                	arrowHalfLength  = velocity*bStrength*70.0/20.0;	
                    }
             	if (!forward){
            		barX-= velocity * interval;
            		arrowHalfLength  = -velocity*bStrength*70.0/20.0;            	    
            	    } 
    	}
	
	function dragToGenerateEMF(){
	            finalX=mouseX;
                velocity = 0.005*(finalX - initialX)/interval;
                if (velocity > 0.03)
                    velocity = 0.03;
                if (velocity < -0.03)
                    velocity = -0.03;               		
                arrowHalfLength  = velocity*bStrength*30.0;
				initialX=finalX;
	    }
	
	function drawRails(g){
		
		// top rail
    	g.fillStyle= "rgb(175,175,222)";    	
		g.fillRect(10,50,590,20);
		
		g.fillStyle= "rgb(122,122,166)";
        g.beginPath();
		g.moveTo(10,70);
		g.lineTo(600,70);
		g.lineTo(595,75);
		g.lineTo(5,75);
		g.closePath();   	    	    	
    	g.fill();

        g.beginPath();
        g.moveTo(10,50);
        g.lineTo(10,70);
        g.lineTo(5,75);
        g.lineTo(5,55);
        g.closePath(); 		    	  
    	g.fill(); 
    	 
    	g.fillStyle = "rgb(175,175,222)";
		g.fillRect(10,200,590,20);		    	    	    	 

		g.fillStyle = "rgb(122,122,166)";
        g.beginPath();
        g.moveTo(10,220);
        g.lineTo(600,220);
        g.lineTo(597,223);
        g.lineTo(7,223);   		
		g.closePath();
		g.fill();
 
    	g.beginPath();
        g.moveTo(10,200);
        g.lineTo(10,220);
        g.lineTo(7,223);
        g.lineTo(7,203);   		
		g.closePath();
		g.fill();
  	 
    	// draw wires ,meter    
        g.strokeStyle = "black"; 
		g.beginPath();
		g.moveTo(600,60);
		g.lineTo(620,60);
		g.lineTo(620,135);
		
		g.moveTo(620,135);
		g.lineTo(660,135);
		g.lineTo(660,126);
		
		g.moveTo(698,126);
		g.lineTo(698,140);
		g.lineTo(620,140);
		
		g.moveTo(620,140);
		g.lineTo(620,150);
		
		g.moveTo(620,190);
		g.lineTo(620,210);
		g.lineTo(600,210);
		g.stroke();

    	g.strokeStyle= "gray";
    	g.strokeRect(639,39,82,92);
    	
    	//
    	g.fillStyle = "gray";    	    	    	      	
    	g.fillRect(640,40,80,90);
    	g.fillStyle = "rgb(153,186,208)";
    	g.fillRect(642,42,76,60);
		
    	// drawpointer		
    	
		var theta = reverse*arrowHalfLength*0.0045;     //0.58/94.2
       
		if (theta > 0.5)
		    theta = 0.5;
		else if(theta <-0.5)
            theta = -0.5;  		
		 
    	var pointerX = Math.round(680.0+70.0*Math.sin(theta));
    	var pointerY = Math.round(120.0-70.0*Math.cos(theta));
    	g.strokeStyle = "rgb(255,217,198)";
    	g.lineWidth = 2;
		g.beginPath();
		g.moveTo(680,120);
		g.lineTo(pointerX,pointerY);
		g.stroke();    		
	    g.lineWidth=1;
    	
		g.fillStyle="rgb(113,146,168)";
   	   	g.fillRect(642,92,76,35); 
		
    	g.fillStyle = "red";
    	g.fillRect(657,125,6,6);
    	
    	g.fillStyle = "black";
    	g.fillRect(695,125,6,6);
       }
	   
	function drawField(g){
       	g.strokeStyle = "rgb(255,87,76)";
		g.fillStyle = "rgb(255,87,76)";
     	g.beginPath();
		var no = 100-Math.round(0.5*bStrength);
		for (var i = 0; i < 740 - 100;i+=no){
     		for (var j = 0; j < 300; j+=no){
     		 if (reverse ==1){              
			   g.moveTo(i,j);
			   g.lineTo(i+10,j+10);
			  
			   g.moveTo(i+10,j);
			   g.lineTo(i,j+10);
			   
              }
             if (reverse == -1){
               g.fillRect(i,j,2,2);
             }
      		   g.stroke();
         	}
     	  }
              		  
     	} 

    function drawBar(g){ 
       // drawBar  
        var ibarX = Math.round(barX);
        var ibarY = Math.round(barY);
        
		g.fillStyle = "lightGray";
		g.fillRect(ibarX,ibarY,5,210);
		
    	g.fillStyle = "gray";
		g.beginPath();
		g.moveTo(ibarX,ibarY);
		g.lineTo(ibarX,ibarY+210);
		g.lineTo(ibarX-2,ibarY+212);
		g.lineTo(ibarX-2,ibarY+2);
		g.closePath();
		g.fill();
		
        g.fillStyle = "darkGray";
		g.beginPath();
		g.moveTo(ibarX,ibarY+210);
		g.lineTo(ibarX+5,ibarY+210);
		g.lineTo(ibarX+3,ibarY+212);
		g.lineTo(ibarX-2,ibarY+212);
		g.closePath();
		g.fill();

    	  
    	// draw induced currents 
    	
    	
        var size2=Math.min(30,reverse*arrowHalfLength*0.5);	       
   
       if (reverse*arrowHalfLength <0)    
           size2 = Math.max(-30,reverse*arrowHalfLength*0.5); 
    	
    	arrowV(g,"blue",barX+2,barY+101-size2,barY+2+101+size2);        
        arrowH(g,"blue",barX/2+300+size2,60,barX/2+300-size2);
    	arrowH(g,"blue",barX/2+300-size2,210,barX/2+300+size2);    	
       
       
         if (showForce){            
           arrowH(g,"magenta",barX-1.0*arrowHalfLength,130,barX);
          }
        
		g.font = '12pt Arial,Helvetica,"Times New Roman","Noto Sans Condensed","DejaVu Sans Condensed",sans-serif';  
        g.textAlign = "left";
        g.textBaseline = "middle";
		
        if (arrowHalfLength > 2){
        	g.fillStyle = "blue";         	
            g.fillText("induced",ibarX-80,160);
            g.fillText("current",ibarX-80,180);            
            
            if (showForce){
			   g.fillStyle = "magenta";         	
               g.fillText("magnetic force",Math.round(barX-1.0*arrowHalfLength-115),115);
               }
        }
        if (arrowHalfLength <-2){
		    g.fillStyle = "blue";         	
            g.fillText("induced",ibarX+20,160);
            g.fillText("current",ibarX+20,180);   
            
             if (showForce){
			   g.fillStyle = "magenta";         	
               g.fillText("magnetic force",Math.round(barX-1.0*arrowHalfLength),115);

              }
        }
                   
        // draw polarity
            	var size= Math.min(15,Math.abs(arrowHalfLength)/2.0);
             if (reverse*arrowHalfLength > 2){
             	g.fillStyle= "red"; 
             	g.fillRect(ibarX,60-size,4,2*size);
                g.fillRect(ibarX+2-size,60-2,2*size,4);
             	            	
             	g.fillStyle = "black";
             	g.fillRect(ibarX+2-size,210-2,2*size,4);        
              	}      
              	
              if (reverse*arrowHalfLength < -2){
             	g.fillStyle = "black"; 
             	g.fillRect(ibarX+2-size,60-2,2*size,4);        
             	                        	
             	g.fillStyle = "red";
             	g.fillRect(ibarX,210-size,4,2*size);
                g.fillRect(ibarX+2-size,210-2,2*size,4);             	
             	
             	
               	} 
         // drawhand
               	  if (handPull && arrowHalfLength > 2)
                 	g.drawImage(rightHand,ibarX+3,115);
                  if (handPull && arrowHalfLength < -2)
                    g.drawImage(leftHand,ibarX-102,115); 	            
         
         // draw rubber bands       
                g.fillStyle = "rgb(140,140,140)";
                g.fillRect(10,48,4,26);
    	        g.fillRect(10,198,4,26);
    	        g.fillRect(740-195,48,4,26);
    	        g.fillRect(740-195,198,4,26);  
    	} 
	
	function drawFilament(g){
   	    var hotness = Math.abs(arrowHalfLength);     	
     	console.log(hotness);
		if (hotness !=0)
		   drawBrightness(g, hotness,620,170,42);
		  
		// color of filament
        var redi = Math.min(255,6*hotness);
	    var gbi = Math.min(255,4*hotness); 
		g.lineWidth = 3;	
		g.strokeStyle = "rgb("+redi+","+gbi+","+gbi+")";
       	g.beginPath();		
		g.arc(620,170,10,-Math.PI/2,Math.PI/2,false); 
        g.stroke();  
     	
        g.lineWidth = 2;
		g.strokeStyle = "black";
		g.beginPath();
        g.arc(620,170,22,0,Math.PI*2,false);
		g.stroke();
		g.lineWidth = 1;
		g.beginPath();
		g.moveTo(620,150);
		g.lineTo(620,160);
		g.moveTo(620,180);
		g.lineTo(620,190);
		g.stroke();
       } 
    
	function drawBrightness(g, strength, posX, posY, R){
     
	 var RR = R+Math.round(4*R*strength/100);
	 var strengthi = Math.round(strength);	 
     var redi= 50+Math.min(205,10*strengthi);  		 
	 var greeni = 50+Math.min(205,6*strengthi);  	 	
	 var grd = g.createRadialGradient(posX, posY, 0, posX, posY, RR);
     grd.addColorStop(0.2,"rgb("+redi+","+greeni+","+"50)");
     grd.addColorStop(1,"rgba(255,255,255,0)");
     g.fillStyle = grd;
     g.beginPath();
	 g.arc(posX,posY,RR,0,Math.PI*2);
     g.fill();     
	 }

	   
    function arrowH(g,c,x1,y1,x2){  
        g.fillStyle = c;     
        var length = (x2-x1)/6.0;
		var lengthO3 = length/3.0;
				
        g.beginPath();
		g.moveTo(x1+length,y1-lengthO3);
		g.lineTo(x2,y1-lengthO3);
		g.lineTo(x2,y1+lengthO3);
		g.lineTo(x1+length,y1+lengthO3);
		g.closePath();
		g.fill();
		
        g.beginPath();
        g.moveTo(x1,y1);
        g.lineTo(x1+length,y1-length);
        g.lineTo(x1+length,y1+length);
        g.closePath();
        g.fill();		         
    } 
	
    function arrowV(g, c,x1,y1,y2){  
        g.fillStyle = c;     
        var length = (y2-y1)/6.0;
		var lengthO3 = length/3.0;
        g.beginPath();
		g.moveTo(x1-lengthO3,y1+length);
		g.lineTo(x1-lengthO3,y2);
		g.lineTo(x1+lengthO3,y2);
		g.lineTo(x1+lengthO3,y1+length);
        g.closePath();
		g.fill();
		
        g.beginPath();
        g.moveTo(x1,y1);
        g.lineTo(x1-length,y1+length);
        g.lineTo(x1+length,y1+length);
        g.closePath();
        g.fill();		
    } 
	
	function mouseDown(evt){    
		var coord = getMousePointerCoord(evt);
		var mx = coord.x, my = coord.y;
		if (!handPull&& mx > barX-5 && mx < barX+10 && my > barY-5 && my < barY+215){	
				evt.preventDefault();
				youPull=true;
				oldMX = mx;
				oldBX = barX;
				initialX=mx;
				document.getElementById("myDIV").style.cursor = "pointer";
                mouseX = mx;
				start();  				
		}
	}

	function mouseMove(evt){
		var coord = getMousePointerCoord(evt);
		var mx = coord.x, my = coord.y;
        
		if (youPull){
		    evt.preventDefault();
			barX =  mx+oldBX-oldMX; 
			if (barX < 16)
				barX = 15;
			if (barX > 740 - 199)
				barX = 740 - 200;
			
			mouseX = mx;
		 }	
	 
	   else{ 
	        if (!handPull){
			if (mx > barX-5 && mx < barX+10 && my > barY-5 && my < barY+215){		  
			   document.getElementById("myDIV").style.cursor = "pointer";
			   
			}	
			else		  		   
			   document.getElementById("myDIV").style.cursor = "default";
			
			paint(cxt);   			   
			   }
			} 
		}   



	function mouseUp(evt){
	  if (youPull){
			youPull=false;
			document.getElementById("myDIV").style.cursor = "default";
			stop();		
		}
	}

	
	function getMousePointerCoord(evt){
	   var rect = canvas.getBoundingClientRect();  
	   var x =  evt.clientX-rect.left-parseInt(canvas.style.borderLeftWidth)-parseInt(canvas.style.paddingLeft);			 
	   var y =  evt.clientY-rect.top-parseInt(canvas.style.borderTopWidth)-parseInt(canvas.style.paddingTop);			 
	  
	   return {x: x,y: y};
	}
	
	
	function touchDown(evt){    
	var coord = geTouchCoord(evt);
    var tx = coord.x, ty=coord.y; 	
	if (!handPull && tx > barX-23 && tx < barX+28 && ty > barY-5 && ty < barY+220){
	        evt.preventDefault();		
			oldMX = tx;
			oldBX = barX;
			youPull=true;
			mouseX = tx;
			start();  
		}	
	}

	function touchMove(evt){
	 if (youPull){
		evt.preventDefault();
		var coord = geTouchCoord(evt);	
		barX = coord.x+oldBX-oldMX; 
			if (barX < 16)
				barX = 15;
			if (barX > 740 - 199)
				barX = 740 - 200;
			
			mouseX = coord.x;			
	  }
	}

	function touchUp(evt){
	    if (youPull){
	        youPull = false; 
	        stop();
		}
	}

	function geTouchCoord(evt){
	   var rect = canvas.getBoundingClientRect();  
	   var x =  evt.targetTouches[0].clientX-rect.left-parseInt(canvas.style.borderLeftWidth)-parseInt(canvas.style.paddingLeft);			 
	   var y =  evt.targetTouches[0].clientY-rect.top-parseInt(canvas.style.borderTopWidth)-parseInt(canvas.style.paddingTop);			   
	   return {x: x,y: y};
	}
	
	function dirB(){	
	if (document.getElementById("ckb1").checked)
	  reverse = -1;
	else{
	  reverse = 1;		  
	  }
	 paint(cxt); 
	}
	
	function showF(){
	if (document.getElementById("ckb2").checked)
	  showForce = true;
	else
	  showForce = false;	
	}
	
	function actionWhenSliderIsChanging(){
		if(vSlider.isChanging)
		   velocity = vSlider.value()/100.0;
		else if(bSlider.isChanging)
		   bStrength = bSlider.value();

		if (!myrequest){
		paint(cxt);
	}
}