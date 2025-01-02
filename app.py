from flask import Flask, request, jsonify
import whois
import re
import pytz
from datetime import datetime

app = Flask(__name__)

@app.route("/get_whois_info", methods=["POST"])
def get_whois_info():
    try:
        # Debug: Print the incoming request data
        print("Request received:", request.json)
        
        url = request.json.get("url")
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        domain = re.sub(r'^https?://(www\.)?', '', url).split('/')[0]
        whois_info = whois.whois(domain)

        # Debug: Print WHOIS info to ensure it's being fetched correctly
        print("WHOIS Info:", whois_info)
        
        return jsonify({
            'Domain Name': whois_info.domain_name,
            'Updated Date': format_datetime(whois_info.get('updated_date')),
            'Creation Date': format_datetime(whois_info.creation_date),
            'Registrar Registration Expiration Date': format_datetime(whois_info.expiration_date),
            'Registrar': whois_info.registrar,
            'Registrant Organization': whois_info.get('org', 'Not Available'),
            'Registrant State/Province': whois_info.get('state', 'Not Available'),
            'Registrant Country': whois_info.get('country', 'Not Available'),
        })
    
    except Exception as e:
        # Debug: Print any error that occurs during the process
        print("Error fetching WHOIS info:", str(e))
        return jsonify({"error": f"Error fetching WHOIS info: {str(e)}"}), 500

def format_datetime(dt):
    if isinstance(dt, list) and dt:
        dt = dt[0]  # Take the first datetime
    if dt:
        # Ensure the input datetime is in UTC if it's naive (no timezone)
        if not dt.tzinfo:
            dt = pytz.utc.localize(dt)
        singapore_tz = pytz.timezone('Asia/Singapore')
        sg_time = dt.astimezone(singapore_tz)
        return f"{dt.strftime('%Y-%m-%d %H:%M:%S')} UTC / {sg_time.strftime('%Y-%m-%d %H:%M:%S')} SGT"
    return "Not Available"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
