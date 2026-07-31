/*=========================================================
    LANGUAGE.JS
    Part 1
=========================================================*/

"use strict";


/*=========================================================
    GLOBAL VARIABLES
=========================================================*/

let languages = [];

let trainers = [];

let categories = [];

let courses = [];

let language = null;

let languageCourses = [];



/*=========================================================
    DOM ELEMENTS
=========================================================*/

const languageName =
    document.getElementById("languageName");


const languageDescription =
    document.getElementById("languageDescription");


const languageImage =
    document.getElementById("languageImage");


const totalCourses =
    document.getElementById("totalCourses");


const totalTrainers =
    document.getElementById("totalTrainers");


const totalCategories =
    document.getElementById("totalCategories");


const averageRating =
    document.getElementById("averageRating");


const searchCourse =
    document.getElementById("searchCourse");


const sortCourses =
    document.getElementById("sortCourses");


const loadingCourses =
    document.getElementById("loadingCourses");


const noCourses =
    document.getElementById("noCourses");


const courseContainer =
    document.getElementById("courseContainer");


const courseTemplate =
    document.getElementById("courseTemplate");



/*=========================================================
    GET LANGUAGE FROM URL
=========================================================*/

const urlParams =
    new URLSearchParams(window.location.search);


const languageSlug =
    urlParams.get("language");



/*=========================================================
    LOAD JSON DATA
=========================================================*/

async function loadData(){

    try{


        showLoading();



        const [

            languageResponse,

            trainerResponse,

            categoryResponse,

            courseResponse


        ] = await Promise.all([


            fetch("data/languages.json"),


            fetch("data/trainers.json"),


            fetch("data/categories.json"),


            fetch("data/courses.json")


        ]);



        if(!languageResponse.ok)

            throw new Error(
                "Unable to load languages.json"
            );



        if(!trainerResponse.ok)

            throw new Error(
                "Unable to load trainers.json"
            );



        if(!categoryResponse.ok)

            throw new Error(
                "Unable to load categories.json"
            );



        if(!courseResponse.ok)

    throw new Error(
        "Unable to load courses.json"
    );


languages =
    await languageResponse.json();


trainers =
    await trainerResponse.json();


categories =
    await categoryResponse.json();


courses =
    await courseResponse.json();


initializePage();


    }

    catch(error){


        console.error(
            "Language Error:",
            error
        );


        hideLoading();


        noCourses.classList.remove(
            "d-none"
        );


        noCourses.innerHTML = `

            <i class="bi bi-exclamation-triangle display-3 text-danger"></i>

            <h3 class="mt-4">

                Failed to Load Data

            </h3>


            <p class="text-muted">

                Please check your JSON files.

            </p>

        `;


    }

}



/*=========================================================
    INITIALIZE PAGE
=========================================================*/

function initializePage(){

    console.log("Languages:", languages);

console.log("URL Slug:", languageSlug);

    language =
        languages.find(item =>

            item.slug === languageSlug

        );



    if(!language){


        hideLoading();


        noCourses.classList.remove(
            "d-none"
        );



        noCourses.innerHTML = `

            <i class="bi bi-folder-x display-3 text-warning"></i>

            <h3 class="mt-4">

                Language Not Found

            </h3>


            <p class="text-muted">

                Invalid language URL.

            </p>

        `;


        return;


    }



    languageCourses =
        courses.filter(course =>


            course.language_slug === language.slug


        );



    displayLanguage();


    displayStatistics();


    displayCourses(languageCourses);


    registerEvents();


}



/*=========================================================
    LOADING FUNCTIONS
=========================================================*/

function showLoading(){


    if(loadingCourses)

        loadingCourses.style.display =
            "block";


}



function hideLoading(){


    if(loadingCourses)

        loadingCourses.style.display =
            "none";


}



/*=========================================================
    START APPLICATION
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadData();

    }

);

/*=========================================================
    DISPLAY LANGUAGE DETAILS
=========================================================*/

function displayLanguage(){


    /*
    -----------------------------------------
        Update Browser Title
    -----------------------------------------
    */

    document.title =

        `${language.name} Courses | CourseCoupon`;



    /*
    -----------------------------------------
        Update Meta Description
    -----------------------------------------
    */

    const metaDescription =

        document.querySelector(
            'meta[name="description"]'
        );


    if(metaDescription){


        metaDescription.setAttribute(

            "content",

            language.description ||

            `Browse the best ${language.name} Udemy courses.`

        );


    }



    /*
    -----------------------------------------
        Language Name
    -----------------------------------------
    */


    languageName.textContent =

        language.name;



    /*
    -----------------------------------------
        Language Description
    -----------------------------------------
    */


    languageDescription.textContent =

        language.description ||

        "Browse courses available in this language.";



    /*
    -----------------------------------------
        Language Image
    -----------------------------------------
    */


    languageImage.src =

        language.image ||

        "assets/images/languages/default-language.png";



    languageImage.alt =

        language.name;



    languageImage.onerror = function(){


        this.src =

        "assets/images/languages/default-language.png";


    };


}



/*=========================================================
    DISPLAY STATISTICS
=========================================================*/

function displayStatistics(){


    /*
    -----------------------------------------
        Total Courses
    -----------------------------------------
    */


    totalCourses.textContent =

        languageCourses.length;



    /*
    -----------------------------------------
        Total Trainers
    -----------------------------------------
    */


    const trainerSet = new Set();



    languageCourses.forEach(course => {


        trainerSet.add(

            course.trainer_slug

        );


    });



    totalTrainers.textContent =

        trainerSet.size;



    /*
    -----------------------------------------
        Total Categories
    -----------------------------------------
    */


    const categorySet = new Set();



    languageCourses.forEach(course => {


        categorySet.add(

            course.category_slug

        );


    });



    totalCategories.textContent =

        categorySet.size;



    /*
    -----------------------------------------
        Average Rating
    -----------------------------------------
    */


    let totalRating = 0;



    languageCourses.forEach(course => {


        totalRating +=

            Number(course.rating) || 0;


    });



    const avgRating =


        languageCourses.length > 0


        ?


        (

            totalRating /

            languageCourses.length


        ).toFixed(1)


        :


        "0.0";



    averageRating.textContent =

        avgRating;


}

/*=========================================================
    DISPLAY COURSES
=========================================================*/

function displayCourses(courseList){


    hideLoading();


    courseContainer.innerHTML = "";



    /*
    -----------------------------------------
        No Courses Found
    -----------------------------------------
    */


    if(courseList.length === 0){


        noCourses.classList.remove(
            "d-none"
        );



        noCourses.innerHTML = `

            <i class="bi bi-folder-x display-3 text-secondary"></i>

            <h3 class="mt-4">

                No Courses Found

            </h3>


            <p class="text-muted">

                No courses available in this language.

            </p>

        `;



        return;


    }



    noCourses.classList.add(
        "d-none"
    );



    /*
    -----------------------------------------
        Create Course Cards
    -----------------------------------------
    */


    courseList.forEach(course => {



        const clone =

            courseTemplate.content.cloneNode(true);



        /*
        -----------------------------
            Image
        -----------------------------
        */


        const image =

            clone.querySelector(
                ".course-image"
            );



        image.src =

            course.image;



        image.alt =

            course.title;



        image.loading =

            "lazy";



        image.onerror = function(){


            this.src =

            "assets/images/course-placeholder.jpg";


        };



        /*
        -----------------------------
            Language Badge
        -----------------------------
        */


        clone.querySelector(
            ".language-badge"
        ).textContent =

            language.name;



        /*
        -----------------------------
            Title
        -----------------------------
        */


        clone.querySelector(
            ".course-title"
        ).textContent =

            course.title;



        /*
        -----------------------------
            Description
        -----------------------------
        */


        clone.querySelector(
            ".course-description"
        ).textContent =

            course.description;



        /*
        -----------------------------
            Rating
        -----------------------------
        */


        clone.querySelector(
            ".course-rating"
        ).textContent =

            Number(course.rating)
            .toFixed(1);



        /*
        -----------------------------
            Duration
        -----------------------------
        */


        clone.querySelector(
            ".course-duration"
        ).textContent =

            course.duration;



        /*
        -----------------------------
            Affiliate Button
        -----------------------------
        */


        const button =

            clone.querySelector(
                ".course-button"
            );



        button.href =

            course.affiliate_url;



        button.target =

            "_blank";



        button.rel =

            "noopener noreferrer sponsored";



        /*
        -----------------------------
            Add Card
        -----------------------------
        */


        courseContainer.appendChild(
            clone
        );


    });


}



/*=========================================================
    FILTER COURSES
=========================================================*/

function filterCourses(keyword){


    keyword =

        keyword
        .trim()
        .toLowerCase();



    const filteredCourses =

        languageCourses.filter(course => {



            return (

                course.title

                .toLowerCase()

                .includes(keyword)



                ||



                course.description

                .toLowerCase()

                .includes(keyword)


            );


        });



    displayCourses(
        filteredCourses
    );


}

/*=========================================================
    REGISTER EVENTS
=========================================================*/

function registerEvents(){


    /*
    -----------------------------------------
        Search Event
    -----------------------------------------
    */


    if(searchCourse){


        searchCourse.addEventListener(

            "keyup",

            function(){


                filterCourses(
                    this.value
                );


            }

        );


    }



    /*
    -----------------------------------------
        Sort Event
    -----------------------------------------
    */


    if(sortCourses){


        sortCourses.addEventListener(

            "change",

            function(){


                sortCourseList(
                    this.value
                );


            }

        );


    }



    /*
    -----------------------------------------
        Back To Top
    -----------------------------------------
    */


    const backToTop =

        document.getElementById(
            "backToTop"
        );



    if(backToTop){


        window.addEventListener(

            "scroll",

            function(){


                if(window.scrollY > 300){


                    backToTop.style.display =
                        "flex";


                }

                else{


                    backToTop.style.display =
                        "none";


                }


            }

        );



        backToTop.addEventListener(

            "click",

            function(){


                window.scrollTo({


                    top:0,

                    behavior:"smooth"


                });


            }

        );


    }



    /*
    -----------------------------------------
        Footer Year
    -----------------------------------------
    */


    const currentYear =

        document.getElementById(
            "currentYear"
        );



    if(currentYear){


        currentYear.textContent =

            new Date().getFullYear();


    }


}



/*=========================================================
    SORT COURSES
=========================================================*/

function sortCourseList(type){


    let sortedCourses =

        [...languageCourses];



    switch(type){



        case "rating":


            sortedCourses.sort(

                (a,b)=>


                Number(b.rating)

                -

                Number(a.rating)


            );


        break;



        case "title":


            sortedCourses.sort(

                (a,b)=>

                a.title.localeCompare(
                    b.title
                )

            );


        break;



        case "duration":


            sortedCourses.sort(

                (a,b)=>{


                    const durationA =

                        parseFloat(
                            a.duration
                        ) || 0;



                    const durationB =

                        parseFloat(
                            b.duration
                        ) || 0;



                    return durationB - durationA;


                }


            );


        break;



        default:


            sortedCourses =

                [...languageCourses];


        break;


    }



    displayCourses(
        sortedCourses
    );


}



/*=========================================================
    FORMAT NUMBER
=========================================================*/

function formatNumber(number){


    number = Number(number);



    if(number >= 1000000){


        return (

            number / 1000000

        ).toFixed(1) + "M";


    }



    if(number >= 1000){


        return (

            number / 1000

        ).toFixed(1) + "K";


    }



    return number;


}



/*=========================================================
    FORMAT RATING
=========================================================*/

function formatRating(rating){


    return Number(rating)

        .toFixed(1);


}



/*=========================================================
    DEBUG
=========================================================*/


console.log(

    "%cCourseCoupon Language Page Loaded",

    "color:#2563EB;font-size:16px;font-weight:bold;"

);


console.log(

    "Language:",

    languageSlug

);