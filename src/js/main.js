const jobListings = document.getElementById("job-listings");
const yesIcon = document.querySelector(".icon-yes");
const noIcon = document.querySelector(".icon-no");
let input = "Sverige";
let page = 0;
let skip;
let destLat;
let destLong;
const savedButton = document.querySelector(".saved-button");
const savedJobs = document.querySelector(".saved-jobs");
let jobData = null;
const errorMsg = document.getElementById("error-msg");

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
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        callback(lat, long);
    };
    const errorCallback = (error) => {
        console.error(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

// Hämta data för jobbannonser och skriv ut till DOM
async function loadJobs() {
    const response = await fetch(
        `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=${input}?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master&limit=1&offset=${page}`
    );
    jobData = await response.json();

    // Hämta användarens position och kör iterateJobs
    getUserLocation((userLat, userLong) => {
        iterateJobs(jobData, userLat, userLong);
    });
}

// Läs in jobb
loadJobs();

// Funktion för att skriva ut resultat till DOM (byt namn sedan!!)
function iterateJobs(jobData, userLat, userLong) {
    let displayedJobs = []; //FUNKAR INTE ÄN, TA BORT OM DET EJ LÖSER SIG

    // Lagra nya värden i destLat och destLong
    destLat = jobData.hits[0].workplace_address.coordinates[1];
    destLong = jobData.hits[0].workplace_address.coordinates[0];

    console.log(jobData.hits[0].workplace_address)

    // Förskjut att skriva ut till DOM
    setTimeout(async () => {
        jobListings.innerHTML = ` 
        <div class="job_card">
            <div>
            <div class="head-info">
                <h2 class="headline">${jobData.hits[0].headline} @ ${jobData.hits[0].employer.name}</h2>
                <h5>${jobData.hits[0].workplace_address.municipality}</h5>
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
    }, 0); //Anpassa delay efter tiden som sätts på animationen i CSS

    console.log(jobData)

    /* FÖRSK TILL ATT PUSHA TILL ARRAY
    let jobAdId = jobData.hits[0].id;
displayedJobs.push(jobAdId);

    console.log(displayedJobs)
    */

}




//Funktion för att spara annons till localStorage och skriva ut till DOM
function saveToLocalStorage() {
    localStorage.setItem(`annons${page}`, JSON.stringify(jobData));
    let jobAds = JSON.parse(localStorage.getItem(`annons${page}`)); 

    savedJobs.innerHTML += `<a class ="link-wrapper" target="_blank" href="${jobAds.hits[0].webpage_url}"><div class="saved-links"><h5>${truncate(jobAds.hits[0].headline)} @ ${truncate(jobAds.hits[0].employer.name, 25)}</h5>
                <h6>${jobAds.hits[0].workplace_address.municipality}</h6></div></a>
                `;
}

//lagra annons i localStorage vid klick
yesIcon.addEventListener("click", saveToLocalStorage, false);


/*VID KLICK - ANROPA URL MED UPPDATERAD ORT OCH KÖR LOOP SOM SKRIVER UT TILL DOM*/
//Variabler för HTML-element
const searchBar = document.getElementById("searchbar");
const searchButton = document.getElementById("searchbutton");

//Event vid adressinmatning
searchButton.onclick = async function () {
    input = searchBar.value;

    jobListings.innerHTML = "";
    errorMsg.innerHTML = "";

await loadJobs();

    //Loopa igenom nya resultat efter sökning och skriv ut till DOM
    if (jobData && jobData.total.value > 0) {
        getUserLocation((userLat, userLong) => {
            iterateJobs(jobData, userLat, userLong);
        });
    } else {
        errorMsg.innerHTML = "Hittade inga annonser, testa att söka på en annan ort";
    }
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

//Funktion för att köra och återställa animation "swipeYes"
function playYes() {
    document.querySelector(".job_card").className = "job_card";
    requestAnimationFrame((time) => {
        requestAnimationFrame((time) => {
            document.querySelector(".job_card").className =
                "job_card job_card_yes";
        });
    });
}

//Öka antalet sparade annonser i blå ruta vid varje klick på hjärtat
const amountEl = document.querySelector(".amount");
let i = 0;
amountEl.innerHTML = i;

function increaseHeartNo() {
    i = i + 1
    amountEl.innerHTML = i;
}


//Klickevent för yesIcon
yesIcon.addEventListener("click", playYes, false);
yesIcon.addEventListener("click", increasePageVar, false);
yesIcon.addEventListener("click", increaseHeartNo, false);

//Funktion för att köra och återställa animation "swipeNo"
function playNo() {
    document.querySelector(".job_card").className = "job_card";
    requestAnimationFrame((time) => {
        requestAnimationFrame((time) => {
            document.querySelector(".job_card").className =
                "job_card job_card_no";
        });
    });
}
//Trigga funktion "swipeNo"
noIcon.addEventListener("click", playNo, false);
noIcon.addEventListener("click", increasePageVar, false);

//Funktion för att öka page med 1 varje gång den anropas
function increasePageVar() {
    skip = page++;
    loadJobs();
}
