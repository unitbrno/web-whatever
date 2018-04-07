$(function () {

$(document).on('click', 'a.anchor[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 700);
});

$('.pmd-dropdown').pmdDropdown();
})
