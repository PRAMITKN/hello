import React from 'react';

const ExampleCards = () => {
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
  );
};

export default ExampleCards;