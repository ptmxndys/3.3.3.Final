package org.richfaces.demo.modifiableModel;

import java.io.IOException;
import java.util.List;

import javax.el.ELException;
import javax.el.Expression;
import javax.el.ValueExpression;
import javax.faces.FacesException;
import javax.faces.context.FacesContext;

import org.ajax4jsf.model.DataVisitor;
import org.ajax4jsf.model.ExtendedDataModel;
import org.ajax4jsf.model.Range;
import org.ajax4jsf.model.SequenceRange;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.richfaces.model.ExtendedFilterField;
import org.richfaces.model.FilterField;
import org.richfaces.model.Modifiable;
import org.richfaces.model.Ordering;
import org.richfaces.model.SortField2;

/**
 * @author Nick Belaevski
 * @since 3.3.2
 */
public abstract class BaseModifiableHibernateDataModel<T> extends ExtendedDataModel implements Modifiable {

	private Class<T> entityClass;
	
	public BaseModifiableHibernateDataModel(Class<T> entityClass) {
		super();
		this.entityClass = entityClass;
	}

	private T dataItem;
	
	private SequenceRange cachedRange;
	
	private List<T> cachedItems;

	private List<FilterField> filterFields;

	private List<SortField2> sortFields;

	private static boolean areEqualRanges(SequenceRange range1, SequenceRange range2) {
		if (range1 == null || range2 == null) {
			return range1 == null && range2 == null;
		} else {
			return range1.getFirstRow() == range2.getFirstRow() && range1.getRows() == range2.getRows();
		}
	}
	
	private Criteria createCriteria() {
		return getSession().createCriteria(entityClass);
	}
	
	private void appendFilters(FacesContext context, Criteria criteria) {
		if (filterFields != null) {
			for (FilterField filterField : filterFields) {
				String propertyName = getPropertyName(context, filterField.getExpression());

				String filterValue = ((ExtendedFilterField) filterField).getFilterValue();
				if (filterValue != null && filterValue.length() != 0) {
					criteria.add(Restrictions.like(propertyName, 
							filterValue, 
							MatchMode.ANYWHERE).ignoreCase());
				}
			}
		}
	}
	
	private void appendSorts(FacesContext context, Criteria criteria) {
		if (sortFields != null) {
			for (SortField2 sortField : sortFields) {
				Ordering ordering = sortField.getOrdering();
				
				if (Ordering.ASCENDING.equals(ordering) || Ordering.DESCENDING.equals(ordering)) {
					String propertyName = getPropertyName(context, sortField.getExpression());
					
					Order order = Ordering.ASCENDING.equals(ordering) ? 
							Order.asc(propertyName) : Order.desc(propertyName);
							
					criteria.addOrder(order);
				}
			}
		}
	}
	
	private String getPropertyName(FacesContext facesContext, Expression expression) {
		try {
			return (String) ((ValueExpression) expression).getValue(facesContext.getELContext());
		} catch (ELException e) {
			throw new FacesException(e.getMessage(), e);
		}
	}
	
	@Override
	public Object getRowKey() {
		return dataItem;
	}

	@Override
	public void setRowKey(Object key) {
		this.dataItem = entityClass.cast(key);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void walk(FacesContext facesContext, DataVisitor visitor, Range range,
			Object argument) throws IOException {

		SequenceRange sequenceRange = (SequenceRange) range;
		
		if (this.cachedItems == null || !areEqualRanges(this.cachedRange, sequenceRange)) {
			Criteria criteria = createCriteria();
			appendFilters(facesContext, criteria);
			appendSorts(facesContext, criteria);

			if (sequenceRange != null) {
				int first = sequenceRange.getFirstRow();
				int rows = sequenceRange.getRows();
				
				criteria.setFirstResult(first);
				if (rows > 0) {
					criteria.setMaxResults(rows);
				}
			}
			
			this.cachedRange = sequenceRange;
			this.cachedItems = criteria.list();
		}
		
		for (T item: this.cachedItems) {
			visitor.process(facesContext, item, argument);
		}
	}

	@Override
	public int getRowCount() {
		Criteria criteria = createCriteria();
		appendFilters(FacesContext.getCurrentInstance(), criteria);
		criteria.setProjection(Projections.rowCount());
		//There are cast to Number object, related to http://opensource.atlassian.com/projects/hibernate/browse/HHH-3497.
		//Such kind of implementation should work undependent on what Hibernate library version used.
		return ((Number)criteria.list().get(0)).intValue();
	}

	@Override
	public Object getRowData() {
		return this.dataItem;
	}

	@Override
	public int getRowIndex() {
		return -1;
	}

	@Override
	public Object getWrappedData() {
		return null;
	}

	@Override
	public boolean isRowAvailable() {
		return (this.dataItem != null);
	}

	@Override
	public void setRowIndex(int rowIndex) {
	}

	@Override
	public void setWrappedData(Object data) {
	}
	
	public void modify(List<FilterField> filterFields, List<SortField2> sortFields) {
		this.filterFields = filterFields;
		this.sortFields = sortFields;

		this.cachedItems = null;
		this.cachedRange = null;
	}

	protected abstract Session getSession();
}
