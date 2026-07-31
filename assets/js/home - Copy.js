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

        <div style="
        text-align:center;
        color:red;
        padding:30px;
        ">

        Failed to load data.
        Please check JSON files.

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


function displayLatestCourses(){

    let container =
    document.getElementById(
        "latestCourses"
    );


    container.innerHTML="";


    courses
    .slice(0,8)
    .forEach(course=>{


        container.innerHTML += `

<div class="course-card">

    <img
    src="${course.image}"
    alt="${course.title}">

    <div class="course-card-content">

        <h3>${course.title}</h3>

        <p>
        📂
        <a href="category.html?category=${course.category_slug}">
        ${course.category}
        </a>
        </p>

        <p>⏱ ${course.duration}</p>

        <p>⭐ ${course.rating}</p>

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
        rel="noopener">

        Get Coupon

        </a>

    </div>

</div>

`;


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

            alt="${language.name}">



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

        alert("Please enter a search keyword.");

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
    START
====================================================
*/


loadHomeData();