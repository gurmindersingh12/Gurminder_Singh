const publications = [
    {
        title: "Evaluation of durum and hard red spring wheat panels for sensitivity to necrotrophic effectors produced by Parastagonospora nodorum",
        authors: "Szabo-Hever A, Running K, Seneviratne S, Singh G, et al.",
        journal: "Plant Disease (Under Review)",
        year: 2024,
        url: "#",
        citations: 0 // Replace with actual citation count if available
    },
    {
        title: "Evolution, diversity, and function of the disease susceptibility gene Snn1 in wheat",
        authors: "Seneviratne S, Shi G, Szabo-Hever A, Zhang Z, Haugrud A, Running K, Singh G, et al.",
        journal: "The Plant Journal (Accepted)",
        year: 2024,
        url: "#",
        citations: 0 // Replace with actual citation count if available
    },
    {
        title: "Evaluation of wheat cultivars and germplasm lines for resistance to Pratylenchus neglectus populations collected in North Dakota",
        authors: "Singh G, et al.",
        journal: "Plant Disease",
        year: 2023,
        url: "#",
        citations: 2 // Replace with actual citation count if available
    },
    {
        title: "Association mapping of resistance to tan spot in the Global Durum Panel",
        authors: "Szabo-Hever A, Singh G, et al.",
        journal: "Phytopathology",
        year: 2023,
        url: "#",
        citations: 2 // Replace with actual citation count if available
    },
    {
        title: "Genome-wide association mapping of resistance to the foliar diseases septoria nodorum blotch and tan spot in a global winter wheat collection",
        authors: "Haugrud A, Shi G, Seneviratne S, Running K, Zhang Z, Singh G, et al.",
        journal: "Molecular Breeding",
        year: 2023,
        url: "#",
        citations: 3 // Replace with actual citation count if available
    },
    {
        title: "Resistance screening and QTL mapping in wheat and triticale against root-lesion nematode",
        authors: "Singh G.",
        journal: "MS thesis. North Dakota State University, Fargo, ND, USA",
        year: 2020,
        url: "#",
        citations: 5 // Replace with actual citation count if available
    }
];

// Assuming the totalCitations, hIndex, and i10Index are dynamically calculated or you can update them as needed
let totalCitations = 0;
let hIndex = 2;
let i10Index = 0;

publications.forEach(pub => {
    totalCitations += pub.citations;
});

function calculateHIndex(citations) {
    citations.sort((a, b) => b - a);
    let h = 0;
    for (let i = 0; i < citations.length; i++) {
        if (citations[i] >= i + 1) {
            h = i + 1;
        } else {
            break;
        }
    }
    return h;
}

hIndex = calculateHIndex(publications.map(pub => pub.citations));
i10Index = publications.filter(pub => pub.citations >= 10).length;
