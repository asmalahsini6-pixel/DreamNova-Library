/**
 * DreamNova Library - Logic Controller
 * Features: Dark Mode, Filtering, Search, LocalStorage Favorites, Modal
 */

// --- Book Data (Simulated Database) ---
const books = [
    { id: 1, title: "The Silent Galaxy", author: "Aria Sterling", category: "Sci-Fi", rating: 4.8, img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80", desc: "A journey through the quietest corners of the universe where sound is currency." },
    { id: 2, title: "Garden of Echoes", author: "Silas Thorne", category: "Fantasy", rating: 4.9, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80", desc: "Every plant in this garden tells a story. Some are better left unheard." },
    { id: 3, title: "Logic of the Soul", author: "Dr. Julian Vane", category: "Philosophy", rating: 4.7, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80", desc: "An exploration into the intersection of machine intelligence and human consciousness." },
    { id: 4, title: "The Midnight Cipher", author: "Clara Oswald", category: "Mystery", rating: 4.5, img: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=400&q=80", desc: "A detective discovers a code written in the stars that predicts the future." },
    { id: 5, title: "Neon Embers", author: "Jaxson Reed", category: "Sci-Fi", rating: 4.6, img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=80", desc: "In a world made of glass, fire is the ultimate rebellion." },
    { id: 6, title: "Aesthetica", author: "Luna Lovegood", category: "Fantasy", rating: 4.9, img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80", desc: "The magic of art comes to life in this visually stunning digital volume." }
];

// --- Selectors ---
const bookGrid = document.getElementById('book-grid');
const searchInput = document.getElementById('book-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const html = document.documentElement;
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.getElementById('back-to-top');
const modal = document.getElementById('book-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const trendingSlider = document.getElementById('trending-slider');
const favCountSpan = document.getElementById('fav-count');

// State
let favorites = JSON.parse(localStorage.getItem('dreamnova_favs')) || [];

// --- Initialize Website ---
window.addEventListener('load', () => {
    // Hide Loader
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1500);

    renderBooks(books);
    renderTrending();
    updateFavCount();
    checkTheme();
    animateStats();
});

// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('dreamnova_theme', newTheme);
});

function checkTheme() {
    const savedTheme = localStorage.getItem('dreamnova_theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// --- Render Books ---
function renderBooks(data) {
    bookGrid.innerHTML = data.map(book => `
        <div class="book-card" data-aos="fade-up">
            <div class="book-img" onclick="openBook(${book.id})">
                <img src="${book.img}" alt="${book.title}">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                <div class="book-meta">
                    <span class="rating"><i class="fas fa-star"></i> ${book.rating}</span>
                    <i class="fa-heart ${favorites.includes(book.id) ? 'fas active' : 'far'} fav-icon" 
                       onclick="toggleFavorite(${book.id}, this)"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Search & Filter ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = books.filter(b => 
        b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
    renderBooks(filtered);
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        const filtered = cat === 'all' ? books : books.filter(b => b.category === cat);
        renderBooks(filtered);
    });
});

// --- Favorites System ---
function toggleFavorite(id, el) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        el.classList.replace('fas', 'far');
        el.classList.remove('active');
    } else {
        favorites.push(id);
        el.classList.replace('far', 'fas');
        el.classList.add('active');
    }
    localStorage.setItem('dreamnova_favs', JSON.stringify(favorites));
    updateFavCount();
}

function updateFavCount() {
    favCountSpan.innerText = favorites.length;
}

// --- Modal Logic ---
function openBook(id) {
    const book = books.find(b => b.id === id);
    modalBody.innerHTML = `
        <div class="modal-inner">
            <img src="${book.img}" alt="${book.title}" style="border-radius:10px; width:100%;">
            <div>
                <h2 style="font-size:2.5rem; margin-bottom:10px;">${book.title}</h2>
                <p style="color:var(--primary); font-weight:600; margin-bottom:20px;">${book.author} | ${book.category}</p>
                <p style="font-size:1.1rem; line-height:1.8; margin-bottom:30px;">${book.desc}</p>
                <button class="btn btn-primary">Read Now</button>
            </div>
        </div>
    `;
    modal.style.display = "block";
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; }

// --- Trending Slider ---
function renderTrending() {
    trendingSlider.innerHTML = books.map(book => `
        <div class="book-card" style="min-width: 250px;">
            <div class="book-img"><img src="${book.img}"></div>
            <h3>${book.title}</h3>
        </div>
    `).join('');
}

const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

nextBtn.onclick = () => trendingSlider.scrollLeft += 300;
prevBtn.onclick = () => trendingSlider.scrollLeft -= 300;

// --- Navbar & Scroll Effects ---
window.onscroll = () => {
    if (window.scrollY > 50) {
        document.getElementById('navbar').classList.add('sticky');
        backToTop.style.display = "block";
    } else {
        document.getElementById('navbar').classList.remove('sticky');
        backToTop.style.display = "none";
    }
};

backToTop.onclick = () => window.scrollTo(0, 0);

// --- Mobile Nav ---
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// --- Stats Animation ---
function animateStats() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const speed = 200;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });
}