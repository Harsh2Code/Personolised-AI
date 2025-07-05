import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // State for theme: 'dark' or 'light'. Initialize from local storage or default to 'dark'.
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Effect to apply the theme class to the HTML element and save to local storage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Function to handle sending the prompt to the backend
  const sendPrompt = async () => {
    setError(''); // Clear previous errors
    setResponse(''); // Clear previous response
    setLoading(true); // Show loading indicator

    try {
      // Make a POST request to your backend API
      const backendUrl = 'http://localhost:5000/api/gemini-query'; // Adjust if your backend runs on a different port/host
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response); // Set the AI's response
    } catch (err) {
      console.error("Error sending prompt:", err);
      setError(`Failed to get response: ${err.message}. Please check your backend server and API key.`);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Define background style for dark mode
  const darkBackgroundStyle = {
    // Using the uploaded image as the background
    backgroundImage: `url('https://generativelanguage.googleapis.com/v1beta/files/uploaded:Gemini_Generated_Image_hfamfmhfamfmhfam.jpg-27f7db23-205b-4b13-b0fe-7d4bf9f09824?alt=media')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // Add a subtle overlay to ensure text readability on top of the image
    position: 'relative',
    // Note: Pseudo-elements like ::before cannot be directly applied via inline style in React.
    // If you need a true overlay, consider adding a div with absolute positioning and opacity.
  };

  return (
    // Apply dynamic background and text colors based on theme
    <div
      className={`min-h-screen flex items-center justify-center p-4 font-inter transition-colors duration-500`}
      style={theme === 'dark' ? darkBackgroundStyle : { backgroundImage: 'linear-gradient(to bottom right, #BFDBFE, #E0F2F7)' }} // Light mode gradient
    >
      <div className={`rounded-3xl shadow-2xl p-8 max-w-2xl w-full border transition-all duration-500
        ${theme === 'dark' ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-blue-700 border-opacity-30' : 'bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border-blue-400 border-opacity-50'}`}>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors duration-300
            ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.325 3.325l-.707.707M5.378 5.378l-.707-.707M18.364 5.636l-.707.707M5.636 18.364l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <h1 className={`text-4xl font-extrabold text-center mb-8 drop-shadow-lg transition-colors duration-500
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Gemini 1.5 Pro Chat
        </h1>

        <div className="mb-6">
          <textarea
            className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 shadow-md resize-none
              ${theme === 'dark' ? 'bg-gray-700 bg-opacity-50 text-white placeholder-gray-300 focus:ring-blue-400' : 'bg-gray-100 bg-opacity-80 text-gray-900 placeholder-gray-500 focus:ring-blue-400'}`}
            rows="6"
            placeholder="Ask Gemini 1.5 Pro anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={sendPrompt}
          disabled={loading || !prompt.trim()}
          className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
            ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send to Gemini'
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-500 bg-opacity-70 text-white rounded-xl shadow-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className={`mt-6 p-6 rounded-xl shadow-md whitespace-pre-wrap transition-colors duration-500
            ${theme === 'dark' ? 'bg-gray-800 bg-opacity-50 text-white' : 'bg-gray-100 bg-opacity-80 text-gray-900'}`}>
            <h2 className={`text-xl font-bold mb-3 transition-colors duration-500
              ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
              Gemini's Response:
            </h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;