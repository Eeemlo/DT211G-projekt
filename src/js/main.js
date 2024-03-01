
let jobListings = document.getElementById("job-listings");


//Hämta data för jobbannonser och skriv ut till DOM
async function loadJobs() {
    const response = await fetch(`https://links.api.jobtechdev.se/joblinks?occupation-field=apaJ_2ja_LuF&q=frontend?q=backend?q=web?q=Stockholm?q=javascript?q=typescript%20-senior%20-sr%20-AWS%20-golang&limit=100`);
    const jobPosts = await response.json();
    console.log(jobPosts)//Ta bort

    for (let i = 0; i <= jobPosts.total.value; i++) {
    jobListings.innerHTML += `
    <section class="job_card">
    <h2>${jobPosts.hits[i].headline}</h2>
        <h3>${jobPosts.hits[i].employer.name}</h3>
        <h5>${jobPosts.hits[i].workplace_addresses[0].municipality}</h5>
        <p>${jobPosts.hits[i].brief}</p>
        <a class="ad_button button" href="${jobPosts.hits[i].source_links[0].url}">Till annonsen</a>
        </section>`;
    }
}


    loadJobs()




