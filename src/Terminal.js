import React, { useState } from 'react';
import './Terminal.css';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [token, setToken] = useState(null); // State to store the authentication token

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      await executeCommand(input);
      setInput('');
    }
  };

  const executeCommand = async (command) => {
    let result;
    const [cmd, ...args] = command.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        result = 'Available commands: help, hello, login, narrator, clear';
        break;
      case 'hello':
        result = 'Hello there!';
        break;
      case 'clear':
        setOutput([]);
        return;
      case 'register':
        if (args.length < 2) {
          result = "Usage: register <username> <password> <character name>";
        } else {
          const user_param = args[0];
          const password_param = args[1];
	  const charactername_param = args[2];
          result = await registerUser(user_param, password_param, charactername_param);
        }
        break;
     case 'login':
        if (args.length < 2) {
          result = "Usage: login <username> <password>";
        } else {
          const user_param = args[0];
          const password_param = args[1];
          result = await authenticateUser(user_param, password_param);
        }
        break;
     case 'narrator':
        if (!token) {
          result = "Error: You must be logged in to use the narrator command.";
        } else {
          const prompt = args.join(' ');
          result = await callNarrator(prompt);
        }
        break;
    case 'last':
        if (!token) {
          result = "Error: You must be logged in to use the last command.";
        } else if (args[0] == "thought") {
          const prompt = args.join(' ');
          result = await callLastThought(prompt);
        }
        break;
    case 'think':
        if (!token) {
          result = "Error: You must be logged in to use the think command.";
        } else {
          const prompt = args.join(' ');
          result = await callThink(prompt);
        }
        break;
    case 'location':
        if (!token) {
          result = "Error: You must be logged in to use the location command.";
        } else {
          const prompt = args.join(' ');
          result = await callLocation(prompt);
        }
        break;
    default:
        result = `'${command}' is not recognized as a valid command. Type 'help' for a list of commands.`;
    }
    setOutput([...output, `> ${command}`, result]);
  };

  const registerUser = async (username, password, character_name) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          character_name: character_name
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setToken(data.access_token);
      return 'Authentication successful! Token stored.';
    } catch (error) {
      return `Authentication failed: ${error.message}`;
    }
  };
 const authenticateUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setToken(data.access_token);
      return 'Authentication successful! Token stored.';
    } catch (error) {
      return `Authentication failed: ${error.message}`;
    }
  };

  const callLocation = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/location', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Location request failed');
      }

      const data = await response.json();
      return data.response || 'Location response received';
    } catch (error) {
      return `Location request failed: ${error.message}`;
    }
  };

  const callNarrator = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/narrator', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Narrator request failed');
      }

      const data = await response.json();
      return data.response || 'Narrator response received';
    } catch (error) {
      return `Narrator request failed: ${error.message}`;
    }
  };

  const callThink = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/think', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Think request failed');
      }

      const data = await response.json();
      return data.response || 'Think response received';
    } catch (error) {
      return `Think request failed: ${error.message}`;
    }
  };

  const callLastThought = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/last/thought', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }/*,
        body: JSON.stringify({
          prompt: prompt,
        }),*/
      });

      if (!response.ok) {
        throw new Error('Last thought request failed');
      }

      const data = await response.json();
      return data.response || 'Last thought response received';
    } catch (error) {
      return `Last thought request failed: ${error.message}`;
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-title">Advanced Terminal</div>
      </div>
      <div className="terminal-window">
        <div className="terminal-content">
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div className="input-line">
            <span>> </span>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;

