/**
 * License Agreement.
 *
 * JBoss RichFaces - Ajax4jsf Component Library
 *
 * Copyright (C) 2007 Exadel, Inc.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 2.1 as published by the Free Software Foundation.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */ 
package org.ajax4jsf.bean.tree.rich;

import org.richfaces.model.TreeNodeImpl;

public class AudioLibrary extends TreeNodeImpl<Object> {

    /**
     * serial version ID
     */
    private static final long serialVersionUID = -5062513400012852149L;

    public void addPerformer(Performer performer) {
        addChild(performer.getId(), performer);
    }

    public String getType() {
        return "library";
    }

}
