import { createContext, useState, useEffect } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPromts, setPrevPromts] = useState(() => {
    // Retrieve conversations from localStorage
    const savedConversations = localStorage.getItem("conversations");
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [responses, setResponses] = useState([]); // Store all responses of the current conversation
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(prevPromts));
  }, [prevPromts]);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResponses(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1], response: prev[prev.length - 1].response + nextWord }]);
    }, 90 * index);
  };

  const newChat = () => {
    if (recentPrompt) {
      // Save the current conversation before starting a new chat
      setPrevPromts(prev => [...prev, { prompt: recentPrompt, responses }]);
    }
    setLoading(false);
    setShowResult(false);
    setResponses([]); // Clear responses for new chat
    setRecentPrompt(""); // Clear the prompt for new chat
  };

  const onSent = async () => {
    if (input.trim() === "") return; // Avoid empty prompts

    const newResponse = { prompt: input, response: "" }; // Create a new response object
    setResponses(prev => [...prev, newResponse]); // Add the new response object

    setLoading(true);
    setShowResult(true);

    let response = await run(input);
    setRecentPrompt(input);

    let responseArray = response.split("**");
    let formattedResponse = responseArray.map((word, index) => 
      index % 2 === 1 ? `<b>${word}</b>` : word
    ).join(" ");

    formattedResponse = formattedResponse.split("*").join("</br>");

    // Update the most recent response with the full formatted response
    setResponses(prev => {
      const updatedResponses = [...prev];
      updatedResponses[updatedResponses.length - 1].response = formattedResponse; // Update the last response
      return updatedResponses;
    });

    setLoading(false);
    setInput("");
  };

  const loadPrompt = (promptData) => {
    // Load previous prompt and responses into the main frame
    setRecentPrompt(promptData.prompt);
    setResponses(promptData.responses);
    setShowResult(true);
  };

  const contextValue = {
    prevPromts,
    setPrevPromts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    responses,
    input,
    setInput,
    newChat,
    loadPrompt, // Expose loadPrompt function to sidebar
    setResponses, // Pass the setResponses function
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
