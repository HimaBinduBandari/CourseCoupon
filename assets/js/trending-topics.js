/*
====================================================
    GLOBAL VARIABLES
====================================================
*/

let courses = [];

let topics = [];

let filteredTopics = [];

let currentPage = 1;

const ITEMS_PER_PAGE = 12;



/*====================================================
    TOPIC ICONS
====================================================
*/

const topicIcons = {

    "AI":"🤖",
    "Artificial Intelligence":"🤖",

    "Programming":"💻",
    "Python":"🐍",
    "Java":"☕",
    "JavaScript":"🟨",

    "Web Development":"🌐",

    "Data Science":"📊",

    "Machine Learning":"🧠",

    "Cyber Security":"🔐",

    "Cloud":"☁️",

    "AWS":"☁️",

    "Excel":"📈",

    "Business":"💼",

    "Finance":"💰",

    "Marketing":"📢",

    "Design":"🎨",

    "Photography":"📷",

    "Music":"🎵",

    "Health":"❤️",

    "DevOps":"⚙️"

};



/*====================================================
    INITIALIZE
====================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    initPage

);



async function initPage(){

    try{

        await loadData();

        buildTopics();

        updateStatistics();

        filteredTopics=[...topics];

        bindEvents();

        sortTopics();

    }

    catch(error){

        console.error(error);

    }

}



/*====================================================
    LOAD COURSES
====================================================
*/

async function loadData(){

    const response = await fetch(

        "data/courses.json"

    );

    courses = await response.json();

}



/*====================================================
    BUILD TOPICS
====================================================
*/

function buildTopics(){

    const map = {};



    courses.forEach(course=>{

        if(!Array.isArray(course.category)){

            return;

        }



        course.category.forEach(category=>{

            if(!map[category]){

                map[category]={

                    name:category,

                    slug:

                    course.category_slug

                    ?

                    course.category_slug[

                        course.category.indexOf(category)

                    ]

                    :

                    category

                    .toLowerCase()

                    .replace(/\s+/g,"-"),

                    icon:

                    topicIcons[category]

                    ||

                    "📚",

                    courses:0,

                    instructors:new Set(),

                    students:0,

                    rating:0,

                    tags:new Set()

                };

            }



            const topic = map[category];



            topic.courses++;



            topic.students +=

            Number(

                course.students || 0

            );



            topic.rating +=

            Number(

                course.rating || 0

            );



            topic.instructors.add(

                course.trainer

            );



            topic.tags.add(

                course.language

            );



        });

    });



    topics =

    Object.values(map)



    .map(topic=>{

        topic.rating =

        topic.courses

        ?

        (

            topic.rating/

            topic.courses

        ).toFixed(1)

        :

        "0.0";



        topic.instructors =

        topic.instructors.size;



        topic.tags =

        [...topic.tags]

        .slice(0,4);



        topic.description =

        `Learn ${topic.name} with the best Udemy courses from top instructors.`;



        return topic;

    });

}



/*====================================================
    HERO STATISTICS
====================================================
*/

function updateStatistics(){

    document.getElementById(

        "totalTopics"

    ).textContent =

    topics.length;



    document.getElementById(

        "totalCourses"

    ).textContent =

    courses.length;



    const instructors =

    new Set();



    courses.forEach(course=>{

        instructors.add(

            course.trainer

        );

    });



    document.getElementById(

        "totalInstructors"

    ).textContent =

    instructors.size;



    const avg =

    courses.length

    ?

    (

        courses.reduce(

            (sum,course)=>

            sum +

            Number(course.rating||0),

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

}



/*====================================================
    EVENTS
====================================================
*/

function bindEvents(){

    document

    .getElementById(

        "searchTopic"

    )

    .addEventListener(

        "input",

        searchTopics

    );



    document

    .getElementById(

        "sortTopics"

    )

    .addEventListener(

        "change",

        sortTopics

    );

}



/*====================================================
    FORMAT NUMBER
====================================================
*/

function formatNumber(number){

    return Number(number)

    .toLocaleString();

}

/*====================================================
    SEARCH
====================================================*/

function searchTopics(){

    const keyword = document
        .getElementById("searchTopic")
        .value
        .trim()
        .toLowerCase();

    filteredTopics = topics.filter(topic=>{

        return(

            topic.name.toLowerCase().includes(keyword)

            ||

            topic.description.toLowerCase().includes(keyword)

            ||

            topic.tags.join(" ")
            .toLowerCase()
            .includes(keyword)

        );

    });

    currentPage = 1;

    sortTopics();

}



/*====================================================
    SORT
====================================================*/

function sortTopics(){

    const sort =

    document
    .getElementById("sortTopics")
    .value;

    switch(sort){

        case "rating":

            filteredTopics.sort(
                (a,b)=>
                b.rating-a.rating
            );

        break;

        case "alphabetical":

            filteredTopics.sort(
                (a,b)=>
                a.name.localeCompare(b.name)
            );

        break;

        default:

            filteredTopics.sort(
                (a,b)=>
                b.courses-a.courses
            );

    }

    renderFeaturedTopics();

    renderTopics();

}



/*====================================================
    FEATURED TOPICS
====================================================*/

function renderFeaturedTopics(){

    const container =

    document.getElementById("featuredTopics");

    if(!container){

        return;

    }

    container.innerHTML="";

    filteredTopics

        .slice(0,6)

        .forEach(topic=>{

            container.innerHTML +=

            createTopicCard(topic,true);

        });

}



/*====================================================
    RENDER TOPICS
====================================================*/

function renderTopics(){

    const grid =

    document.getElementById("topicsGrid");

    grid.innerHTML="";

    document.getElementById(

        "resultCount"

    ).textContent=

    filteredTopics.length;

    if(filteredTopics.length===0){

        grid.innerHTML=

        "<h2>No topics found.</h2>";

        return;

    }

    const start =

    (currentPage-1)

    *

    ITEMS_PER_PAGE;

    const end =

    start+

    ITEMS_PER_PAGE;

    filteredTopics

        .slice(start,end)

        .forEach(topic=>{

            grid.innerHTML +=

            createTopicCard(topic,false);

        });

    renderPagination();

}



/*====================================================
    TOPIC CARD
====================================================*/

function createTopicCard(topic,featured=false){

    return `

<div class="topic-card ${featured?'featured-card':''}">

<div class="topic-icon">

${topic.icon}

</div>

<h3>

${topic.name}

</h3>

<p class="topic-description">

${topic.description}

</p>

<div class="topic-stats">

<span>

📚 ${topic.courses} Courses

</span>

<span>

👨‍🏫 ${topic.instructors} Instructors

</span>

<span>

⭐ ${topic.rating}

</span>

</div>

<div class="topic-tags">

${

topic.tags

.map(tag=>

`<span>${tag}</span>`)

.join("")

}

</div>

<a

class="topic-btn"

href="category.html?category=${topic.slug}">

Explore Topic →

</a>

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

        filteredTopics.length/

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

        const button=

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

            renderTopics();

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

document.title=

"Trending Topics | CourseCoupon";

const canonical=

document.getElementById(

"canonicalLink"

);

if(canonical){

canonical.href=

window.location.href;

}