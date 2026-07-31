/*
==================================================
LOAD HTML
==================================================
*/

async function loadHTML(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        document.getElementById(id).innerHTML =
        await response.text();

    }

    catch(error){

        console.error(error);

    }

}

/*
==================================================
LOAD LAYOUT
==================================================
*/

async function loadLayout(){

    await loadHTML(
        "header",
        "includes/header.html"
    );

    await loadHTML(
        "footer",
        "includes/footer.html"
    );

    setActiveMenu();

}

/*
==================================================
ACTIVE MENU
==================================================
*/

function setActiveMenu(){

    const page =

    window.location.pathname
    .split("/")
    .pop();

    document
    .querySelectorAll(".main-nav a")
    .forEach(link=>{

        if(link.getAttribute("href")===page){

            link.classList.add("active");

        }

    });

}

/*
==================================================
START
==================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    loadLayout

);