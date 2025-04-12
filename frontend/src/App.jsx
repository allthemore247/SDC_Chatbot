import { useState, useEffect } from 'react'
import Message from './components/message.jsx'

function App() {
	// creates a persistent variable for the conversation history 
	// the first is set to a system message, this gives the AI context
	const [conversationHistory, setConversationHistory] = useState([{role: 'system', content: "You are a sarcastic Doctor."}]) 
	const [messages, setMessages] = useState([])

	const updateConversationHistory = async (role, content) => { // this makes updating the conversationHistory a bit easier to type
		setConversationHistory([...conversationHistory, {role: role, content: content}])
	}

	const handleSubmit = async () => {
		let currentHistory = conversationHistory; // this allows for a current history in the function due to useStates not immediately updating
    	const messageInput = document.getElementById('messageInput')
		
		if (!messageInput) return

		const userMessage = messageInput.value

		// update conversation history AND current history with new message
		updateConversationHistory('user', userMessage)
		currentHistory.push({role: 'user', content: userMessage})

		messageInput.value = '' // reset messageInput

		const messages = JSON.stringify({ messages: currentHistory })
		console.log(messages)

		console.log("User: " + userMessage)

		let response = null

		try {
			response = await fetch('http://localhost:5000/chatbot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: messages,
			})
		} catch (error) {
			console.error('Error:', error)
			updateConversationHistory('assistant', "I'm sorry, It seems like there was an error with the connection.") // push an error message from the assistant onto the conversation History
			console.log("Assistant: " + "I'm sorry, It seems like there was an error with the connection.")
			return
		}

		const data = await response.json()

		console.log("Assistant: " + data.response)
		updateConversationHistory('assistant', data.response)
  	}

	useEffect(() => { // enables re-rendering upon update of dependency, params are function and dependency array
		setMessages(
			// filters out certain messages; in this case it filters out conversationHistory with 'system' role
			conversationHistory.filter((message) => message.role !== 'system').map((message, index) => {
				// then, filtered messages are mapped with map function to XML elements with function that takes in conversation History message and index which is invremented by the map function
				// map to Message element with key, id, message, color props
				if (message.role === 'user') {
					return <Message key={index} id={`message${index}`} message={message.content} color={"#0791fa"}/> // blue if user
				} else {
					return <Message key={index} id={`message${index}`} message={message.content} color={"#b6bbbf"}/> // blue if user
				}
			})
		)

	}, [conversationHistory]); // dependency list, on update function is run

	return (
		// returns array of jsx elements (messages in a div and input + button in a div)
		<>
			<div id="messages">
				{messages}
			</div>
		  	<div id="prompt">
				<input id="messageInput" contentEditable></input>
				<button id="submit" onClick={handleSubmit}></button>    
		  	</div>
		</>
	)
}

export default App