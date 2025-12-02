// Legal Page Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Smooth scroll to top when switching tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-btn.active');
            const prevTab = activeTab.previousElementSibling;
            if (prevTab && prevTab.classList.contains('tab-btn')) {
                prevTab.click();
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-btn.active');
            const nextTab = activeTab.nextElementSibling;
            if (nextTab && nextTab.classList.contains('tab-btn')) {
                nextTab.click();
            }
        }
    });

    // Add print functionality
    const printBtn = document.createElement('button');
    printBtn.textContent = 'Print Page';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printBtn);

    // Hide print button on mobile
    function handleResize() {
        if (window.innerWidth <= 768) {
            printBtn.style.display = 'none';
        } else {
            printBtn.style.display = 'block';
        }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
});
