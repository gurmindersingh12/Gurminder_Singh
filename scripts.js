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

  // Populate publications grouped by year
  var publicationsContainer = document.getElementById("publications-container");
  years.forEach(function (year) {
    // Year Heading
    var yearHeading = document.createElement("h3");
    yearHeading.textContent = year;
    publicationsContainer.appendChild(yearHeading);

    // Publications for the year
    var row = document.createElement("div");
    row.className = "row";

    publicationsByYear[year].forEach(function (pub) {
      var col = document.createElement("div");
      col.className = "col-md-6";
      col.innerHTML = `
        <div class="card publication-card mb-4">
          <div class="card-body">
            <h5 class="card-title">${pub.title}</h5>
            <p class="card-text">
              <strong>Authors:</strong> ${pub.authors}<br>
              <strong>Journal:</strong> ${pub.journal}<br>
              <strong>Citations:</strong> 
              <a href="#" class="citation-link" data-pub-title="${pub.title}">
                ${pub.citations}
              </a>
            </p>
            <a href="${pub.url}" class="btn btn-primary" target="_blank">Read More</a>
          </div>
        </div>
      `;
      row.appendChild(col);
    });

    publicationsContainer.appendChild(row);
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

  // Aggregate citations per year from publications data
  var citationDataMap = {};
  publications.forEach(function (pub) {
    var year = pub.year.toString();
    if (citationDataMap[year]) {
      citationDataMap[year] += pub.citations;
    } else {
      citationDataMap[year] = pub.citations;
    }
  });

  // Convert the citation data map to arrays and sort by year
  var citationYears = Object.keys(citationDataMap).sort();
  var citationData = citationYears.map(function (year) {
    return citationDataMap[year];
  });

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
