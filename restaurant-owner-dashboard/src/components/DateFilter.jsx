import React, { useState, useRef, useEffect } from 'react';
import './DateFilter.css';

const DateFilter = ({ startDate, endDate, onDateChange, filteredCount, totalCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const handleStartDateChange = (e) => {
    onDateChange(e.target.value, endDate);
  };

  const handleEndDateChange = (e) => {
    onDateChange(startDate, e.target.value);
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today, today);
  };

  const handleLast7DaysClick = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayString = today.toISOString().split('T')[0];
    const lastWeekString = lastWeek.toISOString().split('T')[0];
    onDateChange(lastWeekString, todayString);
  };

  const handleLast30DaysClick = () => {
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const todayString = today.toISOString().split('T')[0];
    const lastMonthString = lastMonth.toISOString().split('T')[0];
    onDateChange(lastMonthString, todayString);
  };

  const handleAllTimeClick = () => {
    onDateChange('', '');
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get current filter status text
  const getFilterStatus = () => {
    if (startDate && endDate) {
      return `${startDate} to ${endDate}`;
    } else if (startDate) {
      return `From ${startDate}`;
    } else if (endDate) {
      return `Until ${endDate}`;
    }
    return 'All Time';
  };

  return (
    <div className="date-filter-compact" ref={popupRef}>
      <button className="date-filter-trigger" onClick={togglePopup}>
        <span className="filter-icon">📅</span>
        <span className="filter-text">
          {getFilterStatus()}
          {/* {filteredCount !== undefined && totalCount !== undefined && (
            <span className="filter-count">
              ({filteredCount !== totalCount ? `${filteredCount}/${totalCount}` : totalCount})
            </span>
          )} */}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="date-filter-popup">
          <div className="popup-header">
            <h4>Filter by Date</h4>
            <button className="close-btn" onClick={closePopup}>×</button>
          </div>
          
          <div className="date-inputs">
            <div className="date-input-group">
              <label htmlFor="start-date">From:</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
                className="date-input"
              />
            </div>
            
            <div className="date-input-group">
              <label htmlFor="end-date">To:</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleEndDateChange}
                className="date-input"
              />
            </div>
          </div>
          
          <div className="quick-filters">
            <button 
              className="quick-filter-btn" 
              onClick={handleTodayClick}
              title="Show today's data"
            >
              Today
            </button>
            <button 
              className="quick-filter-btn" 
              onClick={handleLast7DaysClick}
              title="Show last 7 days"
            >
              Last 7 Days
            </button>
            <button 
              className="quick-filter-btn" 
              onClick={handleLast30DaysClick}
              title="Show last 30 days"
            >
              Last 30 Days
            </button>
            <button 
              className="quick-filter-btn" 
              onClick={handleAllTimeClick}
              title="Show all data"
            >
              All Time
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
