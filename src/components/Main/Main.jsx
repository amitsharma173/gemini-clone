import React, { useContext, useEffect, useRef } from "react";
import "./Main.css";
import { Context } from "../../contex/Context";
import { assets } from '../../assets/assets';

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    responses,
    setResponses,
    setInput,
    input,
  } = useContext(Context);

  const messagesEndRef = useRef(null); // Add a reference to scroll to the bottom

  // Load conversation history from localStorage on component mount
  useEffect(() => {
    const storedResponses = localStorage.getItem("conversationHistory");
    if (storedResponses) {
      try {
        setResponses(JSON.parse(storedResponses));
      } catch (e) {
        console.error("Error parsing conversation history from localStorage", e);
      }
    }
  }, [setResponses]);

  // Save conversation history to localStorage whenever responses change
  useEffect(() => {
    localStorage.setItem("conversationHistory", JSON.stringify(responses));
    scrollToBottom(); // Scroll to the bottom when new response is added
  }, [responses]);

  // Scroll to the bottom of the conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input) {
      onSent();
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <div className="developed">
          <p>
            <span>AI-Chat Bot -Developed by AMIT KUMAR</span>
          </p>
        </div>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How Can I Help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-data">
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div className="responses-container">
                  {/* Map through responses */}
                  {responses.map((responseItem, index) => (
                    <div key={index}>
                      {/* User's Prompt with icon */}
                      <div className="user-message">
                        <img src={assets.user_icon} alt="User" className="icon" />
                        <div className="message-content">{responseItem.prompt}</div>
                      </div>

                      {/* Bot's Response with icon */}
                      <div className="bot-response">
                        <img src={assets.gemini_icon} alt="Bot" className="icon" />
                        <div className="message-content" dangerouslySetInnerHTML={{ __html: responseItem.response }} />
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} /> {/* Empty div to scroll into view */}
                </div>
              )}
            </div>
          </div>
        )}
        <br />
        
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a Prompt here"
              onKeyDown={handleKeyDown} // Add keydown listener
            />
            <div>
              {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            AI-CHAT BOT may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
