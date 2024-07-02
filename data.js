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

// Calculating the total citations correctly
let totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0);
