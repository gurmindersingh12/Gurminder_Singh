// Function to open tabs
function openTab(evt, tabName) {
  // Hide all tab content
  var tabcontent = document.getElementsByClassName("tab-content");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove active class from all links
  var tablinks = document.getElementsByClassName("nav-link");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the current tab and add active class to the clicked link
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

// Show default tab on page load
document.addEventListener("DOMContentLoaded", function () {
  // Display the home tab by default
  document.getElementById("home").style.display = "block";
  document.querySelector(".nav-link").classList.add("active");

  // Group publications by year
  var publicationsByYear = {};
  publications.forEach(function (pub) {
    if (!publicationsByYear[pub.year]) {
      publicationsByYear[pub.year] = [];
    }
    publicationsByYear[pub.year].push(pub);
  });

  // Sort years in descending order
  var years = Object.keys(publicationsByYear).sort(function (a, b) {
    return b - a;
  });

  // Populate publications accordion
  var publicationsAccordion = document.getElementById("publications-accordion");
  years.forEach(function (year, index) {
    // Create the accordion card for each year
    var card = document.createElement("div");
    card.className = "card";

    var cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.id = "heading-" + year;

    var h2 = document.createElement("h2");
    h2.className = "mb-0";

    var button = document.createElement("button");
    button.className = "btn btn-link btn-block text-left";
    button.type = "button";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse-" + year);
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", "collapse-" + year);
    button.innerHTML = `<i class="fas fa-calendar-alt"></i> Publications in ${year}`;

    h2.appendChild(button);
    cardHeader.appendChild(h2);

    var collapseDiv = document.createElement("div");
    collapseDiv.id = "collapse-" + year;
    collapseDiv.className = "collapse" + (index === 0 ? " show" : "");
    collapseDiv.setAttribute("aria-labelledby", "heading-" + year);
    collapseDiv.setAttribute("data-parent", "#publications-accordion");

    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Add publications for the year
    publicationsByYear[year].forEach(function (pub, pubIndex) {
      var pubDiv = document.createElement("div");
      pubDiv.className = "mb-3";
      pubDiv.innerHTML = `
        <h5><a href="#" class="publication-link" data-pub-index="${pubIndex}" data-year="${year}">${pub.title}</a></h5>
        <p>
          <strong>Authors:</strong> ${pub.authors}<br>
          <strong>Journal:</strong> ${pub.journal}<br>
          <strong>Citations:</strong> 
          <a href="#" class="citation-link" data-pub-title="${pub.title}">
            ${pub.citations}
          </a>
        </p>
        <button class="btn btn-primary btn-sm read-more-btn" data-pub-index="${pubIndex}" data-year="${year}">Read More</button>
        <hr>
      `;
      cardBody.appendChild(pubDiv);
    });

    collapseDiv.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(collapseDiv);
    publicationsAccordion.appendChild(card);
  });

  // Handle Read More button clicks for publications
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("read-more-btn")) {
      var pubIndex = e.target.getAttribute("data-pub-index");
      var year = e.target.getAttribute("data-year");
      var pub = publicationsByYear[year][pubIndex];
      showAbstract(pub);
    }
  });

  // Handle publication title clicks
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("publication-link")) {
      e.preventDefault();
      var pubIndex = e.target.getAttribute("data-pub-index");
      var year = e.target.getAttribute("data-year");
      var pub = publicationsByYear[year][pubIndex];
      showAbstract(pub);
    }
  });

  // Group conferences by year
  var conferencesByYear = {};
  conferences.forEach(function (conf) {
    if (!conferencesByYear[conf.year]) {
      conferencesByYear[conf.year] = [];
    }
    conferencesByYear[conf.year].push(conf);
  });

  // Sort years in descending order
  var confYears = Object.keys(conferencesByYear).sort(function (a, b) {
    return b - a;
  });

  // Populate conferences accordion
  var conferencesAccordion = document.getElementById("conferences-accordion");
  confYears.forEach(function (year, index) {
    // Create the accordion card for each year
    var card = document.createElement("div");
    card.className = "card";

    var cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.id = "heading-conference-" + year;

    var h2 = document.createElement("h2");
    h2.className = "mb-0";

    var button = document.createElement("button");
    button.className = "btn btn-link btn-block text-left";
    button.type = "button";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse-conference-" + year);
    button.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    button.setAttribute("aria-controls", "collapse-conference-" + year);
    button.innerHTML = `<i class="fas fa-calendar-alt"></i> Conferences in ${year}`;

    h2.appendChild(button);
    cardHeader.appendChild(h2);

    var collapseDiv = document.createElement("div");
    collapseDiv.id = "collapse-conference-" + year;
    collapseDiv.className = "collapse" + (index === 0 ? " show" : "");
    collapseDiv.setAttribute("aria-labelledby", "heading-conference-" + year);
    collapseDiv.setAttribute("data-parent", "#conferences-accordion");

    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Add conferences for the year
    conferencesByYear[year].forEach(function (conf, confIndex) {
      var confDiv = document.createElement("div");
      confDiv.className = "mb-3";
      confDiv.innerHTML = `
        <h5><a href="#" class="conference-link" data-conf-index="${confIndex}" data-year="${year}">${conf.title}</a></h5>
        <p>
          <strong>Authors:</strong> ${conf.authors}<br>
          <strong>Conference:</strong> ${conf.conference}<br>
          <strong>Citations:</strong> 
          <a href="#" class="citation-link" data-conf-title="${conf.title}">
            ${conf.citations}
          </a>
        </p>
        <button class="btn btn-primary btn-sm read-more-btn" data-conf-index="${confIndex}" data-year="${year}">Read More</button>
        <hr>
      `;
      cardBody.appendChild(confDiv);
    });

    collapseDiv.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(collapseDiv);
    conferencesAccordion.appendChild(card);
  });

  // Handle Read More button clicks for conferences
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("read-more-btn")) {
      var confIndex = e.target.getAttribute("data-conf-index");
      var year = e.target.getAttribute("data-year");
      var conf = conferencesByYear[year][confIndex];
      showAbstract(conf);
    }
  });

  // Handle conference title clicks
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("conference-link")) {
      e.preventDefault();
      var confIndex = e.target.getAttribute("data-conf-index");
      var year = e.target.getAttribute("data-year");
      var conf = conferencesByYear[year][confIndex];
      showAbstract(conf);
    }
  });

  // Function to display the abstract in a modal
  function showAbstract(item) {
    // Check if the item (publication or conference) has a URL
    var hasUrl = item.url && item.url !== "";

    var modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Abstract</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h5>${item.title}</h5>
        <p><strong>Authors:</strong> ${item.authors}</p>
        <p>${item.abstract}</p>
      </div>
      <div class="modal-footer">
        ${
          hasUrl
            ? `<a href="${item.url}" class="btn btn-primary" target="_blank">View Abstract</a>`
            : `<span class="text-muted">No abstract link available.</span>`
        }
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    `;

    // Inject the content into the existing modal
    document.querySelector("#abstractModal .modal-content").innerHTML = modalContent;
    $("#abstractModal").modal("show");
  }
});
