import React, { useState, useEffect, useRef } from 'react';
import icon from '../../assets/img/icon.png';
import axios from 'axios';
import '../../../output.css'
import { FaTwitter, FaLinkedinIn, FaSpinner, FaCopy } from "react-icons/fa";


function TextAreaWithCopyButton({ value, setValue }) {
  const textAreaRef = useRef(null);

  useEffect(() => {
    setValue(value)
  }, []);

  function handleCopy() {
    textAreaRef.current.select();
    document.execCommand('copy');
  }

  return (
    <div className="flex items-center space-x-2 rounded-md border border-gray-300 p-2 w-5/6">
      <textarea
        ref={textAreaRef}
        className="w-full resize-none rounded-md focus:outline-none"
        default={value}
        value={value}
        onChange={ (e) => {
          setValue(e.target.value)
        }}
        rows={Math.ceil(value.length / 30)}
      />
      <button
        className="flex items-center justify-center rounded-md bg-blue-500 hover:bg-blue-600 text-white px-3 py-2"
        onClick={handleCopy}
      >
        <FaCopy />
      </button>
    </div>
  );
}


const Dropdown = ({ selectedOption, setSelectedOption }) => {
  // Array of options
  const options = [
    'Get a meeting with them',
    'Learn a skill from them',
    'Learn about their company',
    'Connect from an event',
    'Recruit them',
    'Get advice',
    'Get a hug (not recommended, super weird)',
    'Other'
    // Add more options here
  ];

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      {/* Dropdown */}
      <select
        className="px-4 py-2 border border-gray-300 rounded-md"
        value={selectedOption}
        onChange={(e) => handleOptionSelect(e.target.value)}
      >
        {/* Initial "Select option" placeholder */}
        <option value={null}>Select option</option>

        {/* Render options dynamically */}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Display selected option */}
      <div className="mt-4">
        <p>
          Selected option: <strong>{selectedOption || 'None'}</strong>
        </p>
      </div>
    </div>
  );
};

const Popup = () => {
  const [goal, setGoal] = useState("");

  const [logo, setLogo] = useState();
  const [name, setName] = useState("");
  const [title, setTitle] = useState();
  const [currCo, setCurrCo] = useState();
  const [education, setEducation] = useState();
  const [location, setLocation] = useState();

  const [featured, setFeatured] = useState([]);
  const [activity, setActivity] = useState([]);

  const [about, setAbout] = useState();
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [causes, setCauses] = useState();

  const [message, setMessage] = useState("");
  const [ipAddress, setIpAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeProfileInfo' }, function(response) {
        // Here, you can access the response object, which should contain the scraped data.
        // You can then use this data to update your state.
        setName(response.name);
        setTitle(response.title);
        setCurrCo(response.company);
        setEducation(response.education);
        setLocation(response.location);
        setFeatured(response.featured)
      });
    });

    // Get the IP address using an API
    axios.get('https://api.ipify.org/?format=json')
      .then(response => {
        setIpAddress(response.data.ip);
      })
      .catch(error => {
        console.log(error);
        setError(error)
      });
  }, []);

  const onClick = () => {
    setLoading(true)
    console.log(name, title)
    fetch("http://127.0.0.1:8000/api/fetch-message-430ce34d020724e", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        extension_id: chrome.runtime.id,
        ip_address: ipAddress,
        url: window.location.href,
        name: name,
        title: title,
        current_company: currCo,
        education: education,
        location: location,
        featured: featured,
        goal: goal
      }),
    })
    .then((response) => {
      setLoading(false)
      return response.json();
    })
    .then((data) => {
      setMessage(data["message"])
    })
    .catch((error) => {
      console.log(error)
      setLoading(false)
    });
  };

  return (
    <div className="m-4 font-family-poppins rounded-md">
      <header>
        <a href="https://leadcat.co" target="_blank" className="flex flex-row">
          <img src={icon} alt="Leadcat Logo" className="w-8 h-8 mr-3" />
          <div className="text-gray-500 text-2xl font-semibold">
            Leadcat AI Outbounding
          </div>
        </a>
        {
          window.location.hostname.includes('linkedin.com') ? <FaLinkedinIn /> :
          window.location.hostname.includes('twitter.com') ? <FaTwitter /> : <></>
        }
      </header>
      <br />
      <body className="text-lg">
        <div className="font-semibold">{name}</div>
        <div>{title}</div>
        <Dropdown selectedOption={goal} setSelectedOption={setGoal}/>
        <br />
        <TextAreaWithCopyButton value={message} setValue={setMessage}/>
        <button
          type="button"
          onClick={onClick}
          // disabled={loading || name==""}
          disabled={loading}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {
            loading ? FaSpinner : "New Message"
          }
        </button>
        {!loading && error}
      </body>
      <br />
    </div>
  );
};

export default Popup;
