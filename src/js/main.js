const jobListings = document.getElementById("job-listings");
const nextBtn = document.getElementById("nextButton");
const backBtn = document.getElementById("backButton");
const yesIcon = document.querySelector(".icon-yes")
const noIcon = document.querySelector(".icon-no")
let input = "Sverige";
let page = 0;
let skip;

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
  const jobPosts = await response.json();

  console.log(jobPosts)

  //Loopa igenom nya resultat efter sökning och skriv ut till DOM
  if (jobPosts && jobPosts.total.value > 0) {
    await iterateJobs(jobPosts);
  } else {
    errorMsg.innerHTML = "Hittade inga annonser";
  }
};


//Hämta data för jobbannonser och skriv ut till DOM
async function loadJobs() {
  const response = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=${input}?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master&limit=1&offset=${page}`
  );
  const jobPosts = await response.json();

  await iterateJobs(jobPosts);
}

//Variabel som används om jag vill använda timer(1000) för att delaya något
const timer = ms => new Promise(res => setTimeout(res, ms));

//Funktion för att loopa igenom resultat och skriva ut till DOM
async function iterateJobs(jobPosts) {
  for (let i = 0; i <= jobPosts.total.value; i++) {
    jobListings.innerHTML = ` 
  <div class="job_card">
  <div>
  <h2>${jobPosts.hits[i].headline}</h2>
      <h3>${jobPosts.hits[i].employer.name}</h3>
      <h5>${jobPosts.hits[i].workplace_address.municipality}</h5>
      <p class="truncated-text">${truncate(
        jobPosts.hits[i].description.text
      )}</p>
      <p class="full-text">${jobPosts.hits[i].description.text}</p>
      <a id="show-more" class="show-more" href="">visa mer</a>
      <a id="show-less" class="show-less" href="">visa mindre</a>
      <button class="ad_button button" href="${
        jobPosts.hits[i].webpage_url
      }">Till annonsen</button>
      </div>
      </div>`;
  }
}


//Läs in jobb
loadJobs();

//Försök till att visa mer eller mindre av texten.. FUNKAR INTE!!!!
/*
const showMoreLink = document.getElementsByClassName("show-more");
const showLessLink = document.getElementById("show-less");
const truncatedText = document.getElementsByClassName("truncated-text");
const fullText = document.getElementsByClassName("full-text");


showMoreLink.onclick = async function () {
  truncatedText.style.display = "none";
  fullText.style.display = "block";
}; *///slut på försök


//Funktion för att köra och återställa animation "swipeYes"
function playYes() {
  document.querySelector(".job_card").className = "job_card";
  requestAnimationFrame((time) => {
    requestAnimationFrame((time) => {
      document.querySelector(".job_card").className = "job_card job_card_yes";
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
      document.querySelector(".job_card").className = "job_card job_card_no";
    });
  });

}
//Trigga funktion "swipeNo"
noIcon.addEventListener("click", playNo, false);
noIcon.addEventListener("click", increasePageVar, false);

//Funktion för att öka page med 1 varje gång den anropas
function increasePageVar () {
  skip = page++;
  console.log(skip);
  loadJobs();
};


//Funktion som kortar ner text
function truncate(description, maxLength = 800) {
  if (description.length <= maxLength) return description;

  const truncated = description.substring(0, maxLength - 3);
  const ellipsis = "...";

  return truncated + ellipsis;
}

//Hämta användarens position
function getUserLocation(jobPosts) {
  const successCallback = (position) => {
    console.log(position);
  };
  const errorCallback = (error) => {
    console.error(error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

  //Funktion för att räkna ut avstånd mellan koordinator för jobb och user location
}
getUserLocation();

