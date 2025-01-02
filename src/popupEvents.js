document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("whoisButton");
  if (button) {
    button.addEventListener("click", function() {
      // alert("Button clicked! Checking WHOIS info...");

      // Show processing icon (loading)
      const processingIcon = document.getElementById("processing-icon");
      if (processingIcon) {
        processingIcon.style.display = "inline-block"; // Show loading icon
      }

      // Get the current tab's URL
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentUrl = tabs[0].url;

        // Send the URL to the Python backend API
        fetch('http://localhost:5000/get_whois_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: currentUrl })
        })
        .then(response => response.json())
        .then(data => {
          // Hide loading icon
          if (processingIcon) {
            processingIcon.style.display = "none"; // Hide loading icon
          }

          // Check if there's an error
          if (data.error) {
            alert("Error: " + data.error);
          } else {
            alert("WHOIS Information:\n" + JSON.stringify(data, null, 2));
          }
        })
        .catch(error => {
          // Hide loading icon in case of error
          if (processingIcon) {
            processingIcon.style.display = "none";
          }
          alert("Error: " + error);
        });
      });
    });
  } else {
    console.error("Button not found");
  }
});
