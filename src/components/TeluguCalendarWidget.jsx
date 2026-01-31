import React from 'react';
import { useTeluguCalendarToday } from '../hooks/useAPI';
import { useLanguage } from '../context/LanguageContext';

export default function TeluguCalendarWidget() {
  const { calendarData, loading, error } = useTeluguCalendarToday();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div style={{ 
        background: '#f5f5f5', 
        padding: '2rem', 
        borderRadius: '8px', 
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>{t('loading') || 'Loading Telugu Calendar...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: '#ffe5e5', 
        padding: '2rem', 
        borderRadius: '8px',
        color: '#d32f2f',
        textAlign: 'center'
      }}>
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!calendarData) {
    return null;
  }

  const { date, telugMonth, telugYear, dayName, sunrise, sunset, timings } = calendarData;

  const TimingCard = ({ title, timing, color, icon, severity }) => (
    <div style={{
      background: color,
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '6px',
      color: 'white',
      borderLeft: `4px solid ${getColorShade(color)}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{icon}</span>
        <h4 style={{ margin: 0, flex: 1 }}>{title}</h4>
        {severity && <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>{severity}</span>}
      </div>
      {timing && (
        <>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>⏰ {timing.startTime} - {timing.endTime}</strong>
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', opacity: 0.95 }}>
            {timing.description}
          </p>
          {timing.duration && (
            <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', opacity: 0.85 }}>
              Duration: {timing.duration} minutes
            </p>
          )}
          {timing.activities && (
            <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', opacity: 0.85 }}>
              ✓ Good for: {timing.activities.join(', ')}
            </p>
          )}
          {timing.recommendation && (
            <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', opacity: 0.85 }}>
              💡 {timing.recommendation}
            </p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '2rem',
      marginTop: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#8b4513', marginBottom: '1.5rem' }}>
        📅 Telugu Calendar - {dayName}
      </h2>

      {/* Date Info */}
      <div style={{
        background: '#f9f9f9',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '2rem',
        textAlign: 'center',
        borderTop: '3px solid #8b4513'
      }}>
        <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {date} | {telugMonth} {telugYear}
        </p>
        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
          🌅 Sunrise: {sunrise} | 🌅 Sunset: {sunset}
        </p>
      </div>

      {/* Scrollable Timings Container */}
      <div style={{
        maxHeight: '600px',
        overflowY: 'auto',
        paddingRight: '1rem'
      }}>
        {/* Good Time */}
        {timings?.goodTime && (
          <TimingCard
            title="✓ GOOD TIME (Subhamuhuratham)"
            timing={timings.goodTime}
            color="#4caf50"
            icon="✓"
            severity="Auspicious"
          />
        )}

        {/* Varjyam */}
        {timings?.varjyam && (
          <TimingCard
            title="⚠ VARJYAM (Avoid Time)"
            timing={timings.varjyam}
            color="#ffc107"
            icon="⚠"
            severity="Neutral"
          />
        )}

        {/* Rahu Kalam */}
        {timings?.rahuKalam && (
          <TimingCard
            title="✗ RAHU KALAM (Very Inauspicious)"
            timing={timings.rahuKalam}
            color="#f44336"
            icon="✗"
            severity={timings.rahuKalam.severity}
          />
        )}

        {/* Yamaganda */}
        {timings?.yamaganda && (
          <TimingCard
            title="⚠ YAMAGANDA (Inauspicious)"
            timing={timings.yamaganda}
            color="#ff9800"
            icon="⚠"
            severity={timings.yamaganda.severity}
          />
        )}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '0.85rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#4caf50', width: '20px', height: '20px', borderRadius: '3px' }}></span>
          <span>Green = Auspicious</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#ffc107', width: '20px', height: '20px', borderRadius: '3px' }}></span>
          <span>Yellow = Neutral</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#ff9800', width: '20px', height: '20px', borderRadius: '3px' }}></span>
          <span>Orange = Inauspicious</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#f44336', width: '20px', height: '20px', borderRadius: '3px' }}></span>
          <span>Red = Very Inauspicious</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to get darker shade of color
function getColorShade(color) {
  const shades = {
    '#4caf50': '#388e3c',
    '#ffc107': '#f57f17',
    '#ff9800': '#e65100',
    '#f44336': '#c62828'
  };
  return shades[color] || color;
}
