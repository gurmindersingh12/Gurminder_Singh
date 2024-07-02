document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pubIndex = urlParams.get('pub');
    const pub = publications[pubIndex];

    const citationsDetails = document.getElementById("citations-details");

    if (pub && pub.citingPapers.length > 0) {
        pub.citingPapers.forEach(citingPaper => {
            const div = document.createElement("div");
            div.classList.add("citation");
            div.innerHTML = `
                <div class="citation-title">
                    ${citingPaper.authors} ${citingPaper.year}. ${citingPaper.title} ${citingPaper.journal}. <a href="${citingPaper.url}" style="color: #1a0dab;">[Link]</a>
                </div>
            `;
            citationsDetails.appendChild(div);
        });
    } else {
        citationsDetails.innerHTML = "<p>No citations found.</p>";
    }
});
