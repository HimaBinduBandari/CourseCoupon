/*
==================================================
CREATE COURSE CARD
==================================================
*/

function createCourseCard(course){

    let categoryHTML = "";


    /*
    ==========================================
    MULTIPLE CATEGORIES
    ==========================================
    */

    if(Array.isArray(course.category)){

        categoryHTML =

        course.category.map((category,index)=>{

            return `

            <a href="category.html?category=${course.category_slug[index]}">

                ${category}

            </a>

            `;

        }).join(" • ");

    }
    else{

        categoryHTML =

        `

        <a href="category.html?category=${course.category_slug}">

            ${course.category}

        </a>

        `;

    }


    /*
    ==========================================
    CARD
    ==========================================
    */

    return `

    <div class="course-card">

        <img

        src="${course.image}"

        alt="${course.title}"

        loading="lazy">

        <div class="course-card-content">

            <h3>

                ${course.title}

            </h3>

            <p>

                📂

                ${categoryHTML}

            </p>

            <p>

                ⏱ Duration :

                ${course.duration}

            </p>

            <p>

                ⭐ Avg Rating :

                ${course.rating}

            </p>

            <p>

                👨‍🏫

                <a href="trainer.html?trainer=${course.trainer_slug}">

                    ${course.trainer}

                </a>

            </p>

            <p>

                🏷️ Discount Price : $

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

}