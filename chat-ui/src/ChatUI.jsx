// ChatUI.jsx
import React, { useState, useRef, useEffect } from 'react';

const ChatUI = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! This is Blenderbot model, how can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const text = input.trim();
  //   if (!text) return;

  //   setMessages(prev => [...prev, { from: 'user', text }]);
  //   setInput('');

  //   // Simulate LLM response
  //   setTimeout(() => {
  //     setMessages(prev => [...prev, { from: 'bot', text: 'Placeholder response from LLM.' }]);
  //   }, 600);
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const text = input.trim();
  if (!text) return;

  // 1) optimistically show the user’s message
  setMessages(prev => [...prev, { from: 'user', text }]);
  setInput('');

  try {
    // 2) send it to the backend
    // const res = await fetch('http://0.0.0.0:8000/generate', {
    const res = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text })
    });
    const payload = await res.json();
    // 3) append the model’s reply
    setMessages(prev => [...prev, { from: 'bot', text: payload.generated }]);
  } catch (err) {
    console.error(err);
    setMessages(prev => [...prev, { from: 'bot', text: '⚠️ Oops, something went wrong.' }]);
  }
};


  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setMessages(prev => [...prev, { from: 'user', files }]);
    e.target.value = null;

    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: 'File received!' }]);
    }, 600);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#e8f9e8', // super light green background
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '720px',
        height: '90vh',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#f0fff0', // super light green panel
      }}>
        {/* Chat history */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: '#f7fff7', // slightly lighter
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                margin: '0.75rem 0',
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                backgroundColor: msg.from === 'user' ? 'lightgreen' : '#e5e5ea',
                color: '#000',
                whiteSpace: 'pre-wrap',
                fontSize: '1.25rem', // increased font size
                lineHeight: '1.5',
              }}>
                {msg.text}
                {msg.files && (
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, listStyleType: 'disc', fontSize: '1rem' }}>
                    {msg.files.map((file, i) => (
                      <li key={i}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & controls */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            borderTop: '1px solid #ccc',
            background: '#f0fff0', // match panel
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              marginRight: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.75rem',
            }}
          >
            📁
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or upload files..."
            rows={3}
            style={{
              flex: 1,
              minHeight: '4rem',
              maxHeight: '10rem',
              resize: 'vertical',
              padding: '1rem 1.25rem',
              borderRadius: '1.5rem',
              border: '1px solid #ccc',
              fontSize: '1.25rem', // match bubble size
              lineHeight: '1.5',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.75rem',
            }}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
