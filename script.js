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


//Opens and closes the Socials drop-down in the nav, closes it when clicking anywhere else or pressing Escape

const dropdown = document.querySelector('.dropdown');

if (dropdown) {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

    function setDropdown(isOpen) {
        dropdown.classList.toggle('open', isOpen);
        dropdownToggle.setAttribute('aria-expanded', isOpen);
    }

    dropdownToggle.addEventListener('click', () => {
        setDropdown(!dropdown.classList.contains('open'));
    });

    document.addEventListener('click', event => {
        if (!dropdown.contains(event.target)) {
            setDropdown(false);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            setDropdown(false);
        }
    });

    dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setDropdown(false));
    });
}


//Slides sections in as they scroll into view. Things that appear together are staggered so they come in one after another

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && revealItems.length) {
    document.documentElement.classList.add('js-reveal');

    const revealObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);

        visible.forEach((entry, i) => {
            entry.target.style.transitionDelay = `${Math.min(i, 5) * 0.1}s`;
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(item => revealObserver.observe(item));
}


//Adds a shadow under the nav bar once the page is scrolled

const header = document.querySelector('header');

function updateHeaderShadow() {
    header.classList.toggle('scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', updateHeaderShadow, { passive: true });
updateHeaderShadow();


//Fills the Upcoming Events cards with the next 3 events from the club Google Calendar

//Paste the Google API key here (see README). The calendar has to be public for this to work
const GOOGLE_API_KEY = 'AIzaSyBzO8g4s3YSlPPHOoSrJnKrTvv9Uah63PI';
const CALENDAR_ID = 'ieeeucsc26@gmail.com';
const CLUB_TIME_ZONE = 'America/Los_Angeles';

const eventGrid = document.querySelector('.event-grid');

if (eventGrid) {
    loadUpcomingEvents();
}

async function loadUpcomingEvents() {
    const emptyMessage = document.querySelector('.events-empty');

    try {
        if (!GOOGLE_API_KEY) {
            throw new Error('No Google API key set in script.js');
        }

        const params = new URLSearchParams({
            key: GOOGLE_API_KEY,
            timeMin: new Date().toISOString(),
            singleEvents: 'true',
            orderBy: 'startTime',
            maxResults: '3',
        });
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Calendar returned ${response.status}`);
        }

        const data = await response.json();
        const events = data.items || [];

        if (events.length === 0) {
            emptyMessage.hidden = false;
            return;
        }

        events.forEach(event => eventGrid.appendChild(buildEventCard(event)));
    } catch (error) {
        console.warn('Could not load upcoming events:', error);
        emptyMessage.hidden = false;
    }
}

function buildEventCard(event) {
    const template = document.getElementById('event-card-template');
    const card = template.content.firstElementChild.cloneNode(true);

    //All-day events only have a date, timed events have a dateTime
    const isAllDay = !event.start.dateTime;
    const start = isAllDay ? new Date(event.start.date + 'T12:00:00') : new Date(event.start.dateTime);
    const zone = isAllDay ? undefined : CLUB_TIME_ZONE;

    const month = start.toLocaleDateString('en-US', { month: 'short', timeZone: zone });
    const day = start.toLocaleDateString('en-US', { day: 'numeric', timeZone: zone });
    const time = isAllDay ? 'All day' : start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: zone });

    card.href = event.htmlLink;
    card.querySelector('.event-month').textContent = month;
    card.querySelector('.event-day').textContent = day;
    card.querySelector('.event-title').textContent = event.summary || 'IEEE Event';
    card.querySelector('.event-meta').textContent = `${time} · ${event.location || 'Location TBA'}`;

    const description = shortText(event.description || '', 140);
    if (description) {
        card.querySelector('.event-desc').textContent = description;
    } else {
        card.querySelector('.event-desc').remove();
    }

    return card;
}

//Calendar descriptions can contain HTML, this turns it into plain text and trims it to a short preview
function shortText(html, maxLength) {
    const spaced = html.replace(/<br\s*\/?>|<\/(p|div|li)>/gi, ' ');
    const text = new DOMParser().parseFromString(spaced, 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text;
}
