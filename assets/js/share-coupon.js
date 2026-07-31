/*
=====================================================
    COURSECOUPON — SHARE COUPON PAGE
=====================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    setupReveal();
    setupCounters();
    buildForm();
    buildFAQ();
    setupCanonical();

});


/*=====================================================
    SCROLL REVEAL
=====================================================*/

function setupReveal() {

    const targets = document.querySelectorAll(

        ".cc-stub, .cc-track__item, .cc-receipt__cell, .cc-ticket--form, .cc-faq-item"

    );

    targets.forEach(function (el) {
        el.classList.add("cc-reveal");
    });

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach(function (el) {
        observer.observe(el);
    });

}


/*=====================================================
    STAT COUNTERS
=====================================================*/

function setupCounters() {

    const counters = document.querySelectorAll(".cc-counter");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
        observer.observe(counter);
    });

}

function animateCounter(counter) {

    const target = Number(counter.dataset.target);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            counter.textContent = target.toLocaleString() + "+";
        }
    }

    requestAnimationFrame(tick);

}


/*=====================================================
    FORM
=====================================================*/

function buildForm() {

    const form = document.getElementById("shareCouponForm");
    if (!form) return;

    form.innerHTML = `

<div class="cc-form__grid">

<div class="cc-form__group cc-form__group--full">
<label for="cc-course-url">Course URL *</label>
<input id="cc-course-url" type="url" name="course_url" placeholder="https://www.udemy.com/course/..." required>
</div>

<div class="cc-form__group">
<label for="cc-coupon">Coupon code</label>
<input id="cc-coupon" type="text" name="coupon" placeholder="LEARNFREE26">
</div>

<div class="cc-form__group">
<label for="cc-name">Your name</label>
<input id="cc-name" type="text" name="name" placeholder="Jane Doe">
</div>

<div class="cc-form__group cc-form__group--full">
<label for="cc-email">Email address</label>
<input id="cc-email" type="email" name="email" placeholder="you@example.com">
</div>

<div class="cc-form__group cc-form__group--full">
<label for="cc-notes">Additional notes</label>
<textarea id="cc-notes" name="notes" placeholder="Anything we should know about the course or the coupon"></textarea>
</div>

<div class="cc-form__group cc-form__group--full">
<button class="cc-form__submit" type="submit">🎟 Submit for review</button>
<p class="cc-form__note">We'll email you once your coupon is live — usually within 24–48 hours.</p>
</div>

</div>

`;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
`🎉

Thank you for your submission!

In the next step we'll connect this form to Google Sheets using Google Apps Script.

Your coupon will be reviewed before publishing.`
        );

        form.reset();

    });

}


/*=====================================================
    FAQ
=====================================================*/

function buildFAQ() {

    const container = document.getElementById("faqContainer");
    if (!container) return;

    const faqs = [
        {
            question: "Who can submit a coupon?",
            answer: "Anyone — instructors, affiliates, or students — can submit a valid Udemy coupon."
        },
        {
            question: "Is publishing really free?",
            answer: "Yes. Listing your coupon on CourseCoupon is, and always will be, completely free."
        },
        {
            question: "How long does approval take?",
            answer: "Most submissions are reviewed and published within 24 to 48 hours."
        },
        {
            question: "Will every coupon get published?",
            answer: "Only active, genuine coupons that meet our quality guidelines make it to the site."
        }
    ];

    container.innerHTML = faqs.map(function (faq, index) {
        return `
<div class="cc-faq-item" data-index="${index}">
<div class="cc-faq-question">
<span>${faq.question}</span>
<span class="cc-faq-question__mark">+</span>
</div>
<div class="cc-faq-answer">
<p>${faq.answer}</p>
</div>
</div>
`;
    }).join("");

    container.querySelectorAll(".cc-faq-item").forEach(function (item) {

        const question = item.querySelector(".cc-faq-question");
        const answer = item.querySelector(".cc-faq-answer");

        question.addEventListener("click", function () {

            const isOpen = item.classList.contains("is-open");

            container.querySelectorAll(".cc-faq-item").forEach(function (other) {
                other.classList.remove("is-open");
                other.querySelector(".cc-faq-answer").style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("is-open");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }

        });

    });

}


/*=====================================================
    SEO — canonical link
=====================================================*/

function setupCanonical() {

    const canonical = document.getElementById("canonicalLink");

    if (canonical) {
        canonical.href = window.location.href;
    }

}