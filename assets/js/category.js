/*
==================================================
CATEGORY PAGE
CourseCoupon
==================================================
*/



/*
==================================================
GLOBAL VARIABLES
==================================================
*/

let allCourses = [];

let allTrainers = [];

let categoryCourses = [];

let filteredCourses = [];

let currentCategorySlug = "";

let currentCategoryName = "";

let currentPage = 1;

const COURSES_PER_PAGE = 12;







/*
==================================================
INITIALIZE
==================================================
*/

async function initializeCategoryPage(){

    try{

        await loadJsonFiles();

        getCategoryFromURL();

        filterCategoryCourses();

        if(categoryCourses.length===0){

            showMessage(

                "No courses found for this category."

            );

            return;

        }
        buildCategoryPage();

    }

    catch(error){

        console.error(error);

        showMessage(

            "Unable to load category."

        );

    }

}



/*
==================================================
LOAD JSON FILES
==================================================
*/

async function loadJsonFiles(){

    const coursesResponse =

    await fetch(

        "data/courses.json"

    );


    if(!coursesResponse.ok){

        throw new Error(

            "courses.json not found."

        );

    }


    allCourses =

    await coursesResponse.json();



    const trainersResponse =

    await fetch(

        "data/trainers.json"

    );


    if(!trainersResponse.ok){

        throw new Error(

            "trainers.json not found."

        );

    }


    allTrainers =

    await trainersResponse.json();

}



/*
==================================================
GET CATEGORY
==================================================
*/

function getCategoryFromURL(){

    const params =

    new URLSearchParams(

        window.location.search

    );


    currentCategorySlug =

    params.get("category") || "";

}



/*
==================================================
FILTER COURSES
==================================================
*/

function filterCategoryCourses(){

    categoryCourses =

    allCourses.filter(course=>{

        if(

            Array.isArray(

                course.category_slug

            )

        ){

            return course.category_slug.includes(

                currentCategorySlug

            );

        }

        return (

            course.category_slug===

            currentCategorySlug

        );

    });



    filteredCourses =

    [...categoryCourses];



    if(categoryCourses.length){

        if(

            Array.isArray(

                categoryCourses[0].category

            )

        ){

            const index =

            categoryCourses[0]

            .category_slug

            .indexOf(

                currentCategorySlug

            );


            currentCategoryName =

            categoryCourses[0]

            .category[index];

        }

        else{

            currentCategoryName =

            categoryCourses[0]

            .category;

        }

    }

}



/*
==================================================
MESSAGE
==================================================
*/

function showMessage(text){

    const grid =

    document.getElementById(

        "courseGrid"

    );


    if(!grid){

        return;

    }


    grid.innerHTML =

    `

    <div class="no-results">

        <h2>

            ${text}

        </h2>

    </div>

    `;

}
/*
==================================================
BUILD PAGE
==================================================
*/

function buildCategoryPage(){

    loadHero();

    loadStatistics();

    updateSEO();

    renderSEOContent();

}



/*
==================================================
HERO
==================================================
*/

function loadHero(){

    document.getElementById(
        "categoryName"
    ).textContent =
    currentCategoryName +  " Course Coupons ";


    document.getElementById(
        "categoryTitle"
    ).textContent =
    currentCategoryName + " Course Coupons ";


    document.getElementById(
        "seoCategoryName"
    ).textContent =
    currentCategoryName; 


    document.getElementById(
        "categoryDescription"
    ).textContent =

    "Discover the best " +

    currentCategoryName +

    " courses with verified Udemy coupons, expert instructors and regular updates.";


    loadCategoryIcon();

}



/*
==================================================
CATEGORY ICON
==================================================
*/

function loadCategoryIcon(){

    const icons={

        ai:"🤖",

        python:"🐍",

        javascript:"⚡",

        java:"☕",

        php:"🐘",

        html:"🌐",

        css:"🎨",

        react:"⚛️",

        angular:"🅰️",

        nodejs:"🟢",

        flutter:"📱",

        android:"🤖",

        ios:"🍎",

        excel:"📊",

        sql:"🗄️",

        database:"💾",

        aws:"☁️",

        azure:"☁️",

        cloud:"☁️",

        docker:"🐳",

        kubernetes:"⚙️",

        devops:"🚀",

        cybersecurity:"🔐",

        networking:"🌍",

        machine_learning:"🧠",

        chatgpt:"💬"

    };


    document.getElementById(
        "categoryIcon"
    ).textContent =

    icons[currentCategorySlug]

    ||

    "📚";

}



/*
==================================================
STATISTICS
==================================================
*/

function loadStatistics(){

    let totalStudents = 0;

    let totalRating = 0;

    let totalReviews = 0;

    const trainerSet = new Set();


    categoryCourses.forEach(course=>{

        totalStudents +=

        Number(course.students)||0;


        totalRating +=

        Number(course.rating)||0;


        totalReviews +=

        Number(course.reviews)||0;


        trainerSet.add(

            course.trainer_slug

        );

    });


    const average =

    categoryCourses.length

    ?

    (

        totalRating /

        categoryCourses.length

    ).toFixed(1)

    :

    "0.0";


    document.getElementById(
        "courseCount"
    ).textContent =
    categoryCourses.length;


    document.getElementById(
        "trainerCount"
    ).textContent =
    trainerSet.size;


    document.getElementById(
        "studentCount"
    ).textContent =
    formatNumber(totalStudents);


    document.getElementById(
        "avgRating"
    ).textContent =
    average;

}



/*
==================================================
SEO
==================================================
*/

function updateSEO(){

    const title =

        currentCategoryName +

        " Courses | CourseCoupon";


    const description =

        "Browse the latest " +

        currentCategoryName +

        " Udemy courses with verified coupons, ratings and expert instructors.";


    document.title = title;


    setMeta(

        "description",

        description

    );


    setOG(

        "og:title",

        title

    );


    setOG(

        "og:description",

        description

    );


    setOG(

        "og:url",

        window.location.href

    );


    document.getElementById(

        "canonicalLink"

    ).href =

    window.location.href;

}



/*
==================================================
SEO CONTENT
==================================================
*/

function renderSEOContent(){

    const box =

    document.getElementById(

        "seoContent"

    );


    if(!box){

        return;

    }


    box.innerHTML =

    `

    <p>

    Explore the latest

    <strong>${currentCategoryName}</strong>

    courses with verified Udemy coupons,

    updated ratings,

    experienced instructors,

    and frequently refreshed discounts.

    Compare the best courses

    before enrolling.

    </p>

    `;

}



/*
==================================================
META
==================================================
*/

function setMeta(name,value){

    const meta =

    document.querySelector(

        'meta[name="'+name+'"]'

    );


    if(meta){

        meta.setAttribute(

            "content",

            value

        );

    }

}



/*
==================================================
OPEN GRAPH
==================================================
*/

function setOG(name,value){

    const meta =

    document.querySelector(

        'meta[property="'+name+'"]'

    );


    if(meta){

        meta.setAttribute(

            "content",

            value

        );

    }

}



/*
==================================================
FORMAT NUMBER
==================================================
*/

function formatNumber(number){

    return Number(

        number||0

    ).toLocaleString();

}
/*
==================================================
BIND EVENTS
==================================================
*/

function bindEvents(){

    const searchBox = document.getElementById("courseSearch");

    if(searchBox){

        searchBox.addEventListener(

            "input",

            searchCourses

        );

    }


    const sortBox = document.getElementById("sortCourses");

    if(sortBox){

        sortBox.addEventListener(

            "change",

            sortCourses

        );

    }

}



/*
==================================================
SEARCH
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

        categoryCourses.filter(course=>{

            return (

                course.title
                .toLowerCase()
                .includes(keyword)

                ||

                course.description
                .toLowerCase()
                .includes(keyword)

                ||

                course.trainer
                .toLowerCase()
                .includes(keyword)

            );

        });


    currentPage = 1;

    sortCourses();

}



/*
==================================================
SORT
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

                Number(b.rating)-

                Number(a.rating)

            );

        break;



        case "students":

            filteredCourses.sort(

                (a,b)=>

                Number(b.students)-

                Number(a.students)

            );

        break;



        case "reviews":

            filteredCourses.sort(

                (a,b)=>

                Number(b.reviews)-

                Number(a.reviews)

            );

        break;



        case "name":

            filteredCourses.sort(

                (a,b)=>

                a.title.localeCompare(

                    b.title

                )

            );

        break;



        default:

            filteredCourses.sort(

                (a,b)=>

                new Date(

                    b.last_updated

                )

                -

                new Date(

                    a.last_updated

                )

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

                No Courses Found

            </h2>

        </div>

        `;

        return;

    }


    const start =

        (currentPage-1)

        *

        COURSES_PER_PAGE;


    const end =

        start +

        COURSES_PER_PAGE;


    const pageCourses =

        filteredCourses.slice(

            start,

            end

        );


    pageCourses.forEach(course=>{

        if(

            typeof createCourseCard ===

            "function"

        ){

            grid.innerHTML +=

                createCourseCard(course);

        }

        else{

            grid.innerHTML +=

            fallbackCourseCard(course);

        }

    });


    renderPagination();

}



/*
==================================================
FALLBACK CARD
==================================================
*/

function fallbackCourseCard(course){

    return `

    <div class="course-card">

        <img

        src="${course.image}"

        alt="${course.title}">

        <div class="course-card-content">

            <h3>

                ${course.title}

            </h3>

            <p>

                ⭐ ${course.rating}

            </p>

            <p>

                👨‍🏫 ${course.trainer}

            </p>

            <a

            class="coupon-btn"

            href="${course.affiliate_url}"

            target="_blank">

                Get Coupon

            </a>

        </div>

    </div>

    `;

}
/*
==================================================
TOP TRAINERS
==================================================
*/

function renderTopTrainers(){

    const container =
    document.getElementById("trainerGrid");

    if(!container) return;

    container.innerHTML = "";

    const trainers = {};

    categoryCourses.forEach(course=>{

        if(!trainers[course.trainer_slug]){

            trainers[course.trainer_slug]={

                name:course.trainer,

                slug:course.trainer_slug,

                courses:0

            };

        }

        trainers[course.trainer_slug].courses++;

    });


    Object.values(trainers)

    .sort((a,b)=>b.courses-a.courses)

    .slice(0,8)

    .forEach(item=>{

        const trainer =

        allTrainers.find(

            t=>t.slug===item.slug

        );


        const image =

            trainer?.photo ||

            trainer?.image ||

            "assets/images/defaults/trainer.png";


        container.innerHTML +=

        `

        <a

        href="trainer.html?trainer=${item.slug}"

        class="trainer-item">

            <img

            src="${image}"

            alt="${item.name}">

            <h3>

                ${item.name}

            </h3>

            <p>

                ${item.courses}

                Courses

            </p>

        </a>

        `;

    });

}



/*
==================================================
RELATED CATEGORIES
==================================================
*/

function renderRelatedCategories(){

    const container =

    document.getElementById(

        "relatedCategories"

    );

    if(!container) return;

    container.innerHTML="";


    const categories={};


    allCourses.forEach(course=>{

        if(Array.isArray(course.category_slug)){

            course.category_slug.forEach(

                (slug,index)=>{

                    if(slug!==currentCategorySlug){

                        categories[slug]=

                        course.category[index];

                    }

                }

            );

        }

    });


    Object.entries(categories)

    .slice(0,10)

    .forEach(item=>{

        container.innerHTML +=

        `

        <a

        class="related-tag"

        href="category.html?category=${item[0]}">

            ${item[1]}

        </a>

        `;

    });

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

    if(!container) return;

    container.innerHTML="";


    const totalPages =

    Math.ceil(

        filteredCourses.length/

        COURSES_PER_PAGE

    );


    if(totalPages<=1){

        return;

    }


    for(

        let i=1;

        i<=totalPages;

        i++

    ){

        const button=

        document.createElement(

            "button"

        );

        button.textContent=i;

        button.className=

        i===currentPage

        ?

        "active"

        :

        "";


        button.onclick=function(){

            currentPage=i;

            renderCourses();

            window.scrollTo({

                top:450,

                behavior:"smooth"

            });

        };


        container.appendChild(

            button

        );

    }

}



/*
==================================================
INITIALIZE REMAINING
==================================================
*/

function initializePage(){

    bindEvents();

    renderCourses();

    renderTopTrainers();

    renderRelatedCategories();

}



/*
==================================================
START
==================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    async function(){

        await initializeCategoryPage();

        initializePage();

    }

);