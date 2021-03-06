if (!window.Richfaces) window.Richfaces = {};

Richfaces.PanelBar = Class.create();

Richfaces.PanelBar.prototype = {


	initialize: function(panelId, options) {

//		this.FF = (RichFaces.navigatorType() == RichFaces.FF)?true:false;
//		this.isIE = ((navigator.userAgent.toLowerCase().indexOf("msie")!=-1) || (navigator.userAgent.toLowerCase().indexOf("explorer")!=-1))?true:false;
		this.panel=$(panelId); //+"_p"
	
		if (!this.panel) {
			return;
		}

		this.panel.component = this;
		this["rich:destructor"] = "destroy";
		
		this.hclient=0;
		this.COUNT=0;
		this.STEP=0;
		this.slides=new Array();
		this.ch=this.panel.clientHeight;
		this.options = options;
        this.onitemchange = options.onitemchange;
        this.onitemchanged = options.onitemchanged;
        this.onclick = options.onclick;
        this.items = options.items;
        
        this._attachBehaviors();

		this.input=$(panelId+"_panelBarInput");
		this.defaultIndex=this.findPanelById($F(panelId+"_panelBarInput"));
	
		this.handleOnLoadBound = this.handleOnLoad.bind(this);
		if (!options.ajax) {
			Event.observe(window, 'load', this.handleOnLoadBound);
		} else {
			this.handleOnLoad();
		}
		
		this.mouseover = options.mouseover;
		this.mouseout = options.mouseout;
		this.mousemove = options.mousemove;		
		
			
		if (this.mouseover && this.mouseover != ""){
			Event.observe(this.panel,'mouseover',new Function("event",this.mouseover));
		}
		
		if (this.mouseout && this.mouseout != ""){
			Event.observe(this.panel,'mouseout',new Function("event",this.mouseout));
		}
		
		if (this.mousemove && this.mousemove != ""){
			Event.observe(this.panel,'mousemove',new Function("event", this.mousemove));
		}	
		
		this.showSlide(this.slides[this.defaultIndex]);

        this.contentHight = -1;
    },

    destroy: function() {
    	Event.stopObserving(window, 'load', this.handleOnLoadBound);
    	if (this.panel) {
    		this.panel.component = undefined;
    	}
	    if (this.timer) {
			clearTimeout(this.timer);
			this.timer = undefined;
	    }
    },
    
	handleOnLoad: function() {
		Event.stopObserving(window, 'load', this.handleOnLoadBound);
	    if ( this.timer ){
			clearTimeout(this.timer);
		}
		if (this.panel.clientHeight<=0){
		  this.contentHight = -1;
 		  this.timer = setTimeout(this.handleOnLoadBound, 100);
 		}

		this.showSlide(this.slides[this.defaultIndex]);
	},

	getContentHeight: function() {

        if(this.contentHight) {
        }
        else{
         this.contentHight = -1;
        }

		if(this.contentHight <= -1) {
			var h=0;
			this.hclient=0;
			for(var i=0; i<this.slides.length; i++) {
				h+=this.slides[i].item.offsetHeight;


			}
			this.hclient=h;
			this.contentHight = this.panel.clientHeight-h;
	    }

		return this.contentHight;
	},

	showSlide: function(slide) {
	
		if (this.current) this.current.hideContent();
		var h=this.getContentHeight();
		if (this.current) this.current.hideHeader();

		slide.content.style.height=(h>0?h:0)+"px";
		if (h<=1 && (this.panel.style.height=="" || this.panel.style.height.indexOf("%")!=-1)) {
			this.panel.style.height="";
			slide.content.style.height="100%";
		}
		slide.showContent();
		this.current=slide;
				
				
//		this.input.value=this.current.index;
		this.input.value=this.current.item.id;
		this.firstLoad = false;
	},
	
	_attachBehaviors: function() {
		var rows=this._getItems(this.panel);
		for(var i=0; i<rows.length; i++) {
			var subrows=this._getDirectChildrenByTag(rows[i],'DIV');
			this.slides.push(new Richfaces.PanelBar.Slide(this,rows[i],subrows[0],subrows[1],subrows[2],i,this.onclick)); //index
		}
	},
	_getItems: function( e ) {

		var kids = new Array();
		var item = Richfaces.firstDescendant(e);
		var index=0;
		var id = this.items[index].id;
		do
		{
			if (item.id == id)
			{
				kids.push(item);
				index++;
				if (index<this.items.length) id = this.items[index].id; else break;
			}
		} while (item=item.nextSibling)
		return kids;

	},

	_getDirectChildrenByTag: function( e, tagName ) {

		var kids = new Array();
		var allKids = e.childNodes;
		for( var i = 0 ; i < allKids.length ; i++ ) {
			var item=allKids[i];
			if (item && item.tagName && item.tagName.toUpperCase() == tagName.toUpperCase()){
				kids.push(item);
			}
		}
		return kids;

	},

	findPanelById: function(value) {
		for(var i = 0; i<this.slides.length; i++) {
			if (this.slides[i].item.id==value) return i;
		}
		return 0;
	},
	
	invokeEvent: function(eventName, event, leaveElement,enterElement, element, eventFunction, data) {
		var result;
		if (eventFunction) {
			
			var eventObj;

			if (event)
			{
				eventObj = event;
			}
			else if( document.createEventObject ) 
			{
				eventObj = document.createEventObject();
			}
			else if( document.createEvent )
			{
				eventObj = document.createEvent('Events');
				eventObj.initEvent( eventName, true, false );
			}
			
			eventObj.rich = {component:this};
			eventObj.rich.enterElement = leaveElement;
			eventObj.rich.leaveElement = enterElement; 
			
			try
			{
				result = eventFunction.call(element, eventObj);
			}
			catch (e) { LOG.warn("Exception: "+e.Message + "\n[on"+eventName + "]"); }

		}
		
		if (result!=false) result = true;
		
		return result;
	}	

}

Richfaces.PanelBar.Slide = Class.create();
Richfaces.PanelBar.Slide.prototype = {

	initialize: function(slidePanel,item,header,header_act,content,index,onclick){

		this.index=index;
		this.slidePanel=slidePanel;
		this.item=item;
		this.header=header;
		this.header_act=header_act;
		this.content=content;
		this.onclick = onclick;
	
//		this.item.style.overflow="hidden";
//		this.header.style.overflowX="hidden";
//		this.header.style.overflowY="visible";
//		this.header.style.cursor="pointer";
		
		Event.observe(this.header, "click", this.headerOnClick.bindAsEventListener(this));
		Event.observe(this.header, "selectstart", this.headerOnSelectStart.bindAsEventListener(this));

		Event.observe(this.header_act, "click", this.headerOnClick.bindAsEventListener(this));
		Event.observe(this.header_act, "selectstart", this.headerOnSelectStart.bindAsEventListener(this));
		
		this.content.style.display="none";
		this.content.style.overflow="auto";
		this.content.style.height="0px";
//		this.content.style.paddingRight="0px";
		this.hightFirefoxDelta = 0;

        if (this.onclick && this.onclick != ""){
            this.onclickFunction = new Function("event",this.onclick);
        }
	},

	showContent: function() {
		this.content.style.display="block";
		Richfaces.firstDescendant(this.content).style.height="";
		this.header.style.display="none";
		this.header_act.style.display="";

	},

	hideContent: function() {
		this.content.style.display="none";
		Richfaces.firstDescendant(this.content).style.height="100%";
	},

	hideHeader: function() {
		this.header_act.style.display="none";
		this.header.style.display="";
	},

	headerOnClick: function(event) {
		if (this.onclickFunction) {
        	var result = this.onclickFunction(event);
        	if (result == false) {
        		return false;
        	}
		}	
        
        if (this.content.style.display=="block") return;
		//this.header.style.display="none";
		//this.header_act.style.display="";
		
		var enterElement = this.item;
		var leaveElement = this.slidePanel.current.item;
		var enterItem = this.slidePanel.items[this.index];
		var leaveItem;
		var items = this.slidePanel.items;
		
		for (var i = 0; i < items.length; i++) {
			if (this.slidePanel.items[i].id == leaveElement.id) {	  
			 	leaveItem = this.slidePanel.items[i];
			}	
		}	
		
			
		if(!this.slidePanel.invokeEvent("onenter",event,leaveElement, enterElement,enterElement,enterItem.onenter)) return false;
		if(!this.slidePanel.invokeEvent("onleave",event,leaveElement, enterElement,leaveElement,leaveItem.onleave)) return false;
		if(!this.slidePanel.invokeEvent("onchangeitem",event,leaveElement, enterElement,this.slidePanel.panel,this.slidePanel.onitemchange)) return false;

		this.slidePanel.showSlide(this);

		this.slidePanel.panel.style.maxHeight="";
		this.slidePanel.panel.style.minHeight="";

		this.slidePanel.invokeEvent("onchangeditem", event, leaveElement, enterElement, this.slidePanel.panel, this.slidePanel.onitemchanged);
	},

	headerOnSelectStart: function() {
		return false;
	}
}
