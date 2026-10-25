

/* Movie "database" - plain array since no backend is used */
const movies = [
    { id: 1, title: "Rush Hour", genre: "Action", ageRating: "M", runtime: 98, price: 16.50, poster: "images/movie1.png", sessions: ["Fri 6:00 PM", "Sat 3:00 PM"], ageGroups: ["Teen", "Adult"], viewing: ["Friends"], description: "A Hong Kong detective is sent to Los Angeles to help find a kidnapped diplomat's daughter. He is paired with a motor-mouthed LAPD detective who was only meant to keep him out of the way. The two clash constantly but team up to track the kidnappers, mixing martial arts action with buddy-cop comedy." },
    { id: 2, title: "The Hobbit: An Unexpected Journey", genre: "Fantasy", ageRating: "M", runtime: 169, price: 19.00, poster: "images/movie2.png", sessions: ["Sat 11:00 AM", "Sun 1:00 PM"], ageGroups: ["Teen", "Adult"], viewing: ["Family"], description: "Hobbit Bilbo Baggins is pulled from his quiet life when the wizard Gandalf and thirteen dwarves arrive seeking a burglar for their quest to reclaim their mountain home from the dragon Smaug. Along the way Bilbo meets the creature Gollum and finds a small, plain ring that will change everything." },
    { id: 3, title: "The Hobbit: The Desolation of Smaug", genre: "Fantasy", ageRating: "M", runtime: 161, price: 19.00, poster: "images/movie3.png", sessions: ["Fri 7:00 PM", "Sun 2:30 PM"], ageGroups: ["Teen", "Adult"], viewing: ["Friends"], description: "Bilbo and the dwarves continue their quest, crossing the dangerous forest of Mirkwood and the elven realm before escaping down a river. As they near the Lonely Mountain, the real danger still waits inside it: the dragon Smaug, guarding the dwarves' stolen treasure." },
    { id: 4, title: "The Hobbit: The Battle of the Five Armies", genre: "Fantasy", ageRating: "M", runtime: 144, price: 19.00, poster: "images/movie4.png", sessions: ["Thu 7:30 PM", "Sun 5:00 PM"], ageGroups: ["Adult"], viewing: ["Solo"], description: "With Smaug unleashed on the nearby town, the dwarves reclaim their mountain, but armies of elves, men and orcs soon converge on it. Old rivalries threaten to tear the group apart as Bilbo tries to stop his friends from destroying each other in the final battle." },
    { id: 5, title: "Logan", genre: "Action", ageRating: "MA15+", runtime: 137, price: 19.50, poster: "images/movie5.png", sessions: ["Fri 9:00 PM", "Sat 9:15 PM"], ageGroups: ["Adult"], viewing: ["Solo"], description: "In a near future where mutants are nearly extinct, an aging Logan hides out while caring for a frail Professor X. His quiet life is upended when he must protect a young girl with powers like his own from the people hunting her." },
    { id: 6, title: "Dune", genre: "Sci-Fi", ageRating: "M", runtime: 155, price: 20.00, poster: "images/movie6.png", sessions: ["Fri 7:30 PM", "Sat 4:00 PM"], ageGroups: ["Teen", "Adult"], viewing: ["Date Night", "Friends"], description: "Paul Atreides travels with his family to the desert planet Arrakis, source of the galaxy's most valuable resource. When betrayal destroys his family's rule, Paul must survive in the desert among the native Fremen and master his visions of the future." }
];

const TICKET_MULTIPLIERS = { Adult: 1.0, Child: 0.7, Student: 0.85 };

/* Build one card's HTML (used by movies.html and recommend.html) */
function movieCardHTML(m, includeExtras) {
    let html = '<article class="movie-card"><img src="' + m.poster + '" alt="Poster for ' + m.title + '">' +
        '<h3>' + m.title + '</h3><p class="movie-meta">' + m.genre + ' &middot; ' + m.ageRating + ' &middot; ' + m.runtime + ' min</p>' +
        '<p>' + m.description + '</p>';
    if (includeExtras) {
        html += '<p class="movie-meta">Price: $' + m.price.toFixed(2) + '</p><p class="movie-meta">Sessions: ' + m.sessions.join(", ") + '</p>';
    }
    html += '<a class="button" href="booking.html?movie=' + m.id + '">Book this movie</a></article>';
    return html;
}

/* ---- movies.html ---- */
function initMoviesPage() {
    const list = document.getElementById("movieList");
    if (!list) return;
    movies.forEach(function (m) { list.innerHTML += movieCardHTML(m, true); });
}

/* ---- recommend.html ---- */
function initRecommendPage() {
    const form = document.getElementById("recommendForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const genre = document.getElementById("genre").value;
        const ageGroup = document.getElementById("ageGroup").value;
        const viewing = document.getElementById("viewing").value;

        /* Rule-based matching: try a full match first, then relax the
           rules one at a time so different answers give different results. */
        let matches = movies.filter(function (m) {
            return m.genre === genre && m.ageGroups.includes(ageGroup) && m.viewing.includes(viewing);
        });
        let msg = "Recommended for you:";
        if (matches.length === 0) {
            matches = movies.filter(function (m) { return m.genre === genre; });
            msg = "No exact match, but here is a " + genre + " title you might like:";
        }
        if (matches.length === 0) {
            matches = movies.slice(0, 2);
            msg = "No " + genre + " movie right now, here are some popular picks:";
        }

        const results = document.getElementById("recommendResults");
        results.innerHTML = "<p>" + msg + "</p>";
        matches.forEach(function (m) { results.innerHTML += movieCardHTML(m, false); });
    });
}

/* ---- register.html ---- */
function initRegisterPage() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const pwd1 = document.getElementById("password").value;
        const pwd2 = document.getElementById("confirmPassword").value;
        const namePattern = /^[A-Za-z0-9_]{5,}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pwdPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{10,}$/;

        let errMsg = "";
        if (!namePattern.test(username)) errMsg += "<li>Username must be 5+ characters: letters, numbers, underscores only.</li>";
        if (!emailPattern.test(email)) errMsg += "<li>Please enter a valid email address.</li>";
        if (!/^\d{8,15}$/.test(phone)) errMsg += "<li>Phone number must be 8-15 digits.</li>";
        if (!pwdPattern.test(pwd1)) errMsg += "<li>Password needs 10+ characters with upper, lower, number and special character.</li>";
        if (pwd1 !== pwd2) errMsg += "<li>Passwords do not match.</li>";
        if (!document.querySelector('input[name="gender"]:checked')) errMsg += "<li>Please select a gender.</li>";
        if (document.querySelectorAll('input[name="prefGenre"]:checked').length === 0) errMsg += "<li>Select at least one preferred genre.</li>";
        if (document.getElementById("country").value === "") errMsg += "<li>Please select your country/region.</li>";

        document.getElementById("registerErrors").innerHTML = errMsg ? "<ul>" + errMsg + "</ul>" : "";
        document.getElementById("registerStatus").textContent = errMsg ? "" : "Registration details look valid.";
        // No backend/database is used in this assignment, so nothing is actually submitted.
    });
}

/* ---- booking.html ---- */
function initBookingPage() {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    const movieSelect = document.getElementById("movieSelect");
    const ticketCount = document.getElementById("ticketCount");
    const ticketType = document.getElementById("ticketType");
    const payment = document.getElementById("paymentMethod");
    const sameAsEmail = document.getElementById("sameAsEmail");
    const email = document.getElementById("bookingEmail");
    const billingEmail = document.getElementById("billingEmail");

    movies.forEach(function (m) {
        movieSelect.innerHTML += '<option value="' + m.id + '">' + m.title + ' ($' + m.price.toFixed(2) + ')</option>';
    });

    /* Pre-fill the movie from ?movie=ID in the URL (set by the links on
       movies.html and recommend.html) */
    const movieId = new URLSearchParams(window.location.search).get("movie");
    if (movieId) movieSelect.value = movieId;

    function updateCost() {
        const movie = movies.find(function (m) { return m.id === Number(movieSelect.value); });
        const count = Number(ticketCount.value) || 0;
        const price = movie ? movie.price * TICKET_MULTIPLIERS[ticketType.value] : 0;
        document.getElementById("costDisplay").textContent = "Total cost: $" + (price * count).toFixed(2);
    }
    movieSelect.onchange = updateCost;
    ticketCount.oninput = updateCost;
    ticketType.onchange = updateCost;
    updateCost();

    payment.onchange = function () {
        document.getElementById("voucherGroup").hidden = payment.value !== "Voucher";
        document.getElementById("cardGroup").hidden = payment.value !== "Online";
    };
    payment.onchange();

    sameAsEmail.onchange = function () {
        billingEmail.disabled = sameAsEmail.checked;
        if (sameAsEmail.checked) billingEmail.value = email.value;
    };
    email.oninput = function () { if (sameAsEmail.checked) billingEmail.value = email.value; };

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let errMsg = "";
        if (document.getElementById("fullName").value.trim() === "") errMsg += "<li>Full name cannot be empty.</li>";
        if (!emailPattern.test(email.value.trim())) errMsg += "<li>Please enter a valid email address.</li>";
        if (document.getElementById("bookingPhone").value.replace(/\D/g, "").length < 10) errMsg += "<li>Phone number must have at least 10 digits.</li>";
        if (!movieSelect.value) errMsg += "<li>Please select a movie.</li>";

        const screening = document.getElementById("screeningDateTime").value;
        if (!screening || new Date(screening) < new Date()) errMsg += "<li>Screening date/time must not be in the past.</li>";
        if (Number(ticketCount.value) <= 0) errMsg += "<li>Number of tickets must be greater than 0.</li>";

        if (payment.value === "Voucher") {
            if (!/^\d{12}$/.test(document.getElementById("voucherCode").value.trim())) errMsg += "<li>Voucher code must be exactly 12 digits.</li>";
        } else if (payment.value === "Online") {
            const cardType = document.getElementById("cardType").value;
            const expected = cardType === "Amex" ? 15 : 16;
            const cardNumber = document.getElementById("cardNumber").value.trim();
            if (cardNumber.length !== expected || !/^\d+$/.test(cardNumber)) errMsg += "<li>Card number must be " + expected + " digits for " + cardType + ".</li>";
        } else {
            errMsg += "<li>Please select a payment method.</li>";
        }
        if (billingEmail.value.trim() === "") errMsg += "<li>Billing email address cannot be empty.</li>";

        document.getElementById("bookingErrors").innerHTML = errMsg ? "<ul>" + errMsg + "</ul>" : "";
        document.getElementById("bookingStatus").textContent = errMsg ? "" : "Booking details are valid and ready to submit.";
        // form.submit() is left out so the demo doesn't repeatedly post to the live test endpoint.
    });
}

window.onload = function () {
    initMoviesPage();
    initRecommendPage();
    initRegisterPage();
    initBookingPage();
};
