// Blog interactions: filters, search, load more, dynamic fetch

document.addEventListener('DOMContentLoaded', function() {
	initDynamicBlog().then(() => {
		initCategoryFilters();
		initSearch();
		initLoadMore();
	});
});

async function initDynamicBlog() {
	const grid = document.getElementById('articlesGrid');
	if (!grid) return;

	try {
		const res = await fetch('/data/blog.json', { headers: { 'Accept': 'application/json' } });
		if (!res.ok) return;
		const posts = await res.json();
		if (!Array.isArray(posts) || posts.length === 0) return;

		// Clear existing cards and render from JSON
		grid.innerHTML = '';
		posts.forEach(post => grid.appendChild(createArticleCard(post)));
	} catch (e) {
		console.warn('Blog JSON load failed, using static markup.', e.message);
	}
}

function createArticleCard(post) {
	const article = document.createElement('article');
	article.className = 'article-card';
	article.dataset.category = post.category || 'community';
	article.innerHTML = `
		<div class="article-image">
			<img src="${post.image}" alt="${escapeHtml(post.title)}">
		</div>
		<div class="article-content">
			<div class="article-meta">
				<span class="category ${post.category}">${formatCategory(post.category)}</span>
				<span class="date">${formatDate(post.date)}</span>
			</div>
			<h3>${escapeHtml(post.title)}</h3>
			<p>${escapeHtml(post.excerpt)}</p>
			<div class="article-author">
				<h4>${escapeHtml(post.author)}</h4>
				<p>${escapeHtml(post.role || '')}</p>
			</div>
			<a href="${post.url || '#'}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
		</div>
	`;
	return article;
}

function escapeHtml(str = '') {
	return str.replace(/[&<>"]+/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}

function formatCategory(key = '') {
	return key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(iso = '') {
	try {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
	} catch {
		return iso;
	}
}

function initCategoryFilters() {
	const buttons = document.querySelectorAll('.category-btn');
	const cards = document.querySelectorAll('.article-card');

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			buttons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const category = btn.dataset.category;
			cards.forEach(card => {
				const match = category === 'all' || card.dataset.category === category;
				card.style.display = match ? '' : 'none';
			});
		});
	});
}

function initSearch() {
	const input = document.getElementById('searchInput');
	const btn = document.getElementById('searchBtn');
	const cards = () => document.querySelectorAll('.article-card');
	const featured = document.querySelector('.featured-article');

	function clearHighlights(root) {
		root.querySelectorAll('.search-highlight').forEach(el => {
			el.replaceWith(document.createTextNode(el.textContent));
		});
	}

	function highlightMatches(element, query) {
		if (!query) return;
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
		const texts = [];
		while (walker.nextNode()) texts.push(walker.currentNode);
		texts.forEach(node => {
			const idx = node.nodeValue.toLowerCase().indexOf(query.toLowerCase());
			if (idx >= 0) {
				const span = document.createElement('span');
				span.className = 'search-highlight';
				const before = node.nodeValue.slice(0, idx);
				const match = node.nodeValue.slice(idx, idx + query.length);
				const after = node.nodeValue.slice(idx + query.length);
				const frag = document.createDocumentFragment();
				if (before) frag.appendChild(document.createTextNode(before));
				span.textContent = match;
				frag.appendChild(span);
				if (after) frag.appendChild(document.createTextNode(after));
				node.parentNode.replaceChild(frag, node);
			}
		});
	}

	function runSearch() {
		const q = input.value.trim().toLowerCase();
		let anyVisible = false;

		// Featured article
		if (featured) {
			clearHighlights(featured);
			const text = featured.textContent.toLowerCase();
			featured.style.display = !q || text.includes(q) ? '' : 'none';
			if (featured.style.display !== 'none') anyVisible = true;
			if (q) highlightMatches(featured, q);
		}

		// Cards
		cards().forEach(card => {
			clearHighlights(card);
			const text = card.textContent.toLowerCase();
			const visible = !q || text.includes(q);
			card.style.display = visible ? '' : 'none';
			if (visible) anyVisible = true;
			if (q) highlightMatches(card, q);
		});

		// No results
		let empty = document.getElementById('noResults');
		if (!empty) {
			empty = document.createElement('div');
			empty.id = 'noResults';
			empty.className = 'no-results';
			empty.innerHTML = '<i class="fas fa-search"></i><h3>No results</h3><p>Try a different keyword or category.</p>';
			const grid = document.getElementById('articlesGrid');
			if (grid && grid.parentNode) grid.parentNode.appendChild(empty);
		}
		empty.style.display = anyVisible ? 'none' : 'block';
	}

	if (input && btn) {
		btn.addEventListener('click', runSearch);
		input.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') runSearch();
			if (!input.value) runSearch();
		});
	}
}

function initLoadMore() {
	const grid = document.getElementById('articlesGrid');
	const btn = document.getElementById('loadMoreBtn');
	if (!grid || !btn) return;

	const allCards = () => Array.from(grid.querySelectorAll('.article-card'));
	let visibleCount = 4;

	function updateVisibility() {
		allCards().forEach((card, idx) => {
			card.style.display = idx < visibleCount ? '' : 'none';
		});
		btn.style.display = visibleCount >= allCards().length ? 'none' : 'inline-flex';
	}

	btn.addEventListener('click', () => {
		visibleCount += 4;
		updateVisibility();
	});

	updateVisibility();
}
