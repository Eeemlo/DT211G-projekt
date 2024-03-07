const jobListings = document.getElementById("job-listings");
const yesIcon = document.querySelector(".icon-yes");
const noIcon = document.querySelector(".icon-no");
let input = "Sverige";
let page = 0;
let skip;
let destLat;
let destLong;

//Hämta användarens position och returnera long + lat
function getUserLocation() {
    const successCallback = (position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        console.log(position); //Ta bort
        calculateDistance(lat, long);
    };
    const errorCallback = (error) => {
        console.error(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

getUserLocation(); //Ta bort (trorjag)

//Hämta data för jobbannonser och skriv ut till DOM
async function loadJobs() {
    const response = await fetch(
        `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=${input}?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master&limit=1&offset=${page}`
    );
    const jobData = await response.json();

    console.log(jobData);
    console.log(page);

    iterateJobs(jobData);
}

//Läs in jobb
loadJobs();

/*
function getJobLocation(jobPosts) {
  //Lagra koordinater för jobbannonsen
  let destLat = jobPosts.hits[0].workplace_address.coordinates[1];
  let destLong = jobPosts.hits[0].workplace_address.coordinates[0];

  console.log("destination coordinates: " + destLat, destLong)
}

getJobLocation();*/

/*VID KLICK - ANROPA URL MED UPPDATERAD ORT OCH KÖR LOOP SOM SKRIVER UT TILL DOM*/
//Variabler för HTML-element
const searchBar = document.getElementById("searchbar");
const searchButton = document.getElementById("searchbutton");

//Event vid adressinmatning
searchButton.onclick = async function () {
    const errorMsg = document.getElementById("error-msg");
    input = searchBar.value;

    jobListings.innerHTML = "";
    errorMsg.innerHTML = "";

    //Gör fetchanrop
    const response = await fetch(
        `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=${input}?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master&limit=1&offset=${page}`
    );
    //Lagra svar i variabel
    const jobData = await response.json();

    //Loopa igenom nya resultat efter sökning och skriv ut till DOM
    if (jobData && jobData.total.value > 0) {
        await iterateJobs(jobData);
    } else {
        errorMsg.innerHTML = "Hittade inga annonser";
    }
};

/*AJAX-ANROP TILL API SOM RÄKNAR UT DISTANS MELLAN POSITION OCH FÖRETAGETS KONTOR*/
async function calculateDistance(lat1, long1) {
    const response = await fetch(
        `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${lat1},${long1}&destinations=${destLat},${destLong}&key=fA3CPEYhXO1udHHiHApKRfX6jm5Cx1Hk5f9OAxdb7tDitT3dpwdkn0ZUADi9KMST`
    );
    const distanceData = await response.json();

    console.log("user position: " + lat1, long1); //Ta bort
    console.log(distanceData); //Ta bort

    //Returnerar km mellan origin och destination
    return distanceData.rows[0].elements[0].distance.text;
}

calculateDistance();

//Funktion för att loopa igenom resultat och skriva ut till DOM (byt namn sedan!!!)
function iterateJobs(jobData) {
    //Lagra nya värden i destLat och destLong
    destLat = jobData.hits[0].workplace_address.coordinates[1];
    destLong = jobData.hits[0].workplace_address.coordinates[0];
    console.log("Destination: " + destLat, destLong); //Ta bort

    //Förskjut att skriva ut till DOM
    setTimeout(() => {
        jobListings.innerHTML = ` 
  <div class="job_card">
  <div>
  <h2>${jobData.hits[0].headline}</h2>
      <h3>${jobData.hits[0].employer.name}</h3>
      <h5>${jobData.hits[0].workplace_address.municipality}</h5>
      <h5>{${calculateDistance(destLat, destLong)}}</h5>
      <p class="truncated-text">${truncate(
          jobData.hits[0].description.text
      )}</p>
      <p class="full-text">${jobData.hits[0].description.text}</p>
      <a id="show-more" class="show-more" href="">visa mer</a>
      <a id="show-less" class="show-less" href="">visa mindre</a>
      <button class="ad_button button" href="${
          jobData.hits[0].webpage_url
      }">Till annonsen</button>
      </div>
      </div>`;
    }, 800); //Anpassa delay efter tiden som sätts på animationen i CSS
}

//Funktion för att spara annons i localStorage
/*FUNKAR EJ
  function saveToLocalStorage(jobPosts) {
    localStorage.setItem(`annons${page}`, `${jobPosts.hits[0].headline}`);
    console.log("knappen funkar")
  
  }
  
  yesIcon.addEventListener("click", saveToLocalStorage, false);
*/

//Försök till att visa mer eller mindre av texten.. FUNKAR INTE!!!!
/*
const showMoreLink = document.getElementsByClassName("show-more");
const showLessLink = document.getElementById("show-less");
const truncatedText = document.getElementsByClassName("truncated-text");
const fullText = document.getElementsByClassName("full-text");


showMoreLink.onclick = async function () {
  truncatedText.style.display = "none";
  fullText.style.display = "block";
}; */ //slut på försök

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

//Trigga funktion "swipeYes"
yesIcon.addEventListener("click", playYes, false);
yesIcon.addEventListener("click", increasePageVar, false);

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
    console.log(skip);
    loadJobs();
}

//Funktion som kortar ner text
function truncate(description, maxLength = 800) {
    if (description.length <= maxLength) return description;

    const truncated = description.substring(0, maxLength - 3);
    const ellipsis = "...";

    return truncated + ellipsis;
}
