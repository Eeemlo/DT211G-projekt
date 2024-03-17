const jobListings = document.getElementById("job-listings");
const yesIcon = document.querySelector(".icon-yes");
const noIcon = document.querySelector(".icon-no");
const savedButton = document.querySelector(".saved-button");
const savedJobs = document.querySelector(".saved-jobs");
const errorMsg = document.getElementById("error-msg");
const searchBar = document.querySelector("#searchbar");
const searchButton = document.querySelector("#searchbutton");
const button = document.querySelector('.button');

let skip;
let destLat;
let destLong;
let userLat;
let userLong;
let input = "Sverige";
let page = 0;
let jobData = null;
let playCount = 0;

//Funktion för att toggla "mina sparade jobb"
window.onload = function () {
    savedButton.addEventListener("click", function () {
        savedButton.classList.toggle("active");
        savedJobs.classList.toggle("active");
    });
};

// Hämta användarens position och returnera long + lat
function getUserLocation(callback) {
    const successCallback = (position) => {
        userLat = position.coords.latitude;
        userLong = position.coords.longitude;
        callback(userLat, userLong);
    };
    const errorCallback = (error) => {
        console.error(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}




// Lägg till en händelselyssnare på knappen
button.addEventListener('click', function() {
    // Hämta referens till section2
    const section2 = document.getElementById('section2');
    
    // Scrolla ner till section2 med smooth scroll
    section2.scrollIntoView({ behavior: 'smooth' });

    // Vänta på att scrollningen ska slutföras och sedan dölj square1
    setTimeout(() => {
        const square1 = document.querySelector('.square1');
        square1.style.display = 'none';
    }, 180); // Justera tiden beroende på hur länge smooth scroll tar
});


// Hämta data för jobbannonser och skriv ut till DOM
async function loadJobs() {
    playCount = 0; // Återställ playCount varje gång en ny sökning görs
    const response = await fetch(
        `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=${input}?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master%20-sharepoint%20-5%20-3&limit=1&offset=${page}`
    );
    jobData = await response.json();

    console.log(jobData);

    // Hämta användarens position och kör iterateJobs
    getUserLocation(() => {
        iterateJobs(jobData);
    });
}

// Läs in jobb
loadJobs();



// Funktion för att skriva ut resultat till DOM (byt namn sedan!!)
async function iterateJobs(jobData) {
    jobListings.innerHTML =`<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
 </svg>`
    // Kontrollera om jobData innehåller träffar
    if (jobData.hits && jobData.hits.length > 0) {
        // Lagra nya värden i destLat och destLong
        destLat = jobData.hits[0].workplace_address.coordinates[1];
        destLong = jobData.hits[0].workplace_address.coordinates[0];

        // Förskjut att skriva ut till DOM
        setTimeout(async () => {
            jobListings.innerHTML = ` 
            <div class="job_card">
                <div>
                    <div class="head-info">
                        <h2 class="headline">${jobData.hits[0].headline} @ ${
                jobData.hits[0].employer.name
            }</h2>
                        <h5>${
                            jobData.hits[0].workplace_address.municipality
                        }</h5>
                        <h5 class="distance-calc">${await calculateDistance(
                            userLat,
                            userLong,
                            destLat,
                            destLong
                        )} från din plats</h5>
                    </div>
                    <p class="full-text">${
                        jobData.hits[0].description.text_formatted
                    }</p>
                </div>
            </div>`;
        }, 300); //Anpassa delay efter tiden som sätts på animationen i CSS
    } else {
        // Om jobData inte innehåller några träffar, visa felmeddelande
        jobListings.innerHTML = '';
        errorMsg.innerHTML =
            "Hittade inga annonser, testa att göra en ny sökning";
    }
}

function saveToLocalStorage() {
    localStorage.setItem(`annons${page}`, JSON.stringify(jobData));
    let jobAds = JSON.parse(localStorage.getItem(`annons${page}`));

    if (jobAds && jobAds.hits && jobAds.hits.length > 0) {
        savedJobs.innerHTML += `<a class ="link-wrapper" target="_blank" href="${
            jobAds.hits[0].webpage_url
        }"><div class="saved-links"><h5>${truncate(
            jobAds.hits[0].headline
        )} @ ${truncate(jobAds.hits[0].employer.name, 25)}</h5>
                    <h6>${
                        jobAds.hits[0].workplace_address.municipality
                    }</h6></div></a>
                    `;
    }
}

//lagra annons i localStorage vid klick
yesIcon.addEventListener("click", saveToLocalStorage, false);

//Event vid adressinmatning
searchButton.onclick = async function () {
    input = searchBar.value;

    jobListings.innerHTML = "";
    errorMsg.innerHTML = "";

    await loadJobs();

    getUserLocation(() => {
        iterateJobs(jobData);
    });
};

// AJAX-ANROP TILL API SOM RÄKNAR UT DISTANS MELLAN POSITION OCH FÖRETAGETS KONTOR
async function calculateDistance(lat1, long1, lat2, long2) {
    const response = await fetch(
        `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${lat1},${long1}&destinations=${lat2},${long2}&key=fA3CPEYhXO1udHHiHApKRfX6jm5Cx1Hk5f9OAxdb7tDitT3dpwdkn0ZUADi9KMST`
    );
    const distanceData = await response.json();

    //Returnerar km mellan origin och destination
    return distanceData.rows[0].elements[0].distance.text;
}

// Funktion som kortar ner text
function truncate(description, maxLength = 50) {
    if (description.length <= maxLength) return description;

    const truncated = description.substring(0, maxLength - 3);
    const ellipsis = "...";

    return truncated + ellipsis;
}

function playNo() {
    if (playCount < jobData.hits.length) {
        document.querySelector(".job_card").className = "job_card";
        requestAnimationFrame((time) => {
            requestAnimationFrame((time) => {
                document.querySelector(".job_card").className =
                    "job_card job_card_no";
            });
        });
        playCount++;
    }
}

function playYes() {
    if (playCount < jobData.hits.length) {
        document.querySelector(".job_card").className = "job_card";
        requestAnimationFrame((time) => {
            requestAnimationFrame((time) => {
                document.querySelector(".job_card").className =
                    "job_card job_card_yes";
            });
        });
        playCount++;
    }
}

//Öka antalet sparade annonser i blå ruta vid varje klick på hjärtat
const amountEl = document.querySelector(".amount");
let i = 0;
amountEl.innerHTML = i;

function increaseHeartNo() {
    i = i + 1;
    amountEl.innerHTML = i;
}

//Klickevent för yesIcon
yesIcon.addEventListener("click", playYes, false);
yesIcon.addEventListener("click", increasePageVar, false);
yesIcon.addEventListener("click", increaseHeartNo, false);

//Trigga funktion "swipeNo"
noIcon.addEventListener("click", playNo, false);
noIcon.addEventListener("click", increasePageVar, false);

//Funktion för att öka page med 1 varje gång den anropas
function increasePageVar() {
    skip = page++;
    loadJobs();
}
