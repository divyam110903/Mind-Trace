$(document).ready(function(){
    $('.slider').slick({
        autoplay: true, // Enable automatic sliding
        autoplaySpeed: 1000, // Delay between slides in milliseconds (3 seconds in this example)
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    });
});

