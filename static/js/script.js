class PortfolioApp {
    constructor() {
        this.scrollObserver = null;
        this.init();
    }

    init() {
        console.log('Portfolio app initializing...');
        this.initScrollAnimations();
        this.initNavbar();
        this.initSmoothScrolling();
        this.loadGitHubProjects();
        this.setupAutoRefresh();
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate');

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    initNavbar() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            // Corrected to find sections by ID (which template.html has)
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                // Check if the link's href matches the current section's ID
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async loadGitHubProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const loadingElement = document.querySelector('.project-loading');
        
        console.log('Loading GitHub projects...');
        
        try {
            console.log('Fetching from /api/github-repos...');
            const response = await fetch('/api/github-repos', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.success && data.repos) {
                console.log(`Found ${data.repos.length} repositories`);
                this.displayProjects(data.repos);
            } else {
                console.error('API returned error:', data);
                this.showProjectError(data.error || 'Failed to load projects from GitHub');
            }
        } catch (error) {
            console.error('Error loading GitHub projects:', error);
            this.showProjectError('Unable to connect to GitHub API: ' + error.message);
        } finally {
            if (loadingElement) {
                loadingElement.remove();
            }
        }
    }

    displayProjects(repos) {
        const projectsGrid = document.getElementById('projects-grid');
        console.log('Displaying projects:', repos);
        
        if (!repos || repos.length === 0) {
            this.showProjectError('No repositories found');
            return;
        }
        
        const projectsHTML = repos.map(repo => this.createProjectCard(repo)).join('');
        projectsGrid.innerHTML = projectsHTML;

        // Re-run scroll animations on the new elements
        if (this.scrollObserver) {
            projectsGrid.querySelectorAll('.scroll-animate').forEach(el => {
                this.scrollObserver.observe(el);
            });
        }
    }

    /**
     * UPDATED to match the new comic-panel style
     */
    createProjectCard(repo) {
        const languageColors = {
            'JavaScript': '#f7df1e',
            'Python': '#3776ab',
            'Java': '#ed8b00',
            'TypeScript': '#3178c6',
            'HTML': '#e34c26',
            'CSS': '#1572b6',
            'Vue': '#4fc08d',
            'React': '#61dafb',
            'PHP': '#777bb4',
            'C++': '#00599c',
            'C': '#a8b9cc',
            'Go': '#00add8',
            'Rust': '#000000',
            'Swift': '#fa7343',
            'Kotlin': '#7f52ff'
        };

        const language = repo.language || 'Other';
        const languageColor = languageColors[language] || '#6b7280';
        
        const status = repo.status || 'completed'; // Assuming your API provides this
        const statusIcon = status === 'completed' ? 'fas fa-check-circle' : 'fas fa-clock';
        const statusColor = status === 'completed' ? '#10b981' : '#f59e0b';
        const statusText = status === 'completed' ? 'Completed' : 'Under Dev';

        // Add random rotation like in the template
        const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];

        return `
            <div class="comic-panel p-6 transform ${rotation} scroll-animate">
                <h3 class="text-3xl mb-2">${repo.name}</h3>
                <p class="mb-4">${repo.description || 'No description available.'}</p>
                <div class="project-tech mb-4 flex flex-wrap gap-2">
                    <span class="tech-tag" style="border-color:${languageColor}; color:${languageColor};">
                        ${language}
                    </span>
                    ${repo.topics.slice(0, 2).map(topic => 
                        `<span class="tech-tag" style="border-color:#6b7280; color:#6b7280;">${topic}</span>`
                    ).join('')}
                </div>
                <a href="${repo.html_url}" target="_blank" class="action-button action-button-blue">Source Code</a>
                <span class="project-status ml-4" style="color:${statusColor}; font-family: 'Bangers', cursive; font-size: 1.25rem; letter-spacing: 0.05em;">
                    <i class="${statusIcon}"></i> ${statusText}
                </span>
            </div>
        `;
    }

    /**
     * UPDATED to match the new comic-panel style
     */
    showProjectError(message) {
        const projectsGrid = document.getElementById('projects-grid');
        console.log('Showing project error:', message);
        projectsGrid.innerHTML = `
            <div class="comic-panel p-8 text-black text-center" style="grid-column: 1 / -1; transform: rotate(-1deg);">
                <h3 class="text-4xl mb-4 text-red-500">WHOOPS!</h3>
                <p class="text-lg mb-6">Unable to Load Missions: ${message}</p>
                <a href="https://github.com/jatinnirwann" target="_blank" class="action-button">
                    Visit GitHub Profile
                </a>
            </div>
        `;
    }

    setupAutoRefresh() {
        const TWO_HOURS = 2 * 60 * 60 * 1000;
        
        setInterval(async () => {
            console.log('Auto-refreshing repositories...');
            await this.autoRefreshRepositories();
        }, TWO_HOURS);
        
        console.log('Auto-refresh setup complete - will refresh every 2 hours');
    }

    async autoRefreshRepositories() {
        try {
            console.log('Auto-refresh: Calling refresh API...');
            const response = await fetch('/api/refresh-repos', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Auto-refresh response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Auto-refresh API Response:', data);
            
            if (data.success && data.repos) {
                console.log(`Auto-refreshed ${data.repos.length} repositories`);
                this.displayProjects(data.repos);
            } else {
                console.error('Auto-refresh API returned error:', data);
            }
            
        } catch (error) {
            console.error('Error during auto-refresh:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio app...');
    window.portfolioApp = new PortfolioApp();
});

window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log('Portfolio script loaded successfully');