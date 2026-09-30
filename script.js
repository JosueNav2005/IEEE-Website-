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