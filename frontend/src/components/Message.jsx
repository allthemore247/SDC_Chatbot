import { useState, useEffect} from "react";
// props: message, color, id

const Message = (props) => {
    // stores the message to be displayed, or error if no message given
    const [words, setWords] = useState(props.message === undefined ? "I'm sorry, there was an error sending the message.".split(' ') : props.message.split(' '));

    // stores current message output
    const [message, setMessage] = useState('');

    // count keeps track of word index to be added to message, init to -1 ensures no duplicate word on first render
    const [count, setCount] = useState(-1);

    // procedurally generate messages
    const writeMessage = () => {
        // prevMessage represents previous state
        // [...] spreads existing array into new array (ensuring immutability)
        // words[count] adds new word at the end
        setMessage(prevMessage => [...prevMessage, words[count] + ' ']);
        setCount(count + 1);
    }

    // enable re-rendering upon dependency update, parameters are a function (arrow function) and dependency array
    useEffect(() => {
        if (count === -1) { // set count to 0 on first render
            setCount(0);
        } else if (count < words.length) { // while words to display, continue
            // 100ms delay between adding words to display
            setTimeout(writeMessage, 100);

            // gets Message element info from DOM
            const newMessage = document.getElementById(props.id);

            // scrolls Message into view as generated
            newMessage.scrollIntoView();
        }
    }, [count]); // when count updated, this function is run

    return (
        // return div with id, classname, and background-color css styleset
        <div id={props.id} className="message" style={{backgroundColor: props.color}}>
            <h1 style={{height:"auto"}}>{message}</h1>
        </div>
    );
}

export default Message;