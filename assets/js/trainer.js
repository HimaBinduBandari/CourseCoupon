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

        const trainerResponse =
        await fetch("data/trainers.json");

        const courseResponse =
        await fetch("data/courses.json");


        if(
            !trainerResponse.ok ||
            !courseResponse.ok
        ){

            throw new Error(
                "Unable to load JSON."
            );

        }


        const trainers =
        await trainerResponse.json();

        allCourses =
        await courseResponse.json();


        const params =
        new URLSearchParams(
            window.location.search
        );


        const slug =
        params.get("trainer");


        if(!slug){

            showError(
                "Instructor not found."
            );

            return;

        }


        trainer =
        trainers.find(item=>

            item.slug===slug

        );


        if(!trainer){

            showError(
                "Instructor not found."
            );

            return;

        }


        trainerCourses =

        allCourses.filter(course=>

            course.trainer_slug===slug

        );


        filteredCourses =

        [...trainerCourses];


        loadTrainer();

        calculateStatistics();

        updateSEO();

        setupEvents();

        renderCourses();

    }

    catch(error){

        console.error(error);

        showError(
            "Unable to load instructor."
        );

    }

}



/*
==================================================
LOAD TRAINER INFORMATION
==================================================
*/

function loadTrainer(){

    document.getElementById(
        "trainerName"
    ).textContent =
    trainer.name;


    document.getElementById(
        "trainerTitle"
    ).textContent =
    trainer.name;


    document.getElementById(
        "trainerDesignation"
    ).textContent =
    trainer.designation || "";


    document.getElementById(
        "trainerBio"
    ).textContent =
    trainer.bio || "";


    /*
    ==========================================
    IMAGE
    ==========================================
    */

    const image =
    document.getElementById(
        "trainerImage"
    );


    image.src =

    trainer.photo &&

    trainer.photo.trim() !== ""

    ?

    trainer.photo

    :

    "assets/images/defaults/trainer.png";



    /*
    ==========================================
    WEBSITE
    ==========================================
    */

    const website =
    document.getElementById(
        "trainerWebsite"
    );


    if(

        trainer.website &&
        trainer.website.trim() !== ""

    ){

        website.href =
        trainer.website;

    }

    else{

        website.style.display =
        "none";

    }



    /*
    ==========================================
    LINKEDIN
    ==========================================
    */

    const linkedin =
    document.getElementById(
        "trainerLinkedin"
    );


    if(

        trainer.linkedin &&
        trainer.linkedin.trim() !== ""

    ){

        linkedin.href =
        trainer.linkedin;

    }

    else{

        linkedin.style.display =
        "none";

    }

}



/*
==================================================
CALCULATE STATISTICS
==================================================
*/

function calculateStatistics(){

    const totalCourses =
    trainerCourses.length;

    let totalStudents = 0;

    let totalReviews = 0;

    let totalRating = 0;


    trainerCourses.forEach(course=>{

        totalStudents +=
        Number(course.students) || 0;

        totalReviews +=
        Number(course.reviews) || 0;

        totalRating +=
        Number(course.rating) || 0;

    });


    const averageRating =

    totalCourses

    ?

    (

        totalRating /

        totalCourses

    ).toFixed(1)

    :

    "0.0";


    document.getElementById(
        "trainerRating"
    ).textContent =
    averageRating;


    document.getElementById(
        "trainerCourses"
    ).textContent =
    totalCourses;


    document.getElementById(
        "trainerStudents"
    ).textContent =
    formatNumber(
        totalStudents
    );


    document.getElementById(
        "trainerReviews"
    ).textContent =
    formatNumber(
        totalReviews
    );


    document.getElementById(
        "trainerRatingText"
    ).textContent =

    averageRating +

    " (" +

    formatNumber(totalReviews) +

    " Reviews)";

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

    document.title =

    trainer.name +

    " Courses & Coupons | CourseCoupon";


    const description =

    "Explore "

    +

    trainerCourses.length

    +

    " online courses by "

    +

    trainer.name

    +

    ". Get the latest Udemy coupons, ratings, reviews and discounts on CourseCoupon.";


    document
    .querySelector(

        'meta[name="description"]'

    )
    .setAttribute(

        "content",

        description

    );


    document
    .querySelector(

        'meta[property="og:title"]'

    )
    .setAttribute(

        "content",

        document.title

    );


    document
    .querySelector(

        'meta[property="og:description"]'

    )
    .setAttribute(

        "content",

        description

    );


    document
    .querySelector(

        'meta[property="og:url"]'

    )
    .setAttribute(

        "content",

        window.location.href

    );


    if(

        trainer.photo &&
        trainer.photo.trim() !== ""

    ){

        document
        .querySelector(

            'meta[property="og:image"]'

        )
        .setAttribute(

            "content",

            trainer.photo

        );

    }


    document
    .getElementById(
        "canonicalLink"
    )
    .href =
    window.location.href;

}



/*
==================================================
ERROR
==================================================
*/

function showError(message){

    document.getElementById(
        "courseGrid"
    ).innerHTML =

    `

    <h2 style="text-align:center;">

        ${message}

    </h2>

    `;

}

/*
==================================================
SETUP EVENTS
==================================================
*/

function setupEvents(){

    document
    .getElementById("courseSearch")
    .addEventListener(
        "input",
        searchCourses
    );

    document
    .getElementById("sortCourses")
    .addEventListener(
        "change",
        sortCourses
    );

}



/*
==================================================
SEARCH COURSES
==================================================
*/

function searchCourses(){

    const keyword =

    document
    .getElementById("courseSearch")
    .value
    .trim()
    .toLowerCase();


    filteredCourses =

    trainerCourses.filter(course=>{

        return (

            course.title
            .toLowerCase()
            .includes(keyword)

        );

    });


    currentPage = 1;

    sortCourses();

}



/*
==================================================
SORT COURSES
==================================================
*/

function sortCourses(){

    const sort =

    document
    .getElementById("sortCourses")
    .value;


    switch(sort){

        case "rating":

            filteredCourses.sort(

                (a,b)=>

                Number(b.rating) -

                Number(a.rating)

            );

        break;



        case "students":

            filteredCourses.sort(

                (a,b)=>

                Number(b.students) -

                Number(a.students)

            );

        break;



        case "reviews":

            filteredCourses.sort(

                (a,b)=>

                Number(b.reviews) -

                Number(a.reviews)

            );

        break;



        case "name":

            filteredCourses.sort(

                (a,b)=>

                a.title.localeCompare(b.title)

            );

        break;



        default:

            filteredCourses.sort(

                (a,b)=>

                new Date(b.last_updated)

                -

                new Date(a.last_updated)

            );

    }


    renderCourses();

}



/*
==================================================
RENDER COURSES
==================================================
*/

function renderCourses(){

    const grid =

    document.getElementById(
        "courseGrid"
    );


    grid.innerHTML = "";


    if(filteredCourses.length===0){

        grid.innerHTML =

        `

        <div class="no-results">

            <h2>

                No courses found

            </h2>

        </div>

        `;

        document.getElementById(
            "pagination"
        ).innerHTML = "";

        return;

    }


    const start =

    (currentPage-1)

    *

    coursesPerPage;


    const end =

    start +

    coursesPerPage;


    filteredCourses

    .slice(start,end)

    .forEach(course=>{

        grid.innerHTML +=

        createCourseCard(course);

    });


    renderPagination();

}



/*
==================================================
PAGINATION
==================================================
*/

function renderPagination(){

    const container =

    document.getElementById(
        "pagination"
    );


    container.innerHTML = "";


    const totalPages =

    Math.ceil(

        filteredCourses.length /

        coursesPerPage

    );


    if(totalPages<=1){

        return;

    }


    /*
    PREVIOUS
    */

    const previous =

    document.createElement("button");

    previous.innerHTML = "&laquo;";

    previous.disabled = currentPage===1;

    previous.onclick = function(){

        currentPage--;

        renderCourses();

        scrollToCourses();

    };

    container.appendChild(previous);


    /*
    PAGE NUMBERS
    */

    for(

        let i=1;

        i<=totalPages;

        i++

    ){

        const button =

        document.createElement("button");

        button.textContent = i;

        if(i===currentPage){

            button.classList.add("active");

        }

        button.onclick = function(){

            currentPage = i;

            renderCourses();

            scrollToCourses();

        };

        container.appendChild(button);

    }


    /*
    NEXT
    */

    const next =

    document.createElement("button");

    next.innerHTML = "&raquo;";

    next.disabled =

    currentPage===totalPages;

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

    document
    .querySelector(".courses-section")
    .scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}



/*
==================================================
INITIALIZE
==================================================
*/

loadTrainerPage();