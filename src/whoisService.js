console.log("Popup script loaded successfully.");

// Get DOM elements
const whoisButton = document.getElementById('whoisButton');
const urlInput = document.getElementById('urlInput');
const loader = document.getElementById('loader');
const resultsTable = document.getElementById('resultsTable');
const resultsBody = document.getElementById('resultsBody');

// Fetch the current tab's URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  console.log("Fetching current tab's URL...");
  try {
    if (tabs.length === 0) {
      console.error("No active tabs found.");
      urlInput.placeholder = "No active tab detected.";
      return;
    }

    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      console.log("Current tab URL:", currentTab.url);
      urlInput.value = currentTab.url;
    } else {
      console.error("Failed to fetch URL from the active tab.");
      urlInput.placeholder = "Unable to fetch current tab URL.";
    }
  } catch (error) {
    console.error("Error fetching current tab's URL:", error);
    urlInput.placeholder = "Error occurred while fetching URL.";
  }
});

// Add event listener for button click
whoisButton.addEventListener('click', async () => {
  console.log("Whois button clicked.");

  // Show loader
  loader.style.display = 'block';
  resultsTable.style.display = 'none';
  resultsBody.innerHTML = ''; // Clear previous results

  // Get the URL
  const url = urlInput.value.trim();
  if (!url) {
    alert('Please enter a valid URL!');
    console.error("No URL entered.");
    loader.style.display = 'none';
    return;
  }

  console.log("Fetching WHOIS info for:", url);

  try {
    const response = await fetch(`http://127.0.0.1:5000/get_whois_info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
  
      if (response.ok) {
        console.log("WHOIS data fetched successfully:", data);
  
        // Populate table
        for (const [key, value] of Object.entries(data)) {
          const row = document.createElement('tr');
          const fieldCell = document.createElement('td');
          fieldCell.textContent = key;
  
          const valueCell = document.createElement('td');
          valueCell.textContent = value;
  
          row.appendChild(fieldCell);
          row.appendChild(valueCell);
          resultsBody.appendChild(row);
        }
        resultsTable.style.display = 'table';
      } else {
        console.error("Error response from WHOIS API:", data);
        alert(`Error: ${data.error || 'Failed to fetch WHOIS info'}`);
      }
    } else {
      // Non-JSON response
      const text = await response.text();
      console.error("Unexpected response format:", text);
      alert(`Unexpected response format. Server response:\n${text}`);
    }
  } catch (err) {
    console.error("Error occurred while fetching WHOIS info:", err);
    alert(`An error occurred: ${err.message}`);
  } finally {
    // Hide loader
    loader.style.display = 'none';
  }
});

// Add event listener for the "Enter" key press on the input field
urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission or other default actions
    whoisButton.click(); // Trigger the WHOIS lookup button click
  }
});

// Ensure that the input is focused on extension load
window.addEventListener('DOMContentLoaded', () => {
  urlInput.focus(); // Ensure the input field is focused
});
