class ResourcesManager {
    constructor() {
        this.content = this.loadContent();
        this.init();
    }

    init() {
        this.renderContent();
    }

    loadContent() {
        return {
            featured: [
                {
                    id: 'f1',
                    title: 'Launching the Ngao Labs Incubation Programme',
                    description: 'We are proud to announce the next phase for our top-performing graduates. The Incubation Programme provides dedicated support, mentorship, and resources to turn capstone projects into market-ready solutions.',
                    imageData: null,
                    imageUrl: 'images/incubation.webp',
                    linkUrl: 'blog/incubation-programme.html',
                    category: 'Announcement',
                    date: '2025-11-25',
                    type: 'featured'
                }
            ],
            news: [
                {
                    id: 'n1',
                    title: 'Cohort 1 Enters Final Capstone Week',
                    description: 'After 9 weeks of intensive training, our 15 active learners are now building their final end-to-end AI solutions. Presentations are scheduled for Dec 5th.',
                    imageData: null,
                    imageUrl: 'images/cohort1.webp',
                    linkUrl: 'blog/cohort-1-capstone.html',
                    category: 'Community',
                    date: '2025-12-01',
                    type: 'news'
                },
                {
                    id: 'n2',
                    title: 'Keynote: From Data to Impact',
                    description: 'Ngao Labs Founder Oyori Obegi recently addressed university students on how analytics powers intelligent systems and shapes the future of work.',
                    imageData: null,
                    imageUrl: 'images/oyori-keynote-wide.webp',
                    linkUrl: 'blog/keynote-data-impact.html',
                    category: 'Thought Leadership',
                    date: '2025-10-29',
                    type: 'news'
                }
            ],
            resources: [
                {
                    id: 'r1',
                    title: 'Tackling Real-World Challenges with Zindi',
                    description: 'How our learners use competitive platforms to sharpen their predictive modeling skills.',
                    imageData: null,
                    imageUrl: 'images/zindi-challenge.webp',
                    linkUrl: 'blog/zindi-challenges.html',
                    category: 'Machine Learning',
                    date: '2025-11-20',
                    type: 'resource'
                },
                {
                    id: 'r2',
                    title: 'Communicating Insights',
                    description: 'Best practices for dashboarding and storytelling with data, a core focus of Week 3.',
                    imageData: null,
                    imageUrl: 'images/communicating.webp',
                    linkUrl: 'blog/data-visualization.html',
                    category: 'Visualization',
                    date: '2025-11-15',
                    type: 'resource'
                },
                {
                    id: 'r3',
                    title: 'AI Safety & Ethics',
                    description: 'Why we prioritize responsible AI and bias reduction in every model we build.',
                    imageData: null,
                    imageUrl: 'images/AI-ethics.webp',
                    linkUrl: 'blog/ai-ethics.html',
                    category: 'Ethics',
                    date: '2025-11-10',
                    type: 'resource'
                }
            ]
        };
    }

    renderContent() {
        this.renderSection('featuredGrid', this.content.featured || []);
        this.renderSection('newsGrid', this.content.news || []);
        this.renderSection('resourcesGrid', this.content.resources || []);
    }

    renderSection(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No content yet</h3>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => this.createCard(item)).join('');
    }

    createCard(item) {
        let imageHtml = '';
        
        if (item.imageData) {
            imageHtml = `<img src="${item.imageData}" alt="${item.title}" onerror="this.style.display='none'">`;
        } else if (item.imageUrl) {
            imageHtml = `<img src="${item.imageUrl}" alt="${item.title}" onerror="this.style.display='none'">`;
        } else {
            imageHtml = `<i class="fas fa-chart-line"></i>`;
        }

        if (item.type === 'featured') {
            return `
                <div class="featured-card">
                    <div class="featured-image">
                        ${imageHtml}
                    </div>
                    <div class="featured-content">
                        <span class="resource-category">${item.category}</span>
                        <h3 class="resource-title">${item.title}</h3>
                        <p class="resource-description">${item.description}</p>
                        <div class="resource-footer">
                            <span class="resource-date">${this.formatDate(item.date)}</span>
                            <a href="${item.linkUrl}" class="read-more">
                                Read Full Story <i class="fas fa-arrow-left"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="resource-card">
                <div class="resource-image">
                    ${imageHtml}
                </div>
                <div class="resource-content">
                    <span class="resource-category">${item.category}</span>
                    <h3 class="resource-title">${item.title}</h3>
                    <p class="resource-description">${item.description}</p>
                    <div class="resource-footer">
                        <span class="resource-date">${this.formatDate(item.date)}</span>
                        <a href="${item.linkUrl}" class="read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.resourcesManager = new ResourcesManager();
});
