const NGAO_APP_VERSION = '2025-08-26-1';
(function() {
    try {
        const prev = localStorage.getItem('ngao_app_version');
        if (prev !== NGAO_APP_VERSION) {
            sessionStorage.removeItem('ngaoAdmin');
            localStorage.setItem('ngao_app_version', NGAO_APP_VERSION);
        }
    } catch (e) {}
})();

class SecureResourcesManager {
    constructor() {
        this.content = this.loadContent();
        this.isAuthenticated = false;
        
        this.x7k9m2p = 'Y19YQVhAaHF3US1PJGpw';
        this.qwerty123 = 'c_XAX@hqwQ-O$jp';
        this.userToken = 'ngao2024';
        this.sessionKey = 'admin123';
        
        this.config = { debug: false, version: '1.0.0', apiKey: 'prod_key_456' };
        this.cache = { data: null, timestamp: Date.now() };
        this.settings = { theme: 'dark', language: 'en' };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderContent();
        this.updateStats();
        this.checkSecretAccess();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateUser();
        });

        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });

        const closeAdmin = document.getElementById('closeAdmin');
        closeAdmin.addEventListener('click', () => {
            this.hideAdminModal();
        });

        const adminModal = document.getElementById('adminModal');
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                this.hideAdminModal();
            }
        });

        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}Tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        const addContentForm = document.getElementById('addContentForm');
        addContentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addContent();
        });

        this.setupImageUpload();

        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => this.importData());
        document.getElementById('backupData').addEventListener('click', () => this.backupData());
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const fileInput = document.getElementById('imageUpload');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const removeBtn = document.getElementById('removeImage');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageFile(file);
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#1E40AF';
            uploadArea.style.background = 'rgba(30, 58, 138, 0.1)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 0, 0, 0.2)';
            uploadArea.style.background = '#f8fafc';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 0, 0, 0.2)';
            uploadArea.style.background = 'var(--bg-light)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageFile(file);
            }
        });

        removeBtn.addEventListener('click', () => {
            this.removeImage();
        });
    }

    handleImageFile(file) {
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('Image file too large. Please use files under 2MB.', 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file.', 'error');
            return;
        }

        this.currentImageFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            previewImg.src = e.target.result;
            
            document.getElementById('imageUploadArea').style.display = 'none';
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    removeImage() {
        this.currentImageFile = null;
        document.getElementById('imageUploadArea').style.display = 'block';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('imageUpload').value = '';
    }

    checkSecretAccess() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.showHiddenAdminAccess();
            }
        });
    }

    showHiddenAdminAccess() {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'tempAdminBtn';
        adminBtn.className = 'btn btn-primary';
        adminBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px 20px;
            border-radius: 25px;
            background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
            transition: all 0.3s ease;
        `;
        adminBtn.innerHTML = '<i class="fas fa-cog"></i> Admin Panel';
        
        adminBtn.addEventListener('click', () => {
            this.showAdminModal();
            document.body.removeChild(adminBtn);
        });
        
        adminBtn.addEventListener('mouseenter', () => {
            adminBtn.style.transform = 'scale(1.05)';
            adminBtn.style.boxShadow = '0 8px 25px rgba(30, 58, 138, 0.4)';
        });
        
        adminBtn.addEventListener('mouseleave', () => {
            adminBtn.style.transform = 'scale(1)';
            adminBtn.style.boxShadow = '0 4px 15px rgba(30, 58, 138, 0.3)';
        });
        
        document.body.appendChild(adminBtn);
        
        setTimeout(() => {
            if (adminBtn.parentNode) {
                adminBtn.parentNode.removeChild(adminBtn);
            }
        }, 10000);
        
        this.showNotification('Admin access activated! Admin button will disappear in 10 seconds.', 'success');
    }

    validateUser() {
        const inputValue = document.getElementById('adminPassword').value;
        
        const decodedPassword = atob(this.x7k9m2p);
        
        if (inputValue === decodedPassword) {
            this.isAuthenticated = true;
            this.showAdminPanel();
            this.showNotification('Welcome! You now have admin access.', 'success');
            
            sessionStorage.setItem('ngaoAdmin', 'true');
        } else {
            this.showNotification('Incorrect password. Please try again.', 'error');
            document.getElementById('adminPassword').value = '';
        }
    }

    showAdminPanel() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    }

    hideAdminModal() {
        document.getElementById('adminModal').classList.remove('active');
        if (!this.isAuthenticated) {
            document.getElementById('adminLogin').style.display = 'block';
            document.getElementById('adminPanel').style.display = 'none';
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentImageFile = null;
        sessionStorage.removeItem('ngaoAdmin');
        
        document.getElementById('addContentForm').reset();
        this.removeImage();
        
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        
        this.showNotification('You have been logged out.', 'info');
    }

    showAdminModal() {
        if (sessionStorage.getItem('ngaoAdmin') === 'true') {
            this.isAuthenticated = true;
            this.showAdminPanel();
        }
        
        document.getElementById('adminModal').classList.add('active');
    }

    loadContent() {
        const saved = localStorage.getItem('ngaoResources');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            featured: [
                {
                    id: 'f1',
                    title: 'Launching the Ngao Labs Incubation Programme',
                    description: 'We are proud to announce the next phase for our top-performing graduates. The Incubation Programme provides dedicated support, mentorship, and resources to turn capstone projects into market-ready solutions.',
                    imageData: null,
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
                    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
                    imageUrl: 'images/oyoriobegi_keynote_wide.jpg',
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
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    linkUrl: 'blog/ai-ethics.html',
                    category: 'Ethics',
                    date: '2025-11-10',
                    type: 'resource'
                }
            ]
        };
    }

    saveContent() {
        localStorage.setItem('ngaoResources', JSON.stringify(this.content));
    }

    async addContent() {
        const form = document.getElementById('addContentForm');
        const formData = new FormData(form);
        
        let imageData = null;
        let imageUrl = null;

        if (this.currentImageFile) {
            try {
                imageData = await this.convertImageToBase64(this.currentImageFile);
                imageUrl = null;
            } catch (error) {
                this.showNotification('Error processing image. Please try again.', 'error');
                return;
            }
        }
        
        const newContent = {
            id: Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            imageData: imageData,
            imageUrl: imageUrl,
            linkUrl: formData.get('linkUrl') || '#',
            category: formData.get('category') || 'General',
            date: new Date().toISOString().split('T')[0],
            type: formData.get('contentType')
        };

        if (!this.content[newContent.type]) {
            this.content[newContent.type] = [];
        }

        this.content[newContent.type].unshift(newContent);
        this.saveContent();
        this.renderContent();
        this.updateStats();
        this.updateContentList();
        
        form.reset();
        this.removeImage();
        
        this.showNotification('Content added successfully!', 'success');
    }

    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    deleteContent(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            Object.keys(this.content).forEach(type => {
                this.content[type] = this.content[type].filter(item => item.id !== id);
            });
            this.saveContent();
            this.renderContent();
            this.updateStats();
            this.updateContentList();
            this.showNotification('Content deleted successfully!', 'success');
        }
    }

    editContent(id) {
        let contentItem = null;
        let contentType = null;
        
        Object.keys(this.content).forEach(type => {
            const found = this.content[type].find(item => item.id === id);
            if (found) {
                contentItem = found;
                contentType = type;
            }
        });

        if (contentItem) {
            document.getElementById('contentType').value = contentType;
            document.getElementById('title').value = contentItem.title;
            document.getElementById('description').value = contentItem.description;
            document.getElementById('linkUrl').value = contentItem.linkUrl || '';
            document.getElementById('category').value = contentItem.category || '';
            
            if (contentItem.imageData) {
                document.getElementById('previewImg').src = contentItem.imageData;
                document.getElementById('imageUploadArea').style.display = 'none';
                document.getElementById('imagePreview').style.display = 'block';
                this.currentImageFile = null;
            } else if (contentItem.imageUrl) {
                document.getElementById('previewImg').src = contentItem.imageUrl;
                document.getElementById('imageUploadArea').style.display = 'none';
                document.getElementById('imagePreview').style.display = 'block';
                this.currentImageFile = null;
            } else {
                this.removeImage();
            }
            
            document.querySelector('[data-tab="add"]').click();
            
            const form = document.getElementById('addContentForm');
            const originalSubmit = form.onsubmit;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updateContent(id, contentType);
                form.onsubmit = originalSubmit;
            };
        }
    }

    async updateContent(id, originalType) {
        const form = document.getElementById('addContentForm');
        const formData = new FormData(form);
        
        let imageData = null;
        let imageUrl = null;

        if (this.currentImageFile) {
            try {
                imageData = await this.convertImageToBase64(this.currentImageFile);
                imageUrl = null;
            } catch (error) {
                this.showNotification('Error processing image. Please try again.', 'error');
                return;
            }
        } else {
            const previewImg = document.getElementById('previewImg');
            if (previewImg.src && previewImg.src !== '') {
                if (previewImg.src.startsWith('data:')) {
                    imageData = previewImg.src;
                    imageUrl = null;
                } else {
                    imageData = null;
                    imageUrl = previewImg.src;
                }
            }
        }
        
        const updatedContent = {
            id: id,
            title: formData.get('title'),
            description: formData.get('description'),
            imageData: imageData,
            imageUrl: imageUrl,
            linkUrl: formData.get('linkUrl') || '#',
            category: formData.get('category') || 'General',
            date: new Date().toISOString().split('T')[0],
            type: formData.get('contentType')
        };

        Object.keys(this.content).forEach(type => {
            this.content[type] = this.content[type].filter(item => item.id !== id);
        });

        if (!this.content[updatedContent.type]) {
            this.content[updatedContent.type] = [];
        }
        this.content[updatedContent.type].unshift(updatedContent);
        
        this.saveContent();
        this.renderContent();
        this.updateStats();
        this.updateContentList();
        
        form.reset();
        this.removeImage();
        this.showNotification('Content updated successfully!', 'success');
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
                    <p>Add some content using the admin panel to get started.</p>
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

        return `
            <div class="content-card">
                <div class="card-image">
                    ${imageHtml}
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span class="card-category">${item.category}</span>
                        <span class="card-date">${this.formatDate(item.date)}</span>
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                    <a href="${item.linkUrl}" class="card-link" target="_blank">
                        Learn More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    updateContentList() {
        const container = document.getElementById('contentList');
        if (!container) return;

        const allContent = [
            ...(this.content.featured || []),
            ...(this.content.news || []),
            ...(this.content.resources || [])
        ];

        if (allContent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No content available</h3>
                    <p>Add some content to get started.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = allContent.map(item => `
            <div class="content-item">
                <div class="content-info">
                    <h4>${item.title}</h4>
                    <p>${item.type} • ${item.category} • ${this.formatDate(item.date)}</p>
                </div>
                <div class="content-actions">
                    <button class="action-btn edit" onclick="resourcesManager.editContent('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="resourcesManager.deleteContent('${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const totalContent = (this.content.featured?.length || 0) + 
                           (this.content.news?.length || 0) + 
                           (this.content.resources?.length || 0);

        document.getElementById('totalContent').textContent = totalContent;
        document.getElementById('featuredCount').textContent = this.content.featured?.length || 0;
        document.getElementById('newsCount').textContent = this.content.news?.length || 0;
        document.getElementById('resourcesCount').textContent = this.content.resources?.length || 0;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    exportData() {
        const dataStr = JSON.stringify(this.content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ngao-resources-backup.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.content = importedData;
                        this.saveContent();
                        this.renderContent();
                        this.updateStats();
                        this.updateContentList();
                        this.showNotification('Data imported successfully!', 'success');
                    } catch (error) {
                        this.showNotification('Error importing data. Please check file format.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    backupData() {
        this.exportData();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.resourcesManager = new SecureResourcesManager();
});


