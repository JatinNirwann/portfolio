class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Portfolio app initializing...');
        this.setupEventListeners();
        this.initNavbar();
        this.initSmoothScrolling();
        this.initThemeToggle();
        this.initInteractiveIllustrations();
        this.loadGitHubProjects();
        this.setupAutoRefresh();
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

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        const scrollArrow = document.querySelector('.scroll-arrow');
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                document.getElementById('about').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }

        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    initNavbar() {
        const navLinks = document.querySelectorAll('.nav-link');
        
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

        return `
            <div class="project-card">
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

    initThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`Theme switched to: ${theme}`);
    }

    initInteractiveIllustrations() {
        const heroSection = document.querySelector('.hero');
        const floatingIcons = document.querySelectorAll('.floating-icon');
        const mouseFollower = document.getElementById('mouseFollower');
        const mouseTrails = [
            document.getElementById('mouseTrail1'),
            document.getElementById('mouseTrail2'),
            document.getElementById('mouseTrail3')
        ];

        if (!heroSection || !mouseFollower) return;

        let mouseX = 0;
        let mouseY = 0;
        let trailPositions = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            mouseFollower.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;

            floatingIcons.forEach(icon => {
                const iconRect = icon.getBoundingClientRect();
                const heroRect = heroSection.getBoundingClientRect();
                const iconX = iconRect.left - heroRect.left + iconRect.width / 2;
                const iconY = iconRect.top - heroRect.top + iconRect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(mouseX - iconX, 2) + Math.pow(mouseY - iconY, 2)
                );

                if (distance < 150) {
                    icon.classList.add('mouse-nearby');
                    const repelX = (mouseX - iconX) * -0.3;
                    const repelY = (mouseY - iconY) * -0.3;
                    icon.style.transform = `translate(${repelX}px, ${repelY}px) scale(1.1)`;
                } else {
                    icon.classList.remove('mouse-nearby');
                    icon.style.transform = '';
                }
            });
        });

        const animateTrails = () => {
            trailPositions[0].x += (mouseX - trailPositions[0].x) * 0.2;
            trailPositions[0].y += (mouseY - trailPositions[0].y) * 0.2;
            
            trailPositions[1].x += (trailPositions[0].x - trailPositions[1].x) * 0.15;
            trailPositions[1].y += (trailPositions[0].y - trailPositions[1].y) * 0.15;
            
            trailPositions[2].x += (trailPositions[1].x - trailPositions[2].x) * 0.1;
            trailPositions[2].y += (trailPositions[1].y - trailPositions[2].y) * 0.1;

            mouseTrails.forEach((trail, index) => {
                if (trail) {
                    trail.style.transform = `translate(${trailPositions[index].x - 4}px, ${trailPositions[index].y - 4}px)`;
                }
            });

            requestAnimationFrame(animateTrails);
        };

        animateTrails();

        heroSection.addEventListener('mouseleave', () => {
            mouseFollower.style.opacity = '0';
            mouseTrails.forEach(trail => {
                if (trail) trail.style.opacity = '0';
            });
            floatingIcons.forEach(icon => {
                icon.classList.remove('mouse-nearby');
                icon.style.transform = '';
            });
        });

        heroSection.addEventListener('mouseenter', () => {
            mouseFollower.style.opacity = '0.15';
            mouseTrails.forEach(trail => {
                if (trail) trail.style.opacity = '0.1';
            });
        });
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