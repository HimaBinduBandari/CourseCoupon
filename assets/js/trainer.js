/*
==================================================
GLOBAL VARIABLES
==================================================
*/

let trainer = null;
let allCourses = [];
let trainerCourses = [];
let filteredCourses = [];
let currentPage = 1;
const coursesPerPage = 12;

/*
==================================================
LOAD TRAINER PAGE
==================================================
*/
async function loadTrainerPage(){
    try{
        const trainerResponse = await fetch("data/trainers.json");
        const courseResponse = await fetch("data/courses.json");

        if(!trainerResponse.ok || !courseResponse.ok){
            throw new Error("Unable to load JSON.");
        }

        const trainers = await trainerResponse.json();
        allCourses = await courseResponse.json();

        const params = new URLSearchParams(window.location.search);
        const slug = params.get("trainer");

        if(!slug){
            showError("Instructor not found.");
            return;
        }

        trainer = trainers.find(item => item.slug === slug);

        if(!trainer){
            showError("Instructor not found.");
            return;
        }

        trainerCourses = allCourses.filter(course => course.trainer_slug === slug);
        filteredCourses = [...trainerCourses];

        loadTrainer();
        calculateStatistics();
        updateSEO();
        setupEvents();
        setupJobBanner();
        renderCourses();
    }
    catch(error){
        console.error(error);
        showError("Unable to load instructor.");
    }
}

/*
==================================================
LOAD TRAINER INFORMATION
==================================================
*/
function loadTrainer(){
    document.getElementById("trainerName").textContent = trainer.name;
    document.getElementById("trainerTitle").textContent = trainer.name;
    document.getElementById("trainerDesignation").textContent = trainer.designation || "";
    document.getElementById("trainerBio").textContent = trainer.bio || "";

    const image = document.getElementById("trainerImage");
    image.src = trainer.photo && trainer.photo.trim() !== ""
        ? trainer.photo
        : "assets/images/defaults/trainer.png";

    const website = document.getElementById("trainerWebsite");
    if(trainer.website && trainer.website.trim() !== ""){
        website.href = trainer.website;
        website.target = "_blank";
        website.rel = "noopener noreferrer";
    } else {
        website.style.display = "none";
    }

    const linkedin = document.getElementById("trainerLinkedin");
    if(trainer.linkedin && trainer.linkedin.trim() !== ""){
        linkedin.href = trainer.linkedin;
        linkedin.target = "_blank";
        linkedin.rel = "noopener noreferrer";
    } else {
        linkedin.style.display = "none";
    }
}

/*
==================================================
JOBQCAREER BANNER
==================================================
*/
function setupJobBanner(){
    const heading = document.getElementById("trainerJobsHeading");
    const description = document.getElementById("trainerJobsDescription");
    if(!heading || !description || !trainer) return;

    heading.textContent = `Explore Jobs Related to ${trainer.name}'s Courses`;
    description.textContent = `Discover job opportunities related to the skills covered in ${trainer.name}'s courses.`;
}

/*
==================================================
CALCULATE STATISTICS
==================================================
*/
function calculateStatistics(){
    const totalCourses = trainerCourses.length;
    let totalStudents = 0;
    let totalReviews = 0;
    let totalRating = 0;

    trainerCourses.forEach(course => {
        totalStudents += Number(course.students) || 0;
        totalReviews += Number(course.reviews) || 0;
        totalRating += Number(course.rating) || 0;
    });

    const averageRating = totalCourses ? (totalRating / totalCourses).toFixed(1) : "0.0";

    document.getElementById("trainerRating").textContent = averageRating;
    document.getElementById("trainerCourses").textContent = totalCourses;
    document.getElementById("trainerStudents").textContent = formatNumber(totalStudents);
    document.getElementById("trainerReviews").textContent = formatNumber(totalReviews);
    document.getElementById("trainerRatingText").textContent = averageRating + " (" + formatNumber(totalReviews) + " Reviews)";
}

/*
==================================================
FORMAT NUMBER
==================================================
*/
function formatNumber(value){
    value = Number(value) || 0;
    return value.toLocaleString();
}

/*
==================================================
SEO
==================================================
*/
function updateSEO(){
    document.title = trainer.name + " Courses & Coupons | CourseCoupon";

    const description = "Explore " + trainerCourses.length + " online courses by " + trainer.name + ". Get the latest Udemy coupons, ratings, reviews and discounts on CourseCoupon.";

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if(descriptionMeta) descriptionMeta.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if(ogTitle) ogTitle.setAttribute("content", document.title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if(ogDescription) ogDescription.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if(ogUrl) ogUrl.setAttribute("content", window.location.href);

    if(trainer.photo && trainer.photo.trim() !== ""){
        const ogImage = document.querySelector('meta[property="og:image"]');
        if(ogImage) ogImage.setAttribute("content", trainer.photo);
    }

    const canonical = document.getElementById("canonicalLink");
    if(canonical) canonical.href = window.location.href;
}

/*
==================================================
ERROR
==================================================
*/
function showError(message){
    const grid = document.getElementById("courseGrid");
    if(grid){
        grid.innerHTML = `<h2 style="text-align:center;">${message}</h2>`;
    }
}

/*
==================================================
SETUP EVENTS
==================================================
*/
function setupEvents(){
    const search = document.getElementById("courseSearch");
    const sort = document.getElementById("sortCourses");
    if(search) search.addEventListener("input", searchCourses);
    if(sort) sort.addEventListener("change", sortCourses);
}

/*
==================================================
SEARCH COURSES
==================================================
*/
function searchCourses(){
    const keyword = document.getElementById("courseSearch").value.trim().toLowerCase();

    filteredCourses = trainerCourses.filter(course =>
        String(course.title || "").toLowerCase().includes(keyword)
    );

    currentPage = 1;
    sortCourses();
}

/*
==================================================
SORT COURSES
==================================================
*/
function sortCourses(){
    const sort = document.getElementById("sortCourses").value;

    switch(sort){
        case "rating":
            filteredCourses.sort((a,b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
            break;
        case "students":
            filteredCourses.sort((a,b) => (Number(b.students) || 0) - (Number(a.students) || 0));
            break;
        case "reviews":
            filteredCourses.sort((a,b) => (Number(b.reviews) || 0) - (Number(a.reviews) || 0));
            break;
        case "name":
            filteredCourses.sort((a,b) => String(a.title || "").localeCompare(String(b.title || "")));
            break;
        default:
            filteredCourses.sort((a,b) => new Date(b.last_updated || 0) - new Date(a.last_updated || 0));
    }

    currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage)));
    renderCourses();
}

/*
==================================================
RENDER COURSES
==================================================
*/
function renderCourses(){
    const grid = document.getElementById("courseGrid");
    if(!grid) return;
    grid.innerHTML = "";

    if(filteredCourses.length === 0){
        grid.innerHTML = `<div class="no-results"><h2>No courses found</h2></div>`;
        const pagination = document.getElementById("pagination");
        if(pagination) pagination.innerHTML = "";
        return;
    }

    const start = (currentPage - 1) * coursesPerPage;
    const end = start + coursesPerPage;

    filteredCourses.slice(start, end).forEach(course => {
        if(typeof createCourseCard === "function"){
            grid.insertAdjacentHTML("beforeend", createCourseCard(course));
        }
    });

    renderPagination();
}

/*
==================================================
PAGINATION
==================================================
*/
function renderPagination(){
    const container = document.getElementById("pagination");
    if(!container) return;
    container.innerHTML = "";

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    if(totalPages <= 1) return;

    const previous = document.createElement("button");
    previous.innerHTML = "&laquo;";
    previous.disabled = currentPage === 1;
    previous.setAttribute("aria-label", "Previous page");
    previous.onclick = function(){
        currentPage--;
        renderCourses();
        scrollToCourses();
    };
    container.appendChild(previous);

    for(let i = 1; i <= totalPages; i++){
        const button = document.createElement("button");
        button.textContent = i;
        if(i === currentPage) button.classList.add("active");
        button.setAttribute("aria-label", `Page ${i}`);
        button.onclick = function(){
            currentPage = i;
            renderCourses();
            scrollToCourses();
        };
        container.appendChild(button);
    }

    const next = document.createElement("button");
    next.innerHTML = "&raquo;";
    next.disabled = currentPage === totalPages;
    next.setAttribute("aria-label", "Next page");
    next.onclick = function(){
        currentPage++;
        renderCourses();
        scrollToCourses();
    };
    container.appendChild(next);
}

/*
==================================================
SCROLL TO COURSE GRID
==================================================
*/
function scrollToCourses(){
    const section = document.querySelector(".courses-section");
    if(section){
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/*
==================================================
INITIALIZE
==================================================
*/
loadTrainerPage();
