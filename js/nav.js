const navLinks = document.querySelectorAll('.nav-btn');
const navFilter = document.querySelectorAll('.categories');
const buttomNav = document.getElementById("footer");
const navSearchBtn = document.getElementById('search-button');
const navHomeBtn = document.getElementById('home-button');
const navPlayBtn = document.getElementById('play-button');
const musicBackBtn = document.getElementById('back-arrow');



navLinks.forEach(btn => {
btn.addEventListener('click',()=> {
    // Remove active class from all buttons
    navLinks.forEach(i =>  i.classList.remove('bg-[#1DB954]','text-white'));

     // Add active class to clicked button
    btn.classList.add('bg-[#1DB954]','text-white');

    //save clicked button
    localStorage.setItem('selectedNav', btn.id);
    });
});


window.addEventListener('DOMContentLoaded', () => {
  const savedId = localStorage.getItem('selectedNav');

  if (savedId) {
    const activeBtn = document.getElementById(savedId);
    if (activeBtn) {
        navLinks.forEach(i => i.classList.remove("bg-[#1DB954]", "text-white"));
        activeBtn.classList.add("bg-[#1DB954]", "text-white");
    }
  } else {
    navHomeBtn.classList.add('bg-[#1DB954]', 'text-white');
  }
});

function switchPageEffect(page) {
    document.body.classList.add('page-slide-out');

    setTimeout(() => {
        window.location.href = page
    }, 300);
};

if (navSearchBtn) navSearchBtn.addEventListener('click', () => switchPageEffect('search.html'));


if (navHomeBtn) navHomeBtn.addEventListener('click', () => switchPageEffect('index.html'));


if (navPlayBtn) navPlayBtn.addEventListener('click', () => switchPageEffect('player.html'));


//BACK BTN ON MUSIC PLAYER
if (musicBackBtn) {
musicBackBtn.addEventListener('click', () => {

    localStorage.setItem('selectedNav', 'home-button');
    //Redirect to home.
    window.location.href = 'index.html';
    });

}




//SELECT CATEGORIES TOP NAV BAR
navFilter.forEach(button =>{
    button.addEventListener('click', () =>{
        navFilter.forEach(b => {
            b.classList.remove('active');
            button.classList.add('active');
        });
    });
});

//BUTTOM NAV BAR


//HIDE SCROLL-BAR FOR BUTTOM NAV
let lastScrollY = window.scrollY;
let hideTimeout;

window.addEventListener('scroll', ()=>{
    const currentScrollY = window.scrollY;

    //Scroll Down
    if (currentScrollY > lastScrollY + 10) {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout( () => {
            buttomNav.classList.add('translate-y-32', 'opacity-0');
 
        },150);
    }
    else if(currentScrollY < lastScrollY - 10 ) {
        clearTimeout(hideTimeout);
           buttomNav.classList.remove('translate-y-32', 'opacity-0');
    }

    lastScrollY = currentScrollY;
});
