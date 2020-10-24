var isFirstLoad = true;
var prevPageURL;
var nextPageURL;
var i;
var count;
var itemsPerPage = 10;
var currentPageIndex;
var pageCount;
var people;
var listItems;
var nameList = document.querySelector('.list-group');
var buttons = document.querySelector('#pagination-buttons');
// var btnGroup = document.querySelector('div.btn-group');
var prevPageButton = document.querySelector('#prev-btn');
var nextPageButton = document.querySelector('#next-btn');
var card = document.querySelector('.card');
var cardTitle = card.querySelector('.card-title');
var currentPageButton;
var currentPersonURL;
var currentPersonIndex;
var birthyearValue = card.querySelector('#birth-year > td:last-child');
var genderValue = card.querySelector('#gender > td:last-child');
var films = document.querySelector('#films');
var filmList = card.querySelector('#film-list');
var filmCount = card.querySelector('#film-count');
var homeworldValue = card.querySelector('#homeworld > td:last-child');
var speciesValue = card.querySelector('#species > td:last-child');

var prevPersonBtn = document.querySelector('#prev-person');
var nextPersonBtn = document.querySelector('#next-person');

HTMLButtonElement.prototype.select = function() {
    this.classList.remove('btn-primary');
    this.classList.add('btn-outline-primary'); 
};
HTMLButtonElement.prototype.unselect = function() {
    this.classList.remove('btn-outline-primary');
    this.classList.add('btn-primary'); 
};

HTMLButtonElement.prototype.showFullInfo = function(e) {   
    birthyearValue.innerHTML = '';
    genderValue.innerHTML = '';
    filmList.innerHTML = '';
    filmCount.innerHTML = '';
    homeworldValue.innerHTML = '';
    speciesValue.innerHTML = '';    
    currentPersonIndex = e.target.index;
    nameList.children[currentPersonIndex].focus();     
    console.log(currentPersonIndex);
    console.log(nameList.children.length);
    if (currentPersonIndex == 0) {
        prevPersonBtn.disabled = true;
    } else {
        prevPersonBtn.disabled = false;
    };    
    if (currentPersonIndex == (nameList.children.length - 1) && !isFirstLoad) {
        nextPersonBtn.disabled = true;
    } else {
        nextPersonBtn.disabled = false;
    };
    currentPersonURL = people[currentPersonIndex].url;  
    fetch(currentPersonURL)
    .then(response => response.json())  
    .then(person => {
        console.log(person);
        // console.log(response.name)
        cardTitle.innerHTML = person.name;
        birthyearValue.innerHTML = person.birth_year;
        genderValue.innerHTML = person.gender;  
        filmList.textContent = '';
        filmCount.innerHTML = person.films.length;
        for (i = 0; i < person.films.length; i++) {
            fetch(person.films[i])
            .then(response => response.json())
            .then(film => {                
                // console.log(film);
                var newRow = filmList.insertRow();
                newRow.className = 'bg-light';
                newRow.style.display = 'none';
        
                var newCell = newRow.insertCell();
                newCell.colSpan = '2';
            
                var newText = document.createTextNode(film.title);
                newCell.appendChild(newText);
            });
        };
        fetch(person.homeworld)
        .then(response => response.json())
        .then(homeworld => {
            // console.log(homeworld)
            homeworldValue.innerHTML = homeworld.name;
        });
        console.log(person.species)
        if (person.species.length) {
            fetch(person.species)
            .then(response => response.json())
            .then(species => {
                // console.log(species);
                speciesValue.innerHTML = species.name;
            });
        };       
    });                             
};
// console.dir(filmList)
HTMLTableSectionElement.prototype.toggleFilms = function() {
    // console.log(this);
    for (i = 0; i < filmList.childElementCount; i++) {
        // console.log(filmList.childElementCount);
        
        if (filmList.children[i].style.display == 'none') {
           filmList.children[i].style.display = 'table-row' 
        } else {
            filmList.children[i].style.display = 'none';
        };
    }
    
};
films.addEventListener('click', filmList.toggleFilms, false);

loadPeople('https://swapi.dev/api/people/');

function addPaginationButtons() {
    for (i = 1; i <= pageCount; i++) {
        var newPaginatonButton = document.createElement('button');
        newPaginatonButton.className = prevPageButton.className;    
        newPaginatonButton.innerHTML = i;            
        buttons.insertBefore(newPaginatonButton, nextPageButton);
        newPaginatonButton.addEventListener('click', loadSpecifiedPage, false);
        if (i == 1) {             
            currentPageButton = newPaginatonButton;                                  
            newPaginatonButton.select();
        };
    };
}

function loadSpecifiedPage(e) {
    if (currentPageButton) {        
        currentPageButton.unselect();
    };
    currentPageButton = e.target;
    currentPageButton.select();
   
    var pageNumber = e.target.innerHTML;
    var url = `http://swapi.dev/api/people/?page=${pageNumber}`;
    loadPeople(url);
};

function loadPrevPage() {
    currentPageButton.unselect();
    currentPageButton = currentPageButton.previousSibling;
    currentPageButton.select();
    loadPeople(prevPageURL);  
};
function loadNextPage() {
    // console.log(currentPageButton.__proto__)
    currentPageButton.unselect();
    currentPageButton = currentPageButton.nextSibling;
    currentPageButton.select();
    loadPeople(nextPageURL);  
};
function addListItems(response) {
    for (i = 0; i < response.results.length; i++) {
        var newListItem = document.createElement('button');
        newListItem.innerHTML = response.results[i].name;
        newListItem.className = 'list-group-item list-group-item-action';
        newListItem.index = i;        
        nameList.appendChild(newListItem);        
        newListItem.addEventListener('click', newListItem.showFullInfo, false);
    }; 
};
function loadPeople(url) {
    console.log(url)
    fetch(url)
    .then(response => response.json())
    .then(response => {
        people = response.results;
        currentPersonIndex = 0;
        if (isFirstLoad) {
            count = response.count;
            pageCount = Math.ceil(count / itemsPerPage);
            currentPageIndex = 1;
            addListItems(response); 
            addPaginationButtons();             
        };
        prevPageURL = response.previous;
        nextPageURL = response.next;
                    
        listItems = document.querySelectorAll('.list-group > button');
        
        if (!isFirstLoad) {
            nameList.textContent = '';
            addListItems(response);
            currentPageIndex = url.substring(url.indexOf('=') + 1);
            console.log(currentPageIndex)
            
        };
        console.log(nameList);
        console.log(currentPersonIndex);
        nameList.children[currentPersonIndex].click(); 
        if (currentPageIndex == 1) {
            prevPageButton.disabled = true;
        } else {
            prevPageButton.disabled = false;
        };
        if (currentPageIndex == pageCount) {
            nextPageButton.disabled = true;
        } else {
            nextPageButton.disabled = false;
        };
        isFirstLoad = false;
        
    });    
};

function goPrevPerson() {       
    nameList.children[currentPersonIndex - 1].click(); 
};

function goNextPerson() {   
    nameList.children[currentPersonIndex + 1].click(); 
};

prevPageButton.addEventListener('click', loadPrevPage, false);
nextPageButton.addEventListener('click', loadNextPage, false);

prevPersonBtn.addEventListener('click', goPrevPerson, false);
nextPersonBtn.addEventListener('click', goNextPerson, false);