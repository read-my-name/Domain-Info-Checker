# Domain-Info-Checker

## How to Run

### 1. Navigate to the Chrome Extensions page:
- Open Chrome and type `chrome://extensions/` in the address bar.
- Enable "Developer Mode" in the top-right corner.
- Click on "Load unpacked" and select the project folder.

### 2. Start the Flask server:
#### Install necessary libraries:
```
pip install flask
pip install python-whois
pip install pytz
```
#### Run the Flask App:
To start the Flask server, use the command:
```
python app.py
```
Once the server is running, you can click the extension icon in Chrome to open the popup and check WHOIS information.

### How It Works
1. When you click the extension icon, it fetches the URL of the active tab and sends it to the Flask backend.
2. The Flask server fetches the WHOIS information of the URL.
3. The server sends the WHOIS data back to the extension.
4. The extension displays the data in a table format in the popup.

### Contributing
Feel free to fork this repository, make improvements, and submit pull requests. All contributions are welcome!

### Acknowledgments
If you use this source code in your project, I kindly request that you provide proper attribution by quoting or mentioning me as the original author. You can include a reference to my GitHub profile:
[GitHub](https://github.com/read-my-name)

Your acknowledgment is greatly appreciated and encourages open-source contributions!
