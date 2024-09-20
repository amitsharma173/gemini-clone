import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../contex/Context';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { prevPromts, loadPrompt, newChat, setPrevPrompts } = useContext(Context); // Make sure setPrevPrompts is available here

  // Handle deleting a specific prompt
  const handleDelete = (index) => {
    const updatedPrompts = prevPromts.filter((_, i) => i !== index);
    setPrevPrompts(updatedPrompts); // Update the state in context
    localStorage.setItem("conversationHistory", JSON.stringify(updatedPrompts)); // Save the updated history in localStorage
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img onClick={() => setExtended(prev => !prev)} className="menu" src={assets.menu_icon} alt="" />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>NEW CHAT</p> : null}
        </div>

        {extended ? (
          <div className="recent">
            <p className="recent-title">RECENT</p>
            {prevPromts.map((item, index) => (
              <div key={index} className="recent-entry">
                <div onClick={() => loadPrompt(item)} className="recent-item">
                  <img src={assets.message_icon} alt="" />
                  <p>{item.prompt.slice(0, 18)}...</p>
                </div>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from firing on parent div
                  handleDelete(index);
                }} className="delete-btn">
                  {/* <img src={assets.delete_icon} alt="Delete" /> */}
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
{/*       
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Setting</p> : null}
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
