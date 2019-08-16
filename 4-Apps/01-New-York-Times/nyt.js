const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; //API endpoint that we were pointing our application toward
const key = 'CUSbNP34mGCGMN8S7i4Ou3AiGxUeL7iL'; //API key that our API was looking for authentication
let url; //Never filled it so we could build the URL from scratch later, placeholder "dynamic url"

// SEARCH FORM
const searchTerm = document.querySelector(".search"); 
const startDate = document.querySelector(".start-date");
const endDate = document.querySelector(".end-date");
const searchForm = document.querySelector("form");
const submitBtn = document.querySelector(".submit");

// RESULTS NAVIGATION
const nextBtn = document.querySelector(".next");
const previousBtn = document.querySelector(".prev");
const nav = document.querySelector("nav");

// RESULTS SECTION
const section = document.querySelector("section");

// NAV VARIABLE SETTINGS
nav.style.display = 'none'; //Styling nav class and making it so we don't see the nav bar
let pageNumber = 0; //Setting our page number at 0, which will become important later in the app
console.log('PageNumber:', pageNumber); 
let displayNav = false; // ???

//EVENT LISTENERS
searchForm.addEventListener("submit", fetchResults); //telling the DOM to listen for an event on searchForm which connects to the HTML through the DOM on the querySelector("form")
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", previousPage);

// BUILDING API URL 
function fetchResults(e) { //(e) is a placeholder for an element
    e.preventDefault(); //Stops the form from submitting before we're ready
    url = baseURL + "?api-key=" + key + "&page=" + pageNumber + "&q=" + searchTerm.value;
    console.log("URL:", url); //builds out the full URL piece by piece through addition 
    // BEGINNING AND END DATES TO SEARCH
    if(startDate.value !== ""){ 
        console.log(startDate.value)
        url += "&begin_date=" + startDate.value; //pulling the data entered from the start-date button on the page into the URL
    }; 

    if(endDate.value !== ""){
        url += "&end_date=" + endDate.value; //pulling the data entered from the end-date button on the page into the URL
    };
    
// FETCHING RESULTS FROM API
    fetch(url)
        .then(function(result) { //calling the API and seeing what data they have for us
            return result.json(); //returning that data and putting it through the json function to turn it into json
        }) 
        .then(function(json){
            displayResults(json); //then we are displaying the json data
        })
}

function displayResults(json) {  // handle the data received from the API when the promise returns the json data
    while (section.firstChild) { // running the displayResults each time a button get pushed, this function is checking to see if section element has any child elements
        section.removeChild(section.firstChild);
    };
    let articles = json.response.docs; // accesses data deeper into the json and stores it as "articles" variable
    //if(articles.length === 0){
    if(articles.length === 0){ // displays no results if there are no articles
    console.log("No results"); //c.logs it

    } else {
// LOOP THAT BUILDS OUT DISPLAY SPACE FOR FETCHED ARTICLES
        for(let i = 0; i < articles.length; i ++){  // writes a for loop that iterates through the length of the articles array
            let article = document.createElement("article");
            let heading = document.createElement("h2");
            let link = document.createElement("a");
            let img = document.createElement('img');
            let para = document.createElement('p'); 
            let clearfix = document.createElement('div');

            let current = articles[i];
            console.log("Current:", current);

            link.href = current.web_url;
            link.textContent = current.headline.main;

            para.textContent = 'Keywords: ';

            for(let j = 0; j < current.keywords.length; j++) {
                let span = document.createElement('span');   
                span.textContent += current.keywords[j].value + ' ';   //text for each span will be the value found in the keywords array
                para.appendChild(span); //actually putting it in the page
             /*   let span = document.createElement('span');  
                span.textContent += current.keywords[j].value + ' ';   
                para.appendChild(span);
            */
            }

            if(current.multimedia.length > 0) { //goes into the JSON data of the the current article data under multimedia tag
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url; 
                img.alt = current.headline.main; //fallback altnerative image, which is the article's headline
            } 

            clearfix.setAttribute('class','clearfix');

            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(img);
            article.appendChild(para);
            article.appendChild(clearfix);
            section.appendChild(article);
        };
    }; 
    
    if(articles.length === 10 && pageNumber === 0) { 
        nav.style.display = "block"; 
        previousBtn.style.display = "none";
        nextBtn.style.display = "block";
    } else if(articles.length === 10) {
        nav.style.display = 'block'; 
        nextBtn.style.display = "block";
        previousBtn.style.display = "block";
    } else if(articles.length < 10) {
        nav.style.display = 'block'; 
        nextBtn.style.display = "none";
        previousBtn.style.display = "block";
    } else {
        nav.style.display = "none";
    }
};

function nextPage(e){
    pageNumber++;
    fetchResults(e);
    console.log("Page number:", pageNumber);
};

function previousPage(e){
    if(pageNumber > 0){
        pageNumber--;
    } else {
        return;
    }
    fetchResults(e);
    console.log("Page:", pageNumber);
};