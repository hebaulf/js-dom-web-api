// Single page Application
const app = {
    pages: [],
    // Custom "show" event
    show: new Event('show'),

    init: function() {
        app.pages = document.querySelectorAll('.page'); // Get all pages
        app.pages.forEach((pg) => {
            pg.addEventListener('show', app.pageShown); // listen for the custom "show" event on each page
        });
        // Get all navigation links
        document.querySelectorAll('.nav__link').forEach((link) => {
            link.addEventListener('click', app.nav); // Listen for a click event on each link
        });
        // Initial default url
        // So if I reload the page it will revert the page it was on
        if (location.hash === "#home") {
            history.replaceState({}, '', '#home');
            document.querySelector('.nav__link.active').classList.remove('active'); // remove active class from link
            document.querySelector('.page.active').classList.remove('active'); // remove active class from page
            document.querySelector('.nav__link[data-target="home"]').classList.add('active'); // Add active class to link with data-target="home"
            document.getElementById('home').classList.add('active'); // Add active class to page #home
        } else if (location.hash === "#bookList") {
            history.replaceState({}, '', '#bookList');
            document.querySelector('.nav__link.active').classList.remove('active'); // remove active class from link
            document.querySelector('.active').classList.remove('active'); // remove active class from page
            document.querySelector('.nav__link[data-target="bookList"]').classList.add('active'); // Add active class to link with data-target="bookList"
            document.getElementById('bookList').classList.add('active'); // Add active class to page #bookList
        } else if (location.hash === "#movieList") {
            history.replaceState({}, '', '#movieList');
            document.querySelector('.nav__link.active').classList.remove('active'); // remove active class from link
            document.querySelector('.active').classList.remove('active'); // remove active class from page
            document.querySelector('.nav__link[data-target="movieList"]').classList.add('active'); // Add active class to link with data-target="movieList"
            document.getElementById('movieList').classList.add('active'); // Add active class to page #movieList
        }
        window.addEventListener('popstate', app.popIn);
    },

    nav: function(ev) {
        ev.preventDefault(); // Prevent default behaviour on link click

        let currentPage = ev.target.getAttribute('data-target');// Create a current page variable that will be the data-target value of the clicked navigation element
       
        document.querySelector('.page.active').classList.remove('active'); // Remove .active class of any nav element
        document.getElementById(currentPage).classList.add('active'); // Get clicked nav element and add an .active class to the corresponding page element
        document.querySelector('.nav__link.active').classList.remove('active'); // remove active class from link if it has active class
        document.querySelector(`.nav__link[data-target="${currentPage}"]`).classList.add('active'); // Add class active to link with correspondinig data-target value.

        // Add hash 
        history.pushState({}, currentPage, `#${currentPage}`); // 
        document.getElementById(currentPage).dispatchEvent(app.show); // Gets the id that corresponds to data-target value of the nav item clicked and shows the corresponding page
    },

    pageShown: function(ev) {
        console.log('Page:', ev.target.id); // logs the page that was targeted and is being shown
        // Get title of page to be shown and add a class to h1 for 800ms and then remove that class (transition is in css)
        let h1 = ev.target.querySelector('h1');
        h1.classList.add('big');
        setTimeout((h) => {
            h.classList.remove('big');
        }, 800, h1);
    },

    popIn: function(ev) {
        console.log('Location.hash:', location.hash); // logs the hash of the page that is being loaded on prev or next in browser.
        let hash = location.hash.replace('#', ''); // variable hash is the location hash minus #
        document.querySelector('.active').classList.remove('active'); // remove active class of page
        document.getElementById(hash).classList.add('active'); // Finds the id of the page that corresponds to the location hash and adds the active class to the page
        document.getElementById(hash).dispatchEvent(app.show); //  Finds the id of the page that corresponds to the location hash and shows the corresponding page
    }
}

document.addEventListener('DOMContentLoaded', app.init);
