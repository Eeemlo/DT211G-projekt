const jobListings = document.getElementById("job-listings");
const nextBtn = document.getElementById("nextButton");
const backBtn = document.getElementById("backButton");
let page = 1;
let skip;

nextBtn.onclick = function () {
  jobListings.innerHTML = "";
  skip = page++;
  console.log(skip);
  loadJobs();
};

backBtn.onclick = function () {
  jobListings.innerHTML = "";
  skip = page--;
  console.log(skip);
  loadJobs();
};

//Hämta data för jobbannonser och skriv ut till DOM
async function loadJobs() {
  const response = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=Sverige?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master&limit=1&offset=${page}`
  );
  const jobPosts = await response.json();

  iterateJobs(jobPosts);
}

//Funktion för att loopa igenom resultat och skriva ut till DOM
function iterateJobs(jobPosts) {
  for (let i = 0; i <= jobPosts.total.value; i++) {
    //Lägg till += för innerHTML om det  behövs
    jobListings.innerHTML += ` 
  <div class="job_card">
  <div>
  <h2>${jobPosts.hits[i].headline}</h2>
      <h3>${jobPosts.hits[i].employer.name}</h3>
      <h5>${jobPosts.hits[i].workplace_address.municipality}</h5>
      <p>${jobPosts.hits[i].description.text_formatted}</p>
      <a class="ad_button button" href="${jobPosts.hits[i].webpage_url}">Till annonsen</a>
      </div>
      </div>`;
  }
}

//Läs in jobb
loadJobs();

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

//Variabler för HTML-element
const searchBar = document.getElementById("searchbar");
const searchButton = document.getElementById("searchbutton");

//Event vid adressinmatning
searchButton.onclick = async function () {
  const errorMsg = document.getElementById("error-msg");
  let input = searchBar.value;

  jobListings.innerHTML = "";
  errorMsg.innerHTML = "";

  //Gör fetchanrop
  const response = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?occupation-field=apaJ_2ja_LuF&q=${input}?q=backend?q=web?q=javascript?q=typescript?%20-javautvecklare%20-expert%20-c++%20-manager%20-salesforce%20-ios%20-servicenow%20-architect%20-analyst%20-AI%20-python%20-testledare%20-.net%20-engineer%20-senior%20-sr%20-CD%20-AWS%20-golang%20-bsc%20-msc%20-kandidat%20-master&limit=100`
  );
  //Lagra svar i variabel
  const jobPosts = await response.json();

  //Loopa igenom nya resultat efter sökning och skriv ut till DOM
  if (jobPosts && jobPosts.total.value > 0) {
    iterateJobs(jobPosts);
  } else {
    errorMsg.innerHTML = "Hittade inga annonser";
  }
};
