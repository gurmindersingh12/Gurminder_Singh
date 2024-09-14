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
    publicationsByYear[year].forEach(function (pub) {
      var pubDiv = document.createElement("div");
      pubDiv.className = "mb-3";
      pubDiv.innerHTML = `
        <h5>${pub.title}</h5>
        <p>
          <strong>Authors:</strong> ${pub.authors}<br>
          <strong>Journal:</strong> ${pub.journal}<br>
          <strong>Citations:</strong> 
          <a href="#" class="citation-link" data-pub-title="${pub.title}">
            ${pub.citations}
          </a>
        </p>
        <a href="${pub.url}" class="btn btn-primary btn-sm" target="_blank">Read More</a>
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

  // Function to display citing papers
  function showCitingPapers(pub) {
    var modalContent = `
      <h5>Citing Papers for "${pub.title}"</h5>
      <ul>
        ${pub.citingPapers
          .map(function (cp) {
            return `<li>
              ${cp.authors}, ${cp.year}. <a href="${cp.url}" target="_blank">${cp.title}</a>. ${cp.journal}.
            </li>`;
          })
          .join("")}
      </ul>
    `;

    // Create a modal to display citing papers
    var modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "citingPapersModal";
    modal.tabIndex = -1;
    modal.role = "dialog";
    modal.innerHTML = `
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Citing Papers</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ${modalContent}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    $('#citingPapersModal').modal('show');
  }

  // Function to close modal and remove it from DOM
  function closeModal() {
    $('#citingPapersModal').modal('hide');
    document.getElementById('citingPapersModal').remove();
  }

  // Manually define your citation data here
  var citationYears = ['2020', '2021', '2022', '2023', '2024'];
  var citationData = [5, 3, 7, 9, 2];

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
