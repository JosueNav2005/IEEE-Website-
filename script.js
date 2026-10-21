//Flips card for the team section when clicked, but not when the social media links are clicked

const teamCards = document.querySelectorAll('.team-card');

teamCards.forEach(card => {
    card.addEventListener('click', function (event) {
        if (event.target.closest('.social-link')) {
            return;
        }
        card.classList.toggle('flipped');
    });
});

//Fades the page out before going to a different page, links on the same page smooth scroll instead

const pageLinks = document.querySelectorAll('a[href]');

pageLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        const url = new URL(link.href, window.location.href);
        const isOtherPage = url.origin === window.location.origin && url.pathname !== window.location.pathname;

        if (!isOtherPage || link.target === '_blank') {
            return;
        }

        event.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = link.href;
        }, 300);
    });
});

//Removes the fade if the user comes back with the browser back button

window.addEventListener('pageshow', () => {
    document.body.classList.remove('fade-out');
});


//Slides the About Us photos when the arrows or dots are clicked, wraps around at the ends

const slider = document.querySelector('.slider');

if (slider) {
    const track = slider.querySelector('.slider-track');
    const slides = track.querySelectorAll('img');
    const dots = slider.querySelectorAll('.slider-dot');
    let currentSlide = 0;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    slider.querySelector('.prev').addEventListener('click', () => showSlide(currentSlide - 1));
    slider.querySelector('.next').addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
}


//Opens and closes the nav menu on small screens, closes it again when a link is picked

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open menu');
        });
    });
}
