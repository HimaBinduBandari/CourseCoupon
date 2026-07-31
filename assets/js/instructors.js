/*
====================================================
    GLOBAL VARIABLES
====================================================
*/

let instructors = [];

let courses = [];

let filteredInstructors = [];

let currentPage = 1;

const ITEMS_PER_PAGE = 12;



/*====================================================
    PAGE LOAD
====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initPage

);



/*====================================================
    INITIALIZE
====================================================*/

async function initPage(){

    try{

        await loadData();

        calculateStatistics();

        filteredInstructors = [...instructors];

        bindEvents();

        sortInstructors();

    }

    catch(error){

        console.error(error);

    }

}



/*====================================================
    LOAD JSON
====================================================*/

async function loadData(){

    const trainerResponse = await fetch(

        "data/trainers.json"

    );

    instructors = await trainerResponse.json();



    const courseResponse = await fetch(

        "data/courses.json"

    );

    courses = await courseResponse.json();

}



/*====================================================
    CALCULATE STATISTICS
====================================================*/

function calculateStatistics(){

    instructors.forEach(instructor=>{

        const trainerCourses = courses.filter(

            course =>

            course.trainer_slug === instructor.slug

        );



        instructor.courseCount = trainerCourses.length;



        instructor.totalStudents = trainerCourses.reduce(

            (sum,course)=>

            sum + Number(course.students||0),

            0

        );



        instructor.averageRating = trainerCourses.length

        ?

        (

            trainerCourses.reduce(

                (sum,course)=>

                sum + Number(course.rating||0),

                0

            )

            /

            trainerCourses.length

        ).toFixed(1)

        :

        "0.0";



        instructor.topCategories = [];



        trainerCourses.forEach(course=>{

            if(Array.isArray(course.category)){

                course.category.forEach(cat=>{

                    if(

                        !instructor.topCategories.includes(cat)

                    ){

                        instructor.topCategories.push(cat);

                    }

                });

            }

        });



        instructor.topCategories =

        instructor.topCategories.slice(0,4);

    });



    updateHeroStatistics();

}



/*====================================================
    HERO STATS
====================================================*/

function updateHeroStatistics(){

    document.getElementById(

        "totalInstructors"

    ).textContent =

    instructors.length;



    document.getElementById(

        "totalCourses"

    ).textContent =

    courses.length;



    const avg =

    courses.length

    ?

    (

        courses.reduce(

            (sum,course)=>

            sum + Number(course.rating||0),

            0

        )

        /

        courses.length

    ).toFixed(1)

    :

    "0.0";



    document.getElementById(

        "averageRating"

    ).textContent = avg;



    const students =

    courses.reduce(

        (sum,course)=>

        sum + Number(course.students||0),

        0

    );



    document.getElementById(

        "totalStudents"

    ).textContent =

    formatNumber(students);

}



/*====================================================
    EVENTS
====================================================*/

function bindEvents(){

    document

    .getElementById(

        "searchInstructor"

    )

    .addEventListener(

        "input",

        searchInstructors

    );



    document

    .getElementById(

        "sortInstructor"

    )

    .addEventListener(

        "change",

        sortInstructors

    );

}



/*====================================================
    FORMAT NUMBER
====================================================*/

function formatNumber(number){

    return Number(number)

    .toLocaleString();

}
/*====================================================
    SEARCH
====================================================*/

function searchInstructors(){

    const keyword =

    document
    .getElementById("searchInstructor")
    .value
    .trim()
    .toLowerCase();


    filteredInstructors = instructors.filter(instructor=>{

        return (

            instructor.name.toLowerCase().includes(keyword)

            ||

            (instructor.designation || "")
            .toLowerCase()
            .includes(keyword)

            ||

            instructor.topCategories.join(" ")
            .toLowerCase()
            .includes(keyword)

        );

    });


    currentPage = 1;

    sortInstructors();

}



/*====================================================
    SORT
====================================================*/

function sortInstructors(){

    const sort =

    document
    .getElementById("sortInstructor")
    .value;


    switch(sort){

        case "rating":

            filteredInstructors.sort(

                (a,b)=>

                b.averageRating-a.averageRating

            );

        break;



        case "students":

            filteredInstructors.sort(

                (a,b)=>

                b.totalStudents-a.totalStudents

            );

        break;



        case "name":

            filteredInstructors.sort(

                (a,b)=>

                a.name.localeCompare(b.name)

            );

        break;



        default:

            filteredInstructors.sort(

                (a,b)=>

                b.courseCount-a.courseCount

            );

    }


    renderInstructors();

}



/*====================================================
    RENDER
====================================================*/

function renderInstructors(){

    const grid =

    document.getElementById("instructorGrid");


    grid.innerHTML = "";


    document.getElementById(

        "resultCount"

    ).textContent =

    filteredInstructors.length;


    if(filteredInstructors.length===0){

        grid.innerHTML=

        `

        <h2>

            No instructors found.

        </h2>

        `;

        return;

    }


    const start =

    (currentPage-1)

    *

    ITEMS_PER_PAGE;


    const end =

    start +

    ITEMS_PER_PAGE;


    filteredInstructors

    .slice(start,end)

    .forEach(instructor=>{

        grid.innerHTML +=

        createInstructorCard(

            instructor

        );

    });


    renderPagination();

}



/*====================================================
    CARD
====================================================*/

function createInstructorCard(instructor){

    const photo =
        instructor.photo ||
        instructor.image ||
        "";

    const website = instructor.website
        ? `<a href="${instructor.website}" target="_blank" class="social-btn">🌐 Website</a>`
        : "";

    const linkedin = instructor.linkedin
        ? `<a href="${instructor.linkedin}" target="_blank" class="social-btn">💼 LinkedIn</a>`
        : "";

    const initials = instructor.name
        ? instructor.name.charAt(0).toUpperCase()
        : "?";

    return `

<div class="instructor-card">

    <div class="card-top">

        <div class="profile-photo">

            ${
                photo
                ?
                `<img src="${photo}"
                      alt="${instructor.name}"
                      loading="lazy">`
                :
                `<div class="photo-placeholder">

                    ${initials}

                </div>`
            }

        </div>

        <div class="profile-info">

            <div class="name-rating">

                <h3>

                    ${instructor.name}

                </h3>

                <span class="rating-badge">

                    ⭐ ${instructor.averageRating}

                </span>

            </div>

            <p class="designation">

                ${instructor.designation || "Udemy Instructor"}

            </p>

            <div class="quick-stats">

                <span>

                    📚 ${instructor.courseCount} Courses

                </span>

                <span>

                    👨 ${formatNumber(instructor.totalStudents)} Students

                </span>

            </div>

            <div class="expertise">

                ${

                    instructor.topCategories
                    .slice(0,4)
                    .map(category=>`<span>${category}</span>`)
                    .join("")

                }

            </div>

        </div>

    </div>

    <div class="card-bottom">

        
        <a

            href="trainer.html?trainer=${instructor.slug}"

            class="profile-btn">

            View Instructor Coupons →

        </a>

    </div>

</div>

`;
}

/*====================================================
    PAGINATION
====================================================*/

function renderPagination(){

    const container =

    document.getElementById(

        "pagination"

    );


    container.innerHTML="";


    const totalPages =

    Math.ceil(

        filteredInstructors.length/

        ITEMS_PER_PAGE

    );


    if(totalPages<=1){

        return;

    }


    for(

        let i=1;

        i<=totalPages;

        i++

    ){

        const button =

        document.createElement(

            "button"

        );


        button.textContent=i;


        if(i===currentPage){

            button.classList.add(

                "active"

            );

        }


        button.onclick=function(){

            currentPage=i;

            renderInstructors();

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        };


        container.appendChild(

            button

        );

    }

}



/*====================================================
    SEO
====================================================*/

document.title =

"Top Udemy Instructors | CourseCoupon";


const canonical =

document.getElementById(

"canonicalLink"

);

if(canonical){

canonical.href =

window.location.href;

}