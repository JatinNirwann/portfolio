class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Portfolio app initializing...');
        this.setupEventListeners();
        this.initNavbar();
        this.initSmoothScrolling();
        this.loadGitHubProjects();
    }

    setupEventListeners() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProjects(e.target.dataset.filter);
            });
        });

        const refreshButton = document.getElementById('refresh-repos-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshRepositories();
            });
        }

        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    initNavbar() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Highlight active section in navbar
        window.addEventListener('scroll', () => {
            let current = '';
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

        // Add fade-in animation
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }, 100);
    }

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
            'Go': '#00add8',
            'Rust': '#000000',
            'Swift': '#fa7343',
            'Kotlin': '#7f52ff'
        };

        const languageColor = languageColors[repo.language] || '#6b7280';
        const status = repo.status || 'completed';
        const statusIcon = status === 'completed' ? 'fas fa-check-circle' : 'fas fa-clock';
        const statusColor = status === 'completed' ? '#10b981' : '#f59e0b';
        const category = this.categorizeProject(repo.language, repo.topics);

        return `
            <div class="project-card" data-category="${category}">
                <div class="project-header">
                    <h3 class="project-title">${repo.name}</h3>
                    <div class="project-stats">
                        <span title="Stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span title="Forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                </div>
                <p class="project-description">${repo.description}</p>
                <div class="project-tech">
                    <span class="tech-tag" style="border-color: ${languageColor}; color: ${languageColor}">
                        ${repo.language}
                    </span>
                    ${repo.topics.slice(0, 3).map(topic => 
                        `<span class="tech-tag">${topic}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                        <span>View Code</span>
                    </a>
                    <span class="project-status" style="color: ${statusColor}">
                        <i class="${statusIcon}"></i>
                        ${status === 'completed' ? 'Completed' : 'Under Dev'}
                    </span>
                </div>
            </div>
        `;
    }

    categorizeProject(language, topics) {
        const webTechnologies = ['javascript', 'typescript', 'html', 'css', 'react', 'vue', 'angular', 'web', 'frontend', 'backend'];
        const mobileTechnologies = ['react-native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'mobile'];
        const aiTechnologies = ['python', 'machine-learning', 'ai', 'tensorflow', 'pytorch', 'data-science', 'ml'];

        const allTech = [language?.toLowerCase(), ...topics.map(t => t.toLowerCase())].filter(Boolean);

        if (allTech.some(tech => aiTechnologies.includes(tech))) return 'ai';
        if (allTech.some(tech => mobileTechnologies.includes(tech))) return 'mobile';
        if (allTech.some(tech => webTechnologies.includes(tech))) return 'web';
        
        return 'other';
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('fade-in'), 50);
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    }

    showProjectError(message) {
        const projectsGrid = document.getElementById('projects-grid');
        console.log('Showing project error:', message);
        projectsGrid.innerHTML = `
            <div class="project-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to Load Projects</h3>
                <p>${message}</p>
                <a href="https://github.com/jatinnirwann" target="_blank" class="btn btn-primary">
                    <i class="fab fa-github"></i>
                    Visit GitHub Profile
                </a>
            </div>
        `;
    }

    async refreshRepositories() {
        const refreshButton = document.getElementById('refresh-repos-btn');
        const originalContent = refreshButton.innerHTML;
        
        console.log('Refreshing repositories from GitHub...');
        
        // Update button to show loading state
        refreshButton.disabled = true;
        refreshButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Refreshing...</span>
        `;
        
        try {
            console.log('Calling refresh API...');
            const response = await fetch('/api/refresh-repos', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Refresh response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Refresh API Response:', data);
            
            if (data.success && data.repos) {
                console.log(`Refreshed ${data.repos.length} repositories`);
                this.displayProjects(data.repos);
                
                // Show success message temporarily
                refreshButton.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Updated!</span>
                `;
                
                setTimeout(() => {
                    refreshButton.innerHTML = originalContent;
                    refreshButton.disabled = false;
                }, 2000);
                
            } else {
                console.error('Refresh API returned error:', data);
                throw new Error(data.error || 'Failed to refresh repositories');
            }
            
        } catch (error) {
            console.error('Error refreshing repositories:', error);
            
            // Show error state
            refreshButton.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Error!</span>
            `;
            
            setTimeout(() => {
                refreshButton.innerHTML = originalContent;
                refreshButton.disabled = false;
            }, 3000);
            
            this.showProjectError('Failed to refresh repositories: ' + error.message);
        }
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        const scrollY = window.scrollY;
        
        // Add scrolled class to navbar
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleResize() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (window.innerWidth > 768) {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }

    async testAPI() {
        console.log('Testing API manually...');
        try {
            const response = await fetch('/api/github-repos');
            const data = await response.json();
            console.log('Manual API test result:', data);
            return data;
        } catch (error) {
            console.error('Manual API test failed:', error);
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio app...');
    window.portfolioApp = new PortfolioApp();
    
    window.testAPI = () => window.portfolioApp.testAPI();
    window.reloadProjects = () => window.portfolioApp.loadGitHubProjects();
});

window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log('Portfolio script loaded successfully');