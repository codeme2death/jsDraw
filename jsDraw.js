var jsDraw = {
        canvasclass : 'jsDraw',
        element: 'canvas',

        autoInstall : function() {
            jsDraw.addEvent(window,'load',jsDraw.start);
        },
        start : function() {
            jsDraw.bindCanvasByClass(jsDraw.canvasclass);
        },
        installById : function(canvasId) {
            //jsDraw.bindBrushInputById(brushInputId);
            canvas = document.getElementById(canvasId); //get the document
            canvas.jsDraw = new jsDraw.draw(canvas,"");            
        },
        installByClass : function(canvasClass) {
            jsDraw.bindCanvasByClass(canvasClass); 
        },  
        installByType : function(type) {
            jsDraw.bindCanvasByType(type); 
        },                  
        bindCanvasByClass : function(className) {
            var matchClass = new RegExp('(^|\\s)('+className+')\\s*(\\{[^}]*\\})?', 'i');
            var e = document.getElementsByTagName(jsDraw.element);
            for(var i=0; i<e.length;i++)   {
                if(!e[i].jsDraw && e[i].className && (m = e[i].className.match(matchClass))) { 
                    var prop = {};
                        if(m[3]) {
                            try {
                                 prop = (new Function ('return (' + m[3] + ')'))();
                            } catch(eInvalidProp) {}
                        }
                    e[i].jsDraw = new jsDraw.draw(e[i],prop);
                }
            }            
        },
        bindCanvasByType : function(elementType) {
            var e = document.getElementsByTagName(elementType);
            for(var i=0; i<e.length;i++)   {
                e[i].jsDraw = new jsDraw.draw(e[i],"");
            }            
        },                
        addEvent : function(el, evnt, func) {
		if(el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if(el.attachEvent) {
			el.attachEvent('on'+evnt, func);
		}
	},
        draw : function(element,params) {
            //set initial settings
            this.lineWidth = 3;
            this.startColor = "#000000";
            this.backgroundColor = "#FFFFFF";
            this.drawIcon = "./images/pencil.png";
            this.eraserIcon = "./images/eraser.png";
            this.showConfirm = true;
            this.savedStateLimit = 20; //the ammount of undo's available
            
            //if custom settings were used
            for(var p in params) {
                if(params.hasOwnProperty(p)) {
                        this[p] = params[p];
                }
	    }

            
            this.drawIcon = "url('" +this.drawIcon + "'),auto";
            this.eraserIcon = "url('" +this.eraserIcon + "'),auto";
            this.setBrushColor = function(fncolor) {
                this.setCursor(this.drawIcon);
                tmpColor = jsDraw.colorToHex(fncolor.value);
                color = jsDraw.colorToHex(fncolor.value);
            };
            this.setBackgroundColor = function(element) {
                var value = jsDraw.colorToHex(element.value);
                if(this.showConfirm) {
                    question = jsDraw.notify();
                    if(question === true) {
                        this.setCursor(this.drawIcon);
                        color = tmpColor;
                        backgroundColor = value;
                        ctx.fillStyle = value;
                        ctx.strokeStyle = color; 
                        clearCanvas();
                        savedStatePosition = 0;
                        saveState(savedStatePosition);
                    }else {
                        element.value = backgroundColor;
                    }
                } else {
                    this.setCursor(this.drawIcon);
                    color = tmpColor;
                    backgroundColor = value;
                    ctx.fillStyle = value;
                    ctx.strokeStyle = color; 
                    clearCanvas();
                    savedStatePosition = 0;
                    saveState(savedStatePosition);
                }
            }; 
            this.saveCanvas  = function() {
                var dataURL = canvas.toDataURL("image/png");
                var img = '<div><img src="'+dataURL+'" style="border:10px groove #888;"/></div>';
                var oWin = window.open("about:blank", "_blank");
                oWin.document.writeln("Right Click On Image To Save <br/>");
                oWin.document.writeln(img); 

            };
            this.updateBrushWidth = function(value) {
                lineWidth = value;
            };
            this.newCanvas = function() {
                if(this.showConfirm) {
                    question = jsDraw.notify();
                    if(question === true) {
                        clearCanvas();
                    }
                } else {
                    clearCanvas();
                }
             };
            this.undo = function() { 
                //prevents negative counter
                if(savedStatePosition > 0) { 
                    savedStatePosition--; 
                }else{ 
                    savedStatePosition = 0;
                }
                ctx.drawImage(savedStates[savedStatePosition],0,0);
            };
            this.redo = function() {
                var lngth = 0;  
                if(savedStates.length > 0) {
                    lngth = savedStates.length-1;
                }
                if(savedStatePosition < lngth ){ savedStatePosition++;}else{savedStatePosition = lngth;}
                ctx.drawImage(savedStates[savedStatePosition],0,0);
            };
            this.setEraserColor = function() {
                this.setCursor(this.eraserIcon);
                tmpColor = color;
                color = backgroundColor;
            };
            this.brushCanvas = function() {
                this.setCursor(this.drawIcon);
                color = tmpColor;
                
            };
            this.setCursor = function(value) {
                canvas.style.cursor = value;   
            };
            function jsDrawLine(e) {
                var mouseX;
                var mouseY;
                var scroll = jsDraw.getScroll();
                var mousePosition = jsDraw.getMouseXY(e);
                var bound = canvas.getBoundingClientRect();
                mouseX =  (mousePosition["x"] - bound.left) - scroll["x"];
                mouseY =  (mousePosition["y"] - bound.top) - scroll["y"];
                
                ctx.lineTo(mouseX,mouseY); 
                ctx.stroke(); 
            };
            function mouseIn() {
                ctx.restore();
            };
            function mouseOut() {
                removeMouseEvent(canvas,"mousemove",mouseDown);
            };
            function mouseDown() {
                document.onselectstart = function () { return false; }; //prevents a text icon from bieng displayed in chrome
                var lngth = savedStates.length-1;
                if(savedStatePosition > savedStateLimit) {
                   savedStatePosition = savedStateLimit;
                }else{
                    savedStatePosition++;
                }
                //prevents user from undoing and then drawing and trying to redo the previous undos
                if(savedStatePosition < lngth) {savedStates.length = savedStatePosition;}
                if(ctx) {
                    ctx.beginPath();
                    ctx.lineWidth = lineWidth;   
                    ctx.strokeStyle = color;   
                }
                
                jsDraw.addMouseEvent(this,"mousemove",jsDrawLine);
            };
       
            function clearCanvas() {
                if(ctx) {
                    var width = canvas.width;
                    var height = canvas.height;
                    //clear it, then fill it
                    ctx.clearRect(0,0,width,height);
                    ctx.fillRect(0,0,width,height);
                    resetStates();

                }
            };          

            function saveState(counter){
                if(counter > savedStateLimit) {
                    //if the states have gone above the limit delete the first element
                    savedStates.shift();
                    counter = savedStateLimit;
                }
                //save initial state
                savedStates[counter] = new Image();
                savedStates[counter].src = canvas.toDataURL("image/png"); 
            };
            function resetStates() {
                savedStatePosition = 0;
                savedStates = [];
                saveState(0);
            };
            function mouseUp() {
                 saveState(savedStatePosition);
                 jsDraw.removeMouseEvent(canvas,"mousemove",jsDrawLine);
             };   
             
            var canvas = element;
            var ctx = ' ';  //the context of the canvas
            var backgroundColor= this.backgroundColor;
            var color = this.startColor;            
            var tmpColor = this.startColor;
            var savedStates = [];
            var savedStatePosition = 0;
            var lineWidth = this.lineWidth;    
            var savedStateLimit = this.savedStateLimit;
            
            
            
            //load it all
            jsDraw.addMouseEvent(element,"mousedown",mouseDown);
            jsDraw.addMouseEvent(element,"mouseup",mouseUp);
            jsDraw.addMouseEvent(element,"mouseout",mouseUp);
            jsDraw.addMouseEvent(element,"mousein",mouseIn);
            if(canvas.getContext) {
                this.setCursor(this.drawIcon);
                ctx = canvas.getContext('2d'); //get the context
                ctx.lineWidth = lineWidth;
                ctx.fillStyle = this.backgroundColor;
                ctx.fillRect(0,0,element.width,element.height);
                saveState(savedStatePosition);     
            }              
        },
        notify : function() {
            var message = "Current drawing will be erased.\nAre You Sure?";
            var question = window.confirm(message);
            if(question === true) {
                return true;
            }else{
                return false;
            }
        },
        colorToHex : function(color) {
            if (color.substr(0, 1) === '#') {
                return color;
            }
            var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

            var red = parseInt(digits[2]);
            var green = parseInt(digits[3]);
            var blue = parseInt(digits[4]);

            var rgb = blue | (green << 8) | (red << 16);
            return digits[1] + rgb.toString(16);
        },
        addMouseEvent : function(element,event,funcCall) {
            if(element.addEventListener) {
                element.addEventListener(event,funcCall,false);
            }
            if(element.attachEvent) {
                element.attachEvent("on"+event,funcCall);
            }
        },
        removeMouseEvent : function(element,event,funcCall) {

            if(element.addEventListener) {
                element.removeEventListener(event,funcCall,false);
            }
            if(element.attachEvent) {
                element.detachEvent("on"+event,funcCall);

            }
        },
        getMouseXY : function(event) {
            var posx = 0;
            var posy = 0;
            if (!event) var event = window.event;
            if (event.pageX || event.pageY) 	{
                    posx = event.pageX;
                    posy = event.pageY;
            }
            else if (event.clientX || event.clientY) 	{
                    posx = event.clientX;
                    posy = event.clientY;

            }
            //console.log(posx + "," + posy);
            return { x: posx, y: posy };

        },
        getScroll : function() {
            var doc = document.documentElement;
            var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
            return {x: left, y: top };
        },
        showAlert: function(text) {
            var currAlert = document.createElement('div');
            currAlert.setAttribute('postion','absolute');
            currAlert.setAttribute('width','300px');
            currAlert.setAttribute('height','100px');
            currAlert.setAttribute('background-color','#eeeeee');
            currAlert.setAttribute('border','1px solid #dddddd');
            currAlert.setAttribute('border-radius','15px');
            currAlert.setAttribute('text-align','center');
            currAlert.setAttribute('padding','10px');
            currAlert.setAttribute('display','block');
            if(window.onload) {
                window.appendChild(currAlert);
            }
        }
};

jsDraw.autoInstall();














