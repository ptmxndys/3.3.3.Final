
SimpleTogglePanel = Class.create();

SimpleTogglePanel.prototype = {
	initialize: function(panelId, status, options) {
	
		this.panelId = panelId;
		this.panelId_head = panelId+"_header";
		this.options = options;
	   	this.status = status;
	
		if (!this.status) {
			this.status="true";
		}
	
//		this.timer = setTimeout(this.windowOnLoad.bind(this), 100);

	},
	
/*	windowOnLoad: function(){
	  if (RichFaces.navigatorType() == "MSIE"){
		var body = $(this.panelId+"_body");
		 if (body && body.style.display!="none") body.firstChild.style.width=body.clientWidth;
*/
		 
/*    	    if ($(this.panelId_head).clientWidth<$(this.panelId).clientWidth){
               $(this.panelId_head).style.width=$(this.panelId).clientWidth-2+"px";
	    }
	  }
	},
*/
	
	toggleToState: function(event) {
		var body = $(this.panelId+"_body");
		var switch_on = $(this.panelId+"_switch_on");
		var switch_off = $(this.panelId+"_switch_off");
		if (this.status=="false"){
			 if (this.invokeEvent("expand",event,"false",body)) {	
		 	 	Element.show(body);
	         	this.status="true";
	         	switch_off.style.display="none";
	         	switch_on.style.display="";
			 }	
//			 this.timer = setTimeout(this.windowOnLoad.bind(this), 100);
//		 	 body.firstChild.style.width=body.clientWidth;
	    } else if (this.invokeEvent("collapse",event,"true",body)) {
	    	 Element.hide(body);
             this.status="false";
             switch_on.style.display="none";
	         switch_off.style.display="";
        }
        
	    if (RichFaces.navigatorType() == RichFaces.MSIE){
/*    	      if ($(this.panelId_head).clientWidth<$(this.panelId).clientWidth){
                 $(this.panelId_head).style.width=$(this.panelId).clientWidth-2+"px";
	      }*/
	    }
		$(this.panelId+"_input").value=this.status;
	},
	
	 invokeEvent: function(eventName, event, value, element) {
	
		var eventFunction = this.options['on'+eventName];
		var result;

		if (eventFunction)
		{
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
			eventObj.rich.value = value;

			try {
				result = eventFunction.call(element, eventObj);
			} catch (e) { 
				LOG.warn("Exception: "+e.Message + "\n[on"+eventName + "]"); 
			}

		}
		
		if (result!=false) result = true;
		
		return result;
	}	
}

SimpleTogglePanelManager = Class.create();

SimpleTogglePanelManager.panels = $H($A({}));

SimpleTogglePanelManager.add = function(value) {
    var tmp = new Object();
    tmp[value.panelId] = value;
    this.panels=this.panels.merge(tmp);
}

SimpleTogglePanelManager.toggleOnServer = function (event,clientId) {
	var parentForm = A4J.findForm($(clientId + "_header"));
	if(!parentForm || !parentForm.appendChild /* findForm returns surrogate form object */) return;

	var thePanel = this.panels.get(clientId);
	var element = $(clientId);

	if (thePanel.status == "true") {
		if (thePanel.invokeEvent("collapse",event,"true",element)) {
			thePanel.status="false";
		}
	} else {
		if (thePanel.invokeEvent("expand",event,"false",element)) {
			thePanel.status="true";
		}
	}
	
	var params = {};
	params[clientId] = thePanel.status;
	_JSFFormSubmit(null, parentForm, null, params);

	return false;
}

SimpleTogglePanelManager.toggleOnClient = function (event,panelId) {
	this.panels.get(panelId).toggleToState(event);
	return false;	
}

SimpleTogglePanelManager.toggleOnAjax = function(event,panelId) {
	var element = $(panelId);
	
	var thePanel = this.panels.get(panelId);
	if (thePanel.status == "true") {
		var res = thePanel.invokeEvent("collapse",event,"true",element);
		Element.hide(panelId+"_body");
		return res
	} else {
		var res = thePanel.invokeEvent("expand",event,"false",element); 
		Element.show(panelId+"_body");
		return res
	}
}


