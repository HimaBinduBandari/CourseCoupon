/*
====================================================
    COURSE DETAIL PAGE
====================================================
*/


let courses = [];



/*
====================================================
    LOAD COURSE DATA
====================================================
*/


async function loadCourse(){


    try{


        let response = await fetch(
            "data/courses.json"
        );



        if(!response.ok){

            throw new Error(
                "Unable to load courses.json"
            );

        }



        courses = await response.json();



        displayCourse();



    }
    catch(error){


        console.error(
            "Course Error:",
            error
        );


        document.getElementById(
            "courseDetails"
        ).innerHTML =


        `

        <h2>
        Course Not Found
        </h2>

        <p>
        Unable to load course information.
        </p>

        `;


    }



}



/*
====================================================
    GET COURSE ID FROM URL
====================================================
*/


function getCourseId(){


    let params =
    new URLSearchParams(
        window.location.search
    );


    return Number(
        params.get("id")
    );


}



/*
====================================================
    DISPLAY COURSE
====================================================
*/


function displayCourse(){


    let courseId =
    getCourseId();



    if(!courseId){


        showError(
            "Invalid Course ID"
        );


        return;

    }




    let course =
    courses.find(
        item =>
        item.id === courseId
    );



    if(!course){


        showError(
            "Course Not Found"
        );


        return;


    }




    /*
    ==============================
        BASIC DETAILS
    ==============================
    */


    document.title =
    course.title;



    document.getElementById(
        "courseImage"
    ).src =
    course.image;



    document.getElementById(
        "courseImage"
    ).alt =
    course.title;




    document.getElementById(
        "courseTitle"
    ).innerText =
    course.title;



    document.getElementById(
        "courseShortDescription"
    ).innerText =
    course.description;




    document.getElementById(
        "courseRating"
    ).innerText =
    course.rating;



    document.getElementById(
        "courseDuration"
    ).innerText =
    course.duration;



    document.getElementById(
        "courseLanguage"
    ).innerText =
    course.language;




    /*
    ==============================
        COURSE INFORMATION
    ==============================
    */



    document.getElementById(
        "courseTrainer"
    ).innerText =
    course.trainer;



    document.getElementById(
        "courseCategory"
    ).innerText =
    course.category;



    document.getElementById(
        "courseCoupon"
    ).innerText =
    course.coupon_code || "Not Available";



    document.getElementById(
        "courseStudents"
    ).innerText =
    course.students || "N/A";



    document.getElementById(
        "courseReviews"
    ).innerText =
    course.reviews || "N/A";



    document.getElementById(
        "courseUpdated"
    ).innerText =
    course.last_updated || "N/A";





    document.getElementById(
        "courseDescription"
    ).innerText =
    course.description;




    /*
    ==============================
        COUPON BUTTON
    ==============================
    */


    let button =
    document.getElementById(
        "courseButton"
    );


    button.href =
    course.affiliate_url;



    /*
    ==============================
        RELATED COURSES
    ==============================
    */


    loadRelatedCourses(course);



}




/*
====================================================
    RELATED COURSES
====================================================
*/


function loadRelatedCourses(currentCourse){


    let related =
    courses.filter(course =>


        course.id !== currentCourse.id

        &&

        course.category_slug ===
        currentCourse.category_slug


    )
    .slice(0,6);




    let container =
    document.getElementById(
        "relatedCourses"
    );



    if(related.length === 0){


        container.innerHTML =

        `

        <p>
        No related courses found.
        </p>

        `;


        return;

    }





    container.innerHTML = "";



    related.forEach(course=>{


        container.innerHTML +=


        `

        <div class="related-card">


            <img 
            src="${course.image}"
            alt="${course.title}">



            <div class="related-card-content">


                <h3>
                ${course.title}
                </h3>



                <p>
                ⭐ ${course.rating}
                </p>



                <a href="course.html?id=${course.id}">
                View Course
                </a>


            </div>


        </div>

        `;



    });



}





/*
====================================================
    ERROR MESSAGE
====================================================
*/


function showError(message){


    document.getElementById(
        "courseDetails"
    ).innerHTML =


    `

    <div>

        <h2>
        ${message}
        </h2>


        <p>
        Please check the course URL.
        </p>

    </div>

    `;


}




/*
====================================================
    START
====================================================
*/


loadCourse();