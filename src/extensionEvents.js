chrome.action.onClicked.addListener((tab) => {
  const url = tab.url;  // Get the current tab URL
  console.log("Fetching website info for:", url);

  // Send the URL to the Flask API to fetch WHOIS info
  fetch('http://localhost:5000/fetch_whois?url=' + encodeURIComponent(url))
    .then(response => response.json())
    .then(data => {
      console.log("WHOIS Data:", data);
      // Here you can display the WHOIS info in the popup
      chrome.runtime.sendMessage({ type: "whois_info", data: data });
    })
    .catch(error => {
      console.error("Error fetching WHOIS data:", error);
    });
});
