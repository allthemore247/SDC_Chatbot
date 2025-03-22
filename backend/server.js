require('dotenv').config();

// Create an express app
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Allow cross-origin requests, remove this line if don't want to allow

// Port
const PORT = process.env.PORT;

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error occurred");
});

// OpenAI API
const {OpenAI} = require('openai');
const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/chatbot', async (req, res) => {
    try {
        const conversationHistory = req.body.messages; // gets conversation history
        console.log(conversationHistory); // displays the conversation history server side
        console.log("User: " + conversationHistory[conversationHistory.length - 1].content); // displays the most recent message server side

        // conversation with NO history
        //const userMessage = req.body; // get user message
        //console.log("user: " + userMessage);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: conversationHistory, // will need to include coversation histroy soon
            temperature: 0.9, // control randomness of responses
        });

        let AIMessage = response.choices[0].message.content;
        console.log("assistant: " + AIMessage);
        return res.json({ response: AIMessage });
    } catch (error) {
        res.status(500).json({ error: 'Error occurred while asking OpenAI' });
        console.error(error);
    }
});

app.get('/', (req, res) => {
    res.send('server is running');
});

// start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening at 0.0.0.0:${PORT}`)
});