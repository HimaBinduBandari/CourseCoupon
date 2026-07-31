/*
==================================================
    SEARCH.JS
==================================================
*/

let courses = [];

/*
==================================================
    LOAD COURSES
==================================================
*/

async function loadCourses() {

    try {

        const response = await fetch("data/courses.json");

        if (!response.ok) {

            throw new Error("Unable to load courses.json");

        }

        courses = await response.json();

        initializePage();

    }

    catch (error) {

        console.error(error);

        document.getElementById("courseResults").innerHTML =

        `
        <div class="no-results">

            <h2>

                Failed to load courses.

            </h2>

        </div>
        `;

    }

}

/*
==================================================
    INITIALIZE PAGE
==================================================
*/

function initializePage() {

    const params = new URLSearchParams(window.location.search);

    const keyword = params.get("q") || "";

    const type = params.get("type") || "course";

    document.getElementById("searchKeyword").value = keyword;

    document.getElementById("searchType").value = type;

    if (keyword !== "") {

        filterCourses(keyword, type);

    }

}

/*
==================================================
    SEARCH BUTTON
==================================================
*/

document.getElementById("searchButton").addEventListener(

    "click",

    function () {

        searchCourses();

    }

);

/*
==================================================
    ENTER KEY
==================================================
*/

document.getElementById("searchKeyword").addEventListener(

    "keydown",

    function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            searchCourses();

        }

    }

);

/*
==================================================
    SEARCH
==================================================
*/

function searchCourses() {

    const keyword =

        document.getElementById("searchKeyword")

        .value

        .trim();

    const type =

        document.getElementById("searchType")

        .value;

    if (keyword === "") {

        alert("Please enter a search keyword.");

        return;

    }

    const url =

        "search.html?q=" +

        encodeURIComponent(keyword) +

        "&type=" +

        type;

    window.history.pushState({}, "", url);

    filterCourses(keyword, type);

}

/*
==================================================
    FILTER COURSES
==================================================
*/

function filterCourses(keyword, type) {

    keyword = keyword.toLowerCase();

    let results = [];

    switch (type) {

        case "course":

            results = courses.filter(course =>

                course.title.toLowerCase().includes(keyword)

            );

            break;

        case "trainer":

            results = courses.filter(course =>

                course.trainer.toLowerCase().includes(keyword)

            );

            break;

    }

    showResults(results, keyword);

}
/*
==================================================
    SHOW RESULTS
==================================================
*/

function showResults(results, keyword){

    document.getElementById("resultTitle").innerHTML =

    `Search Results for "<strong>${keyword}</strong>"`;


    document.getElementById("resultCount").innerHTML =

    `${results.length} Course(s) Found`;


    const container =

    document.getElementById("courseResults");


    container.innerHTML = "";


    /*
    ==============================================
        NO RESULTS
    ==============================================
    */

    if(results.length === 0){

        container.innerHTML =

        `

        <div class="no-results">

            <h2>

                No Courses Found

            </h2>

            <p>

                Try another keyword.

            </p>

        </div>

        `;

        return;

    }



    /*
    ==============================================
        COURSE CARDS
    ==============================================
    */

    results.forEach(course=>{


        container.innerHTML +=

        `

        <div class="course-card">


            <img

            src="${course.image}"

            alt="${course.title}">



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



                <p>

                    🎟 Coupon :

                    <strong>

                    ${course.coupon_code || "N/A"}

                    </strong>

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
==================================================
    BROWSER BACK / FORWARD SUPPORT
==================================================
*/

window.addEventListener("popstate", function () {

    const params = new URLSearchParams(window.location.search);

    const keyword = params.get("q") || "";

    const type = params.get("type") || "course";

    document.getElementById("searchKeyword").value = keyword;

    document.getElementById("searchType").value = type;

    if(keyword !== ""){

        filterCourses(keyword, type);

    }
    else{

        document.getElementById("resultTitle").innerHTML =
        "Search Results";

        document.getElementById("resultCount").innerHTML =
        "0 Course(s) Found";

        document.getElementById("courseResults").innerHTML = "";

    }

});


/*
==================================================
    LIVE SEARCH
==================================================
*/

let typingTimer;

document.getElementById("searchKeyword").addEventListener(

    "input",

    function(){

        clearTimeout(typingTimer);

        const keyword = this.value.trim();

        const type = document.getElementById("searchType").value;

        if(keyword.length === 0){

            document.getElementById("resultTitle").innerHTML =
            "Search Results";

            document.getElementById("resultCount").innerHTML =
            "0 Course(s) Found";

            document.getElementById("courseResults").innerHTML = "";

            return;

        }

        typingTimer = setTimeout(function(){

            const url =
            "search.html?q=" +
            encodeURIComponent(keyword) +
            "&type=" +
            type;

            window.history.replaceState({}, "", url);

            filterCourses(keyword, type);

        },300);

    }

);


/*
==================================================
    SEARCH TYPE CHANGED
==================================================
*/

document.getElementById("searchType").addEventListener(

    "change",

    function(){

        const keyword =
        document.getElementById("searchKeyword")
        .value
        .trim();

        if(keyword===""){

            return;

        }

        searchCourses();

    }

);


/*
==================================================
    START APPLICATION
==================================================
*/

loadCourses();