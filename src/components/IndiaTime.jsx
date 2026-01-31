import React, { useState, useEffect } from 'react';

const IndiaTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getIndiaTime = () => {
    // Get India Standard Time (IST = UTC+5:30)
    const istTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');
    
    const day = istTime.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    return { time: `${hours}:${minutes}:${seconds}`, date: day };
  };

  const { time: currentTime, date: currentDate } = getIndiaTime();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#8b4513',
      color: '#f1dfc4',
      padding: '12px 16px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      border: '2px solid #f1dfc4',
      minWidth: '140px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
        🕉️ IST
      </div>
      <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>
        {currentTime}
      </div>
      <div style={{ fontSize: '11px', marginTop: '3px', opacity: 0.9 }}>
        {currentDate}
      </div>
    </div>
  );
};

export default IndiaTime;
