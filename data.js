const publications = [
    {
        title: "Evaluation of durum and hard red spring wheat panels for sensitivity to necrotrophic effectors produced by Parastagonospora nodorum.",
        authors: "Szabo-Hever A, Running K, Seneviratne S, <strong>Singh G</strong>, et al.",
        journal: "Plant Disease (Under Review)",
        year: 2024,
        citations: 0,
        url: "#"
    },
    {
        title: "Evolution, diversity, and function of the disease susceptibility gene Snn1 in wheat.",
        authors: "Seneviratne S, Shi G, Szabo-Hever A, Zhang Z, Haugrud A, Running K, <strong>Singh G</strong>, et al.",
        journal: "The Plant Journal (Accepted)",
        year: 2024,
        citations: 0,
        url: "#"
    },
    {
        title: "Evaluation of wheat cultivars and germplasm lines for resistance to Pratylenchus neglectus populations collected in North Dakota.",
        authors: "<strong>Singh G</strong>, et al.",
        journal: "Plant Disease 117:3817-3824",
        year: 2023,
        citations: 2,
        url: "#"
    },
    {
        title: "Association mapping of resistance to tan spot in the Global Durum Panel.",
        authors: "Szabo-Hever A, <strong>Singh G</strong>, et al.",
        journal: "Phytopathology 113:1967-1978",
        year: 2023,
        citations: 2,
        url: "#"
    },
    {
        title: "Genome-wide association mapping of resistance to the foliar diseases septoria nodorum blotch and tan spot in a global winter wheat collection.",
        authors: "Haugrud A, Shi G, Seneviratne S, Running K, Zhang Z, <strong>Singh G</strong>, et al.",
        journal: "Molecular Breeding 43:54",
        year: 2023,
        citations: 3,
        url: "#"
    },
    {
        title: "Resistance screening and QTL mapping in wheat and triticale against root-lesion nematode.",
        authors: "<strong>Singh G</strong>.",
        journal: "MS thesis. North Dakota State University, Fargo, ND, USA",
        year: 2020,
        citations: 5,
        url: "#"
    }
];

let totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0);

