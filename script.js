// URL AND KEY TO CONNECT
const supabaseUrl = 'https://krcskibgdcfdscynrkwg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyY3NraWJnZGNmZHNjeW5ya3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczNDczNTMsImV4cCI6MjAzMjkyMzM1M30.81T4lcYMpDA_3WFlBR5qJgvGUy1gi4hNTjD5qPS36OI';

// Connecting to database
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// API KEY
const openAIKey = 'sk-proj-ZVEYdKVcoRxJVVf5xjVAT3BlbkFJWOT7dWY984UOdQFwUDTy';

// ASYNC - AWAIT
async function askOpenAI(question) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAIKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
      //   max_tokens: 150,
    }),
  });
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

document.getElementById('send-button').addEventListener('click', async () => {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  messageInput.value = '';

  const userId = 1;

  let { data, error } = await supabaseClient
    .from('messages')
    .insert([{ text: messageText, user_id: userId, is_user_message: true }]);

  if (error) {
    console.error('Error sending user message:', error);
    return;
  }

  const chatReponse = await askOpenAI(messageText);
  if (!chatReponse.choices || chatReponse.choices.length === 0) {
    console.error('No response from API:', chatReponse);
    return;
  }
  const genText = chatReponse.choices[0].message.content;

  const { data: aiData, error: aiError } = await supabaseClient
    .from('messages')
    .insert([{ text: genText, user_id: userId, is_user_message: false }]);

  if (aiError) {
    console.error('Error sending AI message:', aiError);
    return;
  }

  fetchMessages();
});

document.getElementById('del-button').addEventListener('click', async () => {
  if (confirm('Clear the messages?')) {
    let { data, error } = await supabaseClient
      .from('messages')
      .delete()
      .gt('message_id', 0);

    if (error) {
      console.error('Error deleting messages:', error);
      alert('Failed to delete messages.');
    } else {
      fetchMessages();
    }
  }
});

async function fetchMessages() {
  const { data: messages, error } = await supabaseClient
    .from('messages')
    .select('*');

  if (error) {
    console.error('Error fetching messages:', error);
    return;
  }
  displayMessages(messages);
}

function displayMessages(messages) {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';
  messages.forEach((message) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message.text;
    messageDiv.className = message.is_user_message
      ? 'message user-message'
      : 'message ai-message';
    messagesContainer.appendChild(messageDiv);
  });
}

fetchMessages();

let pixelGameWindow;

document.getElementById('maximizeButton').addEventListener('click', () => {
  pixelGameWindow = window.open(
    'https://iamnurbek.github.io/pixel/',
    'Pixel Game',
    'width=1920,height=1080'
  );
});

document.getElementById('closeButton').addEventListener('click', () => {
  window.close();
});
