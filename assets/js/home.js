
/*
====================================================
    COURSECOUPON HOME PAGE
====================================================
*/


let courses = [];

let trainers = [];

let categories = [];

let languages = [];


/*
====================================================
    PAGINATION SETTINGS
====================================================
*/

const COURSES_PER_PAGE = 16;

let latestCoursesData = [];

let currentCoursePage = 1;


/*
====================================================
    LOAD JSON DATA
====================================================
*/


async function loadHomeData(){


    try{


        let [

            courseResponse,

            trainerResponse,

            categoryResponse,

            languageResponse


        ] = await Promise.all([


            fetch("data/courses.json"),

            fetch("data/trainers.json"),

            fetch("data/categories.json"),

            fetch("data/languages.json")


        ]);



        if(

            !courseResponse.ok ||

            !trainerResponse.ok ||

            !categoryResponse.ok ||

            !languageResponse.ok

        ){


            throw new Error(
                "Unable to load JSON files"
            );


        }



        courses =
        await courseResponse.json();


        trainers =
        await trainerResponse.json();


        categories =
        await categoryResponse.json();


        languages =
        await languageResponse.json();



        initializeHome();


    }


    catch(error){


        console.error(
            "Home Error:",
            error
        );


        document.body.innerHTML +=


        `

        <div class="load-error">

            <h3>Couldn't load the coupons</h3>

            <p>
                The course data didn't come through.
                Check that the JSON files exist and try again.
            </p>

        </div>

        `;


    }



}


/*
====================================================
    INITIALIZE PAGE
====================================================
*/


function initializeHome(){


    displayStatistics();


    displayLatestCourses();


    displayCategories();


    displayTrainers();


    displayLanguages();


}


/*
====================================================
    STATISTICS
====================================================
*/


function displayStatistics(){


    document.getElementById(
        "courseCount"
    ).innerText =
    courses.length;


    document.getElementById(
        "trainerCount"
    ).innerText =
    trainers.length;


    document.getElementById(
        "categoryCount"
    ).innerText =
    categories.length;


    document.getElementById(
        "languageCount"
    ).innerText =
    languages.length;


}


/*
====================================================
    LATEST COURSES
====================================================
*/


function displayLatestCourses() {


    const container =
        document.getElementById("latestCourses");

    const pagination =
        document.getElementById("latestCoursesPagination");


    if (!container) return;


    container.innerHTML = "";


    if (pagination) {
        pagination.innerHTML = "";
    }


    if (!courses.length) {
        return;
    }


    /*
    -----------------------------------------------
        FIND LATEST UPDATE DATE
    -----------------------------------------------
    */


    const latestDate = courses.reduce((latest, course) => {

        return new Date(course.last_updated) > new Date(latest)
            ? course.last_updated
            : latest;

    }, courses[0].last_updated);


    /*
    -----------------------------------------------
        GET ALL COURSES FROM LATEST DATE
    -----------------------------------------------
    */


    latestCoursesData = courses.filter(course => {

        return course.last_updated === latestDate;

    });


    /*
    -----------------------------------------------
        RANDOMIZE COURSES ONCE
    -----------------------------------------------
    */

    latestCoursesData.sort(() => Math.random() - 0.5);


    /*
    -----------------------------------------------
        RESET PAGE
    -----------------------------------------------
    */

    currentCoursePage = 1;


    /*
    -----------------------------------------------
        DISPLAY FIRST PAGE
    -----------------------------------------------
    */

    renderLatestCoursesPage();


}


/*
====================================================
    RENDER LATEST COURSES PAGE
====================================================
*/


function renderLatestCoursesPage() {


    const container =
        document.getElementById("latestCourses");


    if (!container) return;


    container.innerHTML = "";


    /*
    -----------------------------------------------
        CALCULATE START / END
    -----------------------------------------------
    */


    const startIndex =
        (currentCoursePage - 1) *
        COURSES_PER_PAGE;


    const endIndex =
        startIndex +
        COURSES_PER_PAGE;


    const pageCourses =
        latestCoursesData.slice(
            startIndex,
            endIndex
        );


    /*
    -----------------------------------------------
        DISPLAY COURSES
    -----------------------------------------------
    */


    pageCourses.forEach(course => {


        container.innerHTML += `

            <div class="course-card">

                <img
                    src="${course.image}"
                    alt="${course.title}"
                >

                <div class="course-card-content">

                    <h3>
                        ${course.title}
                    </h3>


                    <p>
                        📂
                        <a href="category.html?category=${course.category_slug}">
                            ${course.category}
                        </a>
                    </p>


                    <p>
                        ⏱ ${course.duration}
                    </p>


                    <p>
                        ⭐ ${course.rating}
                    </p>


                    <p>
                        👨‍🏫
                        <a href="trainer.html?trainer=${course.trainer_slug}">
                            ${course.trainer}
                        </a>
                    </p>


                    <a
                        class="coupon-btn"
                        href="${course.affiliate_url}"
                        target="_blank"
                        rel="noopener"
                    >
                        Get Coupon
                    </a>

                </div>

            </div>

        `;


    });


    /*
    -----------------------------------------------
        CREATE PAGINATION
    -----------------------------------------------
    */


    renderLatestCoursesPagination();


}


/*
====================================================
    LATEST COURSES PAGINATION
====================================================
*/


function renderLatestCoursesPagination() {


    const pagination =
        document.getElementById(
            "latestCoursesPagination"
        );


    if (!pagination) return;


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            latestCoursesData.length /
            COURSES_PER_PAGE
        );


    /*
    -----------------------------------------------
        DON'T SHOW PAGINATION IF ONLY ONE PAGE
    -----------------------------------------------
    */


    if (totalPages <= 1) {
        return;
    }


    /*
    -----------------------------------------------
        PAGINATION WRAPPER
    -----------------------------------------------
    */


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "pagination-inner";


    /*
    -----------------------------------------------
        PREVIOUS BUTTON
    -----------------------------------------------
    */


    const previousButton =
        document.createElement("button");


    previousButton.className =
        "pagination-btn";


    previousButton.innerHTML =
        "← Previous";


    previousButton.disabled =
        currentCoursePage === 1;


    previousButton.addEventListener(
        "click",
        () => {

            if (currentCoursePage > 1) {

                currentCoursePage--;

                renderLatestCoursesPage();

                scrollToLatestCourses();

            }

        }
    );


    wrapper.appendChild(previousButton);


    /*
    -----------------------------------------------
        PAGE NUMBERS
    -----------------------------------------------
    */


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {


        const pageButton =
            document.createElement("button");


        pageButton.className =
            "pagination-btn";


        pageButton.innerText =
            page;


        if (
            page === currentCoursePage
        ) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            () => {

                currentCoursePage =
                    page;

                renderLatestCoursesPage();

                scrollToLatestCourses();

            }
        );


        wrapper.appendChild(pageButton);


    }


    /*
    -----------------------------------------------
        NEXT BUTTON
    -----------------------------------------------
    */


    const nextButton =
        document.createElement("button");


    nextButton.className =
        "pagination-btn";


    nextButton.innerHTML =
        "Next →";


    nextButton.disabled =
        currentCoursePage === totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentCoursePage <
                totalPages
            ) {

                currentCoursePage++;

                renderLatestCoursesPage();

                scrollToLatestCourses();

            }

        }
    );


    wrapper.appendChild(nextButton);


    pagination.appendChild(wrapper);


}


/*
====================================================
    SCROLL TO LATEST COURSES
====================================================
*/


function scrollToLatestCourses() {


    const section =
        document.querySelector(
            ".courses-section"
        );


    if (!section) return;


    const headerOffset = 90;


    const position =
        section.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;


    window.scrollTo({

        top: position,

        behavior: "smooth"

    });


}


/*
====================================================
    CATEGORIES
====================================================
*/


function displayCategories(){


    let container =
        document.getElementById(
            "popularCategories"
        );


    container.innerHTML="";


    categories
    .slice(0,8)
    .forEach(category=>{


        container.innerHTML +=


        `

        <div class="category-card">


            <h3>

                ${category.name}

            </h3>


            <a href="category.html?category=${category.slug}">

                View Courses

            </a>


        </div>

        `;


    });


}


/*
====================================================
    TRAINERS
====================================================
*/


function displayTrainers(){


    let container =
        document.getElementById(
            "popularTrainers"
        );


    container.innerHTML="";


    trainers
    .slice(0,8)
    .forEach(trainer=>{


        container.innerHTML +=


        `

        <div class="trainer-card">


            <h3>

                ${trainer.name}

            </h3>


            <a href="trainer.html?trainer=${trainer.slug}">

                View Courses

            </a>


        </div>

        `;


    });


}


/*
====================================================
    LANGUAGES
====================================================
*/


function displayLanguages(){


    let container =
        document.getElementById(
            "popularLanguages"
        );


    container.innerHTML="";


    languages
    .slice(0,10)
    .forEach(language=>{


        container.innerHTML +=


        `

        <div class="language-card">


            <img

                src="${language.image}"

                alt="${language.name}"

            >


            <h3>

                ${language.name}

            </h3>


            <a href="language.html?language=${language.slug}">

                Explore

            </a>


        </div>

        `;


    });


}


/*
====================================================
    SEARCH COURSES
====================================================
*/


function goToSearch(){


    const keyword =
        document
        .getElementById("searchInput")
        .value
        .trim();


    const type =
        document
        .getElementById("homeSearchType")
        .value;


    if(keyword===""){


        alert(
            "Please enter a search keyword."
        );


        return;

    }


    window.location.href =
        "search.html?q=" +
        encodeURIComponent(keyword) +
        "&type=" +
        type;


}


/*
====================================================
    MOBILE NAV TOGGLE
====================================================
*/


function initNavToggle(){


    const toggle =
        document.getElementById(
            "navToggle"
        );


    const nav =
        document.getElementById(
            "mainNav"
        );


    if(!toggle || !nav) return;


    toggle.addEventListener(
        "click",
        () => {


            const isOpen =
                nav.classList.toggle(
                    "nav-open"
                );


            toggle.setAttribute(
                "aria-expanded",
                isOpen
            );


        }
    );


}


/*
====================================================
    START
====================================================
*/


initNavToggle();


loadHomeData();
