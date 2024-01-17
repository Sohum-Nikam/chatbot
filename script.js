document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const closeBtn = document.querySelector('.close-btn');
    const chatbox = document.querySelector('.chatbox');
    const chatInput = document.querySelector('.chat-input textarea');
    const sendChatBtn = document.querySelector('.chat-input span');
    let userMessage = null;
    const API_KEY = "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"; // Replace with your OpenAI API key
    const inputInitHeight = chatInput.scrollHeight;
    const API_URL = "https://api.openai.com/v1/engines/davinci-codex/completions";
  
    const createChatLi = (message, className) => {
      const chatLi = document.createElement('li');
      chatLi.classList.add('chat', className);
      let chatContent = className === 'outgoing' ? '<p></p>' : '<span class="material-symbols-outlined">smart_toy</span><p></p>';
      chatLi.innerHTML = chatContent;
      chatLi.querySelector('p').textContent = message;
      return chatLi;
    };
  
    const showLoadingSpinner = (chatElement) => {
      const messageElement = chatElement.querySelector('p');
      messageElement.innerHTML = '<div class="loading-spinner"></div> Thinking...';
    };
  
    const generateResponse = (chatElement) => {
      const messageElement = chatElement.querySelector('p');
      showLoadingSpinner(chatElement);
  
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userMessage,
          max_tokens: 150,
        }),
      };
  
      console.log("Making API request:", API_URL);
      fetch(API_URL, requestOptions)
        .then(res => {
          console.log("API Response Status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("API Response Data:", data);
          messageElement.textContent = data.choices[0].text.trim();
        })
        .catch((error) => {
          console.error("Error fetching response:", error);
          messageElement.classList.add("error");
          messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    };
  
    const handleChat = () => {
      userMessage = chatInput.value.trim();
      if (!userMessage) return;
  
      chatInput.value = "";
      chatInput.style.height = `${inputInitHeight}px`;
  
      chatbox.appendChild(createChatLi(userMessage, "outgoing"));
      chatbox.scrollTo(0, chatbox.scrollHeight);
  
      setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
      }, 600);
    };
  
    chatInput.addEventListener("input", () => {
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });
  
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
      }
    });
  
    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
  });
  
