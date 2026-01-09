from flask import Flask, render_template, request, jsonify
import requests
import os
import json
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='dist', static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

def load_ignored_repos():
    ignored_repos = set()
    try:
        if os.path.exists('ignored_repos.txt'):
            with open('ignored_repos.txt', 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        ignored_repos.add(line.lower())
            print(f"Loaded {len(ignored_repos)} ignored repositories")
    except Exception as e:
        print(f"Error loading ignored repos: {e}")
        return set()

def load_repos_from_file():
    try:
        if os.path.exists('repo.txt'):
            with open('repo.txt', 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            if isinstance(cache_data, list):
                print("Old cache format detected, will update to new format")
                return cache_data
            elif isinstance(cache_data, dict) and 'repos' in cache_data:
                return cache_data['repos']
            else:
                print("Invalid cache format")
                return None
        return None
    except Exception as e:
        print(f"Error loading repos from file: {e}")
        return None

def save_repos_to_file(repos_data):
    try:
        cache_data = {
            'timestamp': datetime.now().isoformat(),
            'repos': repos_data
        }
        with open('repo.txt', 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, indent=2, ensure_ascii=False)
        print("Repositories saved to repo.txt with timestamp")
    except Exception as e:
        print(f"Error saving repos to file: {e}")

def is_cache_stale():
    try:
        if not os.path.exists('repo.txt'):
            return True
        
        with open('repo.txt', 'r', encoding='utf-8') as f:
            cache_data = json.load(f)
        
        if 'timestamp' not in cache_data:
            print("Cache missing timestamp, considering stale")
            return True
        
        cache_time = datetime.fromisoformat(cache_data['timestamp'])
        current_time = datetime.now()
        time_diff = current_time - cache_time
        
        is_stale = time_diff > timedelta(hours=2)
        print(f"Cache age: {time_diff}, stale: {is_stale}")
        return is_stale
        
    except Exception as e:
        print(f"Error checking cache staleness: {e}")
        return True

def get_readme_content(username, repo_name):
    try:
        readme_url = f'https://api.github.com/repos/{username}/{repo_name}/readme'
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App'
        }
        
        response = requests.get(readme_url, headers=headers, timeout=5)
        if response.status_code == 200:
            readme_data = response.json()
            import base64
            content = base64.b64decode(readme_data['content']).decode('utf-8', errors='ignore')
            return content.lower()
        return ""
    except Exception as e:
        print(f"Error fetching README for {repo_name}: {e}")
        return ""

def determine_repo_status(username, repo_name):
    readme_content = get_readme_content(username, repo_name)
    
    if not readme_content.strip():
        return 'under dev'
    
    under_dev_keywords = [
        'under development', 'work in progress', 'wip', 'coming soon',
        'in development', 'todo', 'not complete', 'incomplete',
        'under construction', 'beta', 'experimental', 'draft'
    ]
    
    for keyword in under_dev_keywords:
        if keyword in readme_content:
            return 'under dev'
    
    return 'completed'

def fetch_github_repos():
    try:
        username = 'JatinNirwann'
        url = f'https://api.github.com/users/{username}/repos'
        
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        repos = response.json()
        
        ignored_repos = load_ignored_repos()
        
        formatted_repos = []
        for repo in repos:
            if not repo['fork'] and repo['name'].lower() not in ignored_repos:
                print(f"Analyzing repository: {repo['name']}")
                status = determine_repo_status(username, repo['name'])
                print(f"  Status determined: {status}")
                
                formatted_repo = {
                    'name': repo['name'],
                    'description': repo['description'] or 'No description available',
                    'html_url': repo['html_url'],
                    'language': repo['language'] or 'Unknown',
                    'stargazers_count': repo['stargazers_count'],
                    'forks_count': repo['forks_count'],
                    'updated_at': repo['updated_at'],
                    'topics': repo.get('topics', []),
                    'status': status
                }
                formatted_repos.append(formatted_repo)
        
        formatted_repos.sort(key=lambda x: (x['stargazers_count'], x['updated_at']), reverse=True)
        
        print(f"Fetched {len(formatted_repos)} repositories (after filtering)")
        return formatted_repos[:12]
        
    except Exception as e:
        print(f"Error fetching GitHub repos: {e}")
        return []



@app.route('/api/github-repos')
def get_github_repos():
    try:
        cached_repos = load_repos_from_file()
        cache_is_stale = is_cache_stale()
        
        if cached_repos and not cache_is_stale:
            print("Loading repositories from fresh cache")
            ignored_repos = load_ignored_repos()
            filtered_repos = [
                repo for repo in cached_repos 
                if repo['name'].lower() not in ignored_repos
            ]
            return jsonify({
                'success': True,
                'repos': filtered_repos,
                'source': 'cache'
            })
        else:
            if cache_is_stale:
                print("Cache is stale (>2 hours old), refreshing from GitHub API")
            else:
                print("repo.txt not found, fetching from GitHub API")
                
            repos = fetch_github_repos()
            
            if repos:
                save_repos_to_file(repos)
                return jsonify({
                    'success': True,
                    'repos': repos,
                    'source': 'github_api'
                })
            elif cached_repos:
                print("Failed to fetch fresh repos, falling back to stale cache")
                ignored_repos = load_ignored_repos()
                filtered_repos = [
                    repo for repo in cached_repos 
                    if repo['name'].lower() not in ignored_repos
                ]
                return jsonify({
                    'success': True,
                    'repos': filtered_repos,
                    'source': 'cache_stale'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to fetch repositories'
                }), 500
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e)
        }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/contact', methods=['POST'])
def send_contact_email():
    try:
        data = request.json
        name = data.get('name')
        visitor_email = data.get('email')
        message = data.get('message')

        if not all([name, visitor_email, message]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        # Email Configuration
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_email = os.environ.get('SMTP_EMAIL')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        recipient_email = os.environ.get('RECIPIENT_EMAIL', 'jatinbuilds@outlook.com') # Default fallback

        if not smtp_email or not smtp_password:
            # Fallback path if no credentials configured: log to file
            print("WARNING: SMTP credentials not set. Logging message to file instead.")
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'name': name,
                'email': visitor_email,
                'message': message
            }
            with open('messages.json', 'a') as f:
                f.write(json.dumps(log_entry) + '\n')
            
            return jsonify({
                'success': True, 
                'message': 'Message received (logged mode)'
            })

        # Send Email via SMTP
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = recipient_email
        msg['Subject'] = f"New Signal from {name} (Portfolio)"
        msg['Reply-To'] = visitor_email

        body = f"""
        New Contact Form Submission:
        
        Name: {name}
        Email: {visitor_email}
        
        Message:
        {message}
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_email, recipient_email, text)

        # ---------------------------------------------------------
        # Send Auto-Reply to Visitor
        # ---------------------------------------------------------
        try:
            reply_msg = MIMEMultipart()
            reply_msg['From'] = smtp_email
            reply_msg['To'] = visitor_email
            reply_msg['Subject'] = f"Signal Received: Thanks for connecting, {name}!"

            reply_body = f"""
            Hi {name},

            Thank you for reaching out! I've securely received your message from my portfolio.

            This is an automated confirmation to let you know I'll be reviewing it shortly. 
            If your inquiry requires a response, I'll get back to you as soon as possible.

            Best regards,
            Jatin Nirwann
            jatinbuilds@outlook.com
            """
            reply_msg.attach(MIMEText(reply_body, 'plain'))
            server.sendmail(smtp_email, visitor_email, reply_msg.as_string())
            print(f"Auto-reply sent to {visitor_email}")
        except Exception as reply_error:
            # Don't fail the main request if auto-reply fails, just log it
            print(f"Failed to send auto-reply: {reply_error}")

        server.quit()

        return jsonify({'success': True, 'message': 'Signal transmitted successfully'})

    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({
            'success': False, 
            'error': 'Failed to transmit signal',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    if not os.path.exists('repo.txt'):
        print("repo.txt not found, will fetch from GitHub on first request")
    else:
        print("repo.txt found, will use cached repositories")
    
    ignored_repos = load_ignored_repos()
    if ignored_repos:
        print(f"Ignoring {len(ignored_repos)} repositories: {', '.join(sorted(ignored_repos))}")
    else:
        print("No repositories will be ignored")
    
    app.run(debug=True, host='0.0.0.0', port=5000)