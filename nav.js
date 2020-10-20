const nav = document.querySelector('nav');
const html = document.querySelector('html');
const burger = document.querySelector('.burger_wrapper');

burger.addEventListener('click', toggleNav);

function toggleNav(){
    nav.classList.toggle('active');
    html.classList.toggle('pause_scroll');
  }