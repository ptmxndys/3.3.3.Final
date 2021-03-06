/**
 * License Agreement.
 *
 * Rich Faces - Natural Ajax for Java Server Faces (JSF)
 *
 * Copyright (C) 2007 Exadel, Inc.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 2.1 as published by the Free Software Foundation.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
 */
package org.richfaces.component;

import java.io.IOException;

import javax.faces.component.UIMessage;
import javax.faces.context.FacesContext;

import org.ajax4jsf.component.AjaxOutput;


/**
 * @author Anton Belevich
 *
 */
public abstract class UIRichMessage extends UIMessage implements AjaxOutput{
	
	private boolean isPassed = false;
	private boolean ajaxRendered = true;
		
	public boolean isPassed() {
		return isPassed;
	}
	
	public abstract String getPassedLabel();
	
	public abstract void setPassedLabel(String passedLabel);
	
	public boolean isAjaxRendered() {
		return ajaxRendered;
	}
	
	public void setAjaxRendered(boolean ajaxRendered) {
		this.ajaxRendered = ajaxRendered;
	}
	
	public void decode(FacesContext context) {
		isPassed = true;
		super.decode(context);
	}
	
	public void encodeBegin(FacesContext context) throws IOException {
		isPassed = true;
		super.encodeBegin(context);
	}
	
	public void encodeEnd(FacesContext context) throws IOException {
		super.encodeEnd(context);
		isPassed = false;
	}
	
	public abstract String getLevel();

	public abstract void setLevel(String level);
	
	public abstract String getMinLevel();

	public abstract void setMinLevel(String minLevel);

	private Object[] values;

	public Object saveState(FacesContext context) {

		if (values == null) {
			values = new Object[3];
		}

		values[0] = super.saveState(context);
		values[1] = this.ajaxRendered;
		return (values);

	}

	@SuppressWarnings("unchecked")
	public void restoreState(FacesContext context, Object state) {

		values = (Object[]) state;
		super.restoreState(context, values[0]);
		ajaxRendered = (Boolean) values[1];
	}
}
