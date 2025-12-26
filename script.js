// DOM Elements
const navbar = document.querySelector('#navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');

// Event Listeners
window.addEventListener('scroll', handleScroll);
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

// Fix for smooth scrolling on anchor links even if href="#"
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Functions
function handleScroll() {
    // Sticky Navbar Effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link Highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links li a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
}

function toggleMenu() {
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Reveal Animations on Scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .project-card, .about-text, .contact-wrapper').forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
});

// Form Submission to Google Sheets
const contactForm = document.querySelector('.contact-form');
const scriptURL = 'https://script.google.com/macros/s/AKfycbzFaU2taygDLHZDK2lvmyND_azK5vjpmpnx-ucNGa_u7o5Z1ePwHS2FCLrcArnygAQ_/exec';

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const thanksCard = document.getElementById('thanks-card');

        btn.disabled = true;

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: new URLSearchParams(new FormData(contactForm))
        })
            .then(response => {
                contactForm.style.display = 'none';
                if (thanksCard) {
                    thanksCard.style.display = 'block';
                }
                contactForm.reset();
                btn.disabled = false;

                // Auto-reset back to form state after 5 seconds
                setTimeout(() => {
                    if (thanksCard) thanksCard.style.display = 'none';
                    contactForm.style.display = 'block';
                }, 5000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.disabled = false;
            });
    });
}
