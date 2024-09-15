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

  // Handle citation link clicks
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("citation-link")) {
      e.preventDefault();
      var pubTitle = e.target.getAttribute("data-pub-title");
      var pub = publications.find(function (p) {
        return p.title === pubTitle;
      });
      if (pub && pub.citingPapers.length > 0) {
        showCitingPapers(pub);
      } else {
        alert("No citations found for this publication.");
      }
    }
  });

  // Handle Read More button clicks
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("read-more-btn")) {
      var pubIndex = e.target.getAttribute("data-pub-index");
      var year = e.target.getAttribute("data-year");
      var pub = publicationsByYear[year][pubIndex];
      showAbstract(pub);
    }
  });

  // Handle publication link clicks to show "not published" popup
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("publication-link")) {
      e.preventDefault();
      var pubIndex = e.target.getAttribute("data-pub-index");
      var year = e.target.getAttribute("data-year");
      var pub = publicationsByYear[year][pubIndex];
      if (pub.journal.includes("(Under Review)")) {
        showNotPublishedYet(pub);
      } else {
        showAbstract(pub);
      }
    }
  });

  // Function to display a "Not Published Yet" message in a modal
  function showNotPublishedYet(pub) {
    var modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Publication Status</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h5>${pub.title}</h5>
        <p>This publication is currently under review and not yet published.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    `;

    // Inject the content into the existing modal
    document.querySelector('#abstractModal .modal-content').innerHTML = modalContent;
    $('#abstractModal').modal('show');
  }

  // Function to display the abstract in a modal
  function showAbstract(pub) {
    // Check if the publication is under review
    var isUnderReview = pub.journal.includes("(Under Review)");
    var modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Abstract</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h5>${pub.title}</h5>
        <p>${pub.abstract}</p>
      </div>
      <div class="modal-footer">
        ${
          isUnderReview
            ? `<span class="text-muted">This publication is currently under review and not yet published.</span>`
            : `<a href="${pub.url}" class="btn btn-primary" target="_blank">View Publication</a>`
        }
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    `;

    // Inject the content into the existing modal
    document.querySelector('#abstractModal .modal-content').innerHTML = modalContent;
    $('#abstractModal').modal('show');
  }

  // Function to display citing papers
  function showCitingPapers(pub) {
    // Sort citing papers by year in descending order
    var sortedCitingPapers = pub.citingPapers.sort(function (a, b) {
      return b.year - a.year;
    });

    var modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Citing Papers</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h5>Citing Papers for "${pub.title}"</h5>
        <ul>
          ${sortedCitingPapers
            .map(function (cp) {
              return `<li>
                ${cp.authors}, ${cp.year}. <a href="${cp.url}" target="_blank">${cp.title}</a>. ${cp.journal}.
              </li>`;
            })
            .join("")}
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    `;

    // Inject the content into the existing modal
    document.querySelector('#citingPapersModal .modal-content').innerHTML = modalContent;
    $('#citingPapersModal').modal('show');
  }

  // Manually define your citation data here
  var citationYears = ['2020', '2021', '2022', '2023', '2024'];
  var citationData = [1, 1, 2, 5, 6];

  // Calculate total citations
  var totalCitations = citationData.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  // Display total citations
  document.getElementById('total-citations').textContent = totalCitations;

  // Create citations chart
  var ctx = document.getElementById('citations-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: citationYears,
      datasets: [{
        label: 'Citations per Year',
        data: citationData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Prevents infinite scrolling
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
