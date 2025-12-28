import React from 'react';

const AdminPanel = ({ victimData, clearData }) => {
  return (
    <div className="admin-panel">
      <div style={{
        background: 'rgba(255, 0, 0, 0.1)',
        border: '2px dashed #ff4444',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h2 style={{ color: '#ff4444', textAlign: 'center' }}>
          🔐 EDUCATIONAL BACKDOOR DEMONSTRATION
        </h2>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>
          <strong>SIMULATED DATA - FOR CYBERSECURITY AWARENESS ONLY</strong>
        </p>
        <p style={{ fontSize: '13px', textAlign: 'center', opacity: 0.8 }}>
          This panel demonstrates how attackers could collect user data.
          All data is stored locally and simulated for educational purposes.
        </p>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: 0 }}>Collected Data</h3>
            <button 
              onClick={clearData}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear All Data
            </button>
          </div>
          
          {victimData.length === 0 ? (
            <p>No data collected yet. Create a card to see simulated data collection.</p>
          ) : (
            <div>
              <p>Total victims: <strong>{victimData.length}</strong></p>
              
              {victimData.map((data, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px',
                    borderLeft: '4px solid #ffcc00'
                  }}
                >
                  <h4 style={{ marginTop: 0, color: '#ffcc00' }}>
                    Victim #{index + 1}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <strong>Time:</strong> {new Date(data.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <strong>File:</strong> {data.fileName} ({Math.round(data.fileSize/1024)}KB)
                    </div>
                    <div>
                      <strong>Device:</strong> {data.userAgent.split(')')[0].split('(')[1] || 'Unknown'}
                    </div>
                    <div>
                      <strong>Screen:</strong> {data.screenSize}
                    </div>
                    <div>
                      <strong>Timezone:</strong> {data.timezone}
                    </div>
                    <div>
                      <strong>Languages:</strong> {data.languages?.join(', ')}
                    </div>
                  </div>
                  
                  {data.realLocation ? (
                    <div style={{ 
                      background: 'rgba(255, 0, 0, 0.2)',
                      padding: '10px',
                      marginTop: '10px',
                      borderRadius: '6px',
                      border: '1px solid #ff4444'
                    }}>
                      <strong style={{ color: '#ff4444' }}>
                        🎯 REAL LOCATION CAPTURED
                      </strong>
                      <div style={{ marginTop: '8px' }}>
                        <div><strong>Coordinates:</strong> {data.realLocation.latitude}, {data.realLocation.longitude}</div>
                        <div><strong>Accuracy:</strong> ±{Math.round(data.realLocation.accuracy)} meters</div>
                        {data.locationName && (
                          <div style={{ fontSize: '13px', marginTop: '5px' }}>
                            <strong>Location:</strong> {data.locationName.substring(0, 150)}...
                          </div>
                        )}
                        <a 
                          href={`https://maps.google.com/?q=${data.realLocation.latitude},${data.realLocation.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            background: '#4fc3f7',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            marginTop: '8px',
                            fontSize: '14px'
                          }}
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Simulated Location:</strong> {data.simulatedLocation?.latitude}, {data.simulatedLocation?.longitude}
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>
                        (In a real attack, this would be actual GPS data)
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Educational Notes */}
          <div style={{ 
            marginTop: '25px',
            padding: '15px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            fontSize: '13px'
          }}>
            <h4>📚 Educational Notes for Project Report:</h4>
            <ul>
              <li>This simulates how malicious websites can collect user data</li>
              <li>Real location access requires explicit user permission</li>
              <li>Browser fingerprinting can identify users without cookies</li>
              <li>Always check website permissions before allowing access</li>
              <li>Use privacy-focused browsers and extensions for protection</li>
              <li>HTTPS is required for geolocation API in modern browsers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;