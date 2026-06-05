// ─────────────────────────────────────────────
// map.js
// Handles map rendering, zoom, pan, click, panel.
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// COUNTRY NAMES
// Add entries here as you research countries.
// Format: "topoJsonId": "Your Country Name"
// The name you put here is what you use as the
// key in data.json.
//
// HOW TO FIND THE ID:
// Hover over any country on the map →
// bottom-right corner shows: topo id: 724
// Then add it here: "724": "Spain"
// Then add "Spain": { ... } in data.json
// ─────────────────────────────────────────────

const COUNTRY_NAMES = {
  // Add entries like: "724": "Spain",
  "004": "Afghanistan",
  "008": "Albania",
  "010": "Antarctica",
  "012": "Algeria",
  "016": "American Samoa",
  "020": "Andorra",
  "024": "Angola",
  "028": "Antigua and Barbuda",
  "031": "Azerbaijan",
  "032": "Argentina",
  "036": "Australia",
  "040": "Austria",
  "044": "Bahamas",
  "048": "Bahrain",
  "050": "Bangladesh",
  "051": "Armenia",
  "052": "Barbados",
  "056": "Belgium",
  "060": "Bermuda",
  "064": "Bhutan",
  "068": "Bolivia",
  "070": "Bosnia and Herzegovina",
  "072": "Botswana",
  "074": "Bouvet Island",
  "076": "Brazil",
  "084": "Belize",
  "086": "British Indian Ocean Territory",
  "090": "Solomon Islands",
  "092": "Virgin Islands (British)",
  "096": "Brunei Darussalam",
  "100": "Bulgaria",
  "104": "Myanmar",
  "108": "Burundi",
  "112": "Belarus",
  "116": "Cambodia",
  "120": "Cameroon",
  "124": "Canada",
  "132": "Cabo Verde",
  "136": "Cayman Islands",
  "140": "Central African Republic",
  "144": "Sri Lanka",
  "148": "Chad",
  "152": "Chile",
  "156": "China",
  "158": "Taiwan",
  "162": "Christmas Island",
  "166": "Cocos (Keeling) Islands",
  "170": "Colombia",
  "174": "Comoros",
  "175": "Mayotte",
  "178": "Congo",
  "180": "Democratic Republic of the Congo",
  "184": "Cook Islands",
  "188": "Costa Rica",
  "191": "Croatia",
  "192": "Cuba",
  "196": "Cyprus",
  "203": "Czechia",
  "204": "Benin",
  "208": "Denmark",
  "212": "Dominica",
  "214": "Dominican Republic",
  "218": "Ecuador",
  "222": "El Salvador",
  "226": "Equatorial Guinea",
  "231": "Ethiopia",
  "232": "Eritrea",
  "233": "Estonia",
  "234": "Faroe Islands",
  "238": "Falkland Islands",
  "239": "South Georgia and the South Sandwich Islands",
  "242": "Fiji",
  "246": "Finland",
  "248": "Åland Islands",
  "250": "France",
  "254": "French Guiana",
  "258": "French Polynesia",
  "260": "French Southern Territories",
  "262": "Djibouti",
  "266": "Gabon",
  "268": "Georgia",
  "270": "Gambia",
  "275": "Palestine",
  "276": "Germany",
  "288": "Ghana",
  "292": "Gibraltar",
  "296": "Kiribati",
  "300": "Greece",
  "304": "Greenland",
  "308": "Grenada",
  "312": "Guadeloupe",
  "316": "Guam",
  "320": "Guatemala",
  "324": "Guinea",
  "328": "Guyana",
  "332": "Haiti",
  "334": "Heard Island and McDonald Islands",
  "336": "Holy See",
  "340": "Honduras",
  "344": "Hong Kong",
  "348": "Hungary",
  "352": "Iceland",
  "356": "India",
  "360": "Indonesia",
  "364": "Iran",
  "368": "Iraq",
  "372": "Ireland",
  "376": "Israel",
  "380": "Italy",
  "384": "Côte d'Ivoire",
  "388": "Jamaica",
  "392": "Japan",
  "398": "Kazakhstan",
  "400": "Jordan",
  "404": "Kenya",
  "408": "North Korea",
  "410": "South Korea",
  "414": "Kuwait",
  "417": "Kyrgyzstan",
  "418": "Laos",
  "422": "Lebanon",
  "426": "Lesotho",
  "428": "Latvia",
  "430": "Liberia",
  "434": "Libya",
  "438": "Liechtenstein",
  "440": "Lithuania",
  "442": "Luxembourg",
  "446": "Macao",
  "450": "Madagascar",
  "454": "Malawi",
  "458": "Malaysia",
  "462": "Maldives",
  "466": "Mali",
  "470": "Malta",
  "474": "Martinique",
  "478": "Mauritania",
  "480": "Mauritius",
  "484": "Mexico",
  "492": "Monaco",
  "496": "Mongolia",
  "498": "Moldova",
  "499": "Montenegro",
  "500": "Montserrat",
  "504": "Morocco",
  "508": "Mozambique",
  "512": "Oman",
  "516": "Namibia",
  "520": "Nauru",
  "524": "Nepal",
  "528": "Netherlands",
  "531": "Curaçao",
  "533": "Aruba",
  "534": "Sint Maarten",
  "535": "Bonaire, Sint Eustatius and Saba",
  "540": "New Caledonia",
  "548": "Vanuatu",
  "554": "New Zealand",
  "558": "Nicaragua",
  "562": "Niger",
  "566": "Nigeria",
  "570": "Niue",
  "574": "Norfolk Island",
  "578": "Norway",
  "580": "Northern Mariana Islands",
  "581": "United States Minor Outlying Islands",
  "583": "Micronesia",
  "584": "Marshall Islands",
  "585": "Palau",
  "586": "Pakistan",
  "591": "Panama",
  "598": "Papua New Guinea",
  "600": "Paraguay",
  "604": "Peru",
  "608": "Philippines",
  "612": "Pitcairn",
  "616": "Poland",
  "620": "Portugal",
  "624": "Guinea-Bissau",
  "626": "Timor-Leste",
  "630": "Puerto Rico",
  "634": "Qatar",
  "638": "Réunion",
  "642": "Romania",
  "643": "Russia",
  "646": "Rwanda",
  "652": "Saint Barthélemy",
  "654": "Saint Helena, Ascension and Tristan da Cunha",
  "659": "Saint Kitts and Nevis",
  "660": "Anguilla",
  "662": "Saint Lucia",
  "663": "Saint Martin",
  "666": "Saint Pierre and Miquelon",
  "670": "Saint Vincent and the Grenadines",
  "674": "San Marino",
  "678": "Sao Tome and Principe",
  "682": "Saudi Arabia",
  "686": "Senegal",
  "688": "Serbia",
  "690": "Seychelles",
  "694": "Sierra Leone",
  "702": "Singapore",
  "703": "Slovakia",
  "704": "Vietnam",
  "705": "Slovenia",
  "706": "Somalia",
  "710": "South Africa",
  "716": "Zimbabwe",
  "724": "Spain",
  "728": "South Sudan",
  "729": "Sudan",
  "732": "Western Sahara",
  "740": "Suriname",
  "744": "Svalbard and Jan Mayen",
  "748": "Eswatini",
  "752": "Sweden",
  "756": "Switzerland",
  "760": "Syria",
  "762": "Tajikistan",
  "764": "Thailand",
  "768": "Togo",
  "772": "Tokelau",
  "776": "Tonga",
  "780": "Trinidad and Tobago",
  "784": "United Arab Emirates",
  "788": "Tunisia",
  "792": "Türkiye",
  "795": "Turkmenistan",
  "796": "Turks and Caicos Islands",
  "798": "Tuvalu",
  "800": "Uganda",
  "804": "Ukraine",
  "807": "North Macedonia",
  "818": "Egypt",
  "826": "United Kingdom",
  "831": "Guernsey",
  "832": "Jersey",
  "833": "Isle of Man",
  "834": "Tanzania",
  "840": "United States",
  "850": "U.S. Virgin Islands",
  "854": "Burkina Faso",
  "858": "Uruguay",
  "860": "Uzbekistan",
  "862": "Venezuela",
  "876": "Wallis and Futuna",
  "882": "Samoa",
  "887": "Yemen",
  "894": "Zambia"
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function normalise(val, invert) {
  if (val === "unknown") return "unknown";
  if (invert) {
    if (val === "no")                       return "good";
    if (val === "yes" || val === "illegal") return "bad";
    return "partial";
  }
  if (val === "yes")     return "good";
  if (val === "no")      return "bad";
  if (val === "illegal") return "bad";
  return "partial";
}

function getCountryColor(name, data) {
  if (!name || !data || !data[name]) return "var(--map-empty)";
  const d      = data[name];
  const normed = RIGHTS.map(r => normalise(d[r.key] || "unknown", r.invert));
  const unknown = normed.filter(s => s === "unknown").length;
  if (unknown === normed.length) return "var(--map-empty)";
  const hasIllegal = RIGHTS.some(r => !r.invert && d[r.key] === "illegal");
  if (hasIllegal)                return MAP_COLOR.illegal;
  const good = normed.filter(s => s === "good").length;
  const bad  = normed.filter(s => s === "bad").length;
  if (good >= 7) return MAP_COLOR.yes;
  if (bad  >= 5) return MAP_COLOR.no;
  return MAP_COLOR.partial;
}

// ─────────────────────────────────────────────
// Legend
// ─────────────────────────────────────────────

function buildLegend() {
  const items = [
    { label: "Mostly yes",   color: "var(--map-yes)" },
    { label: "Mixed",        color: "var(--map-partial)" },
    { label: "Mostly no",    color: "var(--map-no)" },
    { label: "Criminalized", color: "var(--map-illegal)" },
    { label: "No data",      color: "var(--map-empty)" },
  ];
  const legend = document.getElementById("legend");
  items.forEach(item => {
    const el = document.createElement("div");
    el.className = "legend-item";
    el.innerHTML = `<div class="legend-dot" style="background:${item.color}"></div>${item.label}`;
    legend.appendChild(el);
  });
}

// ─────────────────────────────────────────────
// Panel
// ─────────────────────────────────────────────

function showPanel(name, data) {
  document.getElementById("panel-country").textContent = name;
  document.getElementById("panel-empty").style.display  = "none";
  document.getElementById("panel-rights").style.display = "block";

  const d = data[name];
  if (!d) {
    document.getElementById("panel-sub").textContent = "No data on record";
    document.getElementById("panel-rights").innerHTML =
      `<p class="no-data-msg">No data for this country yet.<br>Add it in data.json.</p>`;
    return;
  }

  document.getElementById("panel-sub").textContent = "Trans rights overview";

  const scoreHTML = `
    <div class="score-label">Rights at a glance</div>
    <div class="score-bar">
      ${RIGHTS.map(r => {
        const val    = d[r.key] || "unknown";
        const norm   = normalise(val, r.invert);
        const col    = norm === "good"    ? "var(--yes)"
                     : norm === "partial" ? "var(--partial)"
                     : norm === "bad"     ? "var(--no)"
                     : "var(--unknown)";
        return `<div class="score-segment" style="background:${col}" title="${r.question}"></div>`;
      }).join("")}
    </div>
    ${d.note ? `<p class="right-note" style="margin-top:10px">${d.note}</p>` : ""}
  `;

const rightsHTML = RIGHTS.map(r => {
  const val  = d[r.key] || "unknown";
  const norm = normalise(val, r.invert);
  const cls  = norm === "good" ? "status-yes" : norm === "bad" ? "status-no" : norm === "partial" ? "status-partial" : "status-unknown";
  return `<div class="right-item">
    <div class="right-question">${r.question}</div>
    <span class="right-status ${cls}">${STATUS_LABEL[val]}</span>
  </div>`;
}).join("");

  document.getElementById("panel-rights").innerHTML = `
    <div style="padding-bottom:14px;border-bottom:1px solid var(--border);margin-bottom:4px">${scoreHTML}</div>
    ${rightsHTML}
  `;
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────

async function init() {
  buildLegend();

  let countryData = {};
  try {
    const res = await fetch("data.json");
    countryData = await res.json();
  } catch(e) {
    console.warn("Could not load data.json", e);
  }

  let world;
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    world = await res.json();
  } catch(e) {
    document.getElementById("map-container").innerHTML =
      `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:13px;text-align:center;padding:40px">
        Could not load map.<br><br>Run a local server first:<br>
        <code style="font-size:11px;color:var(--text-dim);margin-top:8px;display:block">python3 -m http.server 8080</code>
      </div>`;
    return;
  }

  const container = document.getElementById("map-container");
  const W = container.clientWidth;
  const H = container.clientHeight;

  const svg = d3.select("#map-container").append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.5)
    .translate([W / 2, H / 2]);

  const path = d3.geoPath().projection(projection);
  const g    = svg.append("g");

  g.append("path").datum({type:"Sphere"}).attr("class","sphere").attr("d", path);
  g.append("path").datum(d3.geoGraticule()()).attr("class","graticule").attr("d", path);

  const countries = topojson.feature(world, world.objects.countries);

  // Debug ID display — bottom-right, shows on hover
  const debugEl = document.createElement("div");
  debugEl.id = "debug-id";
  container.appendChild(debugEl);

  g.selectAll(".country")
    .data(countries.features)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", d => {
      const name = COUNTRY_NAMES[String(d.id)];
      return getCountryColor(name, countryData);
    })
    .on("mousemove", function(event, d) {
      const name = COUNTRY_NAMES[String(d.id)];
      const tip  = document.getElementById("tooltip");
      tip.textContent  = name || `(unmapped — id ${d.id})`;
      tip.style.opacity = "1";
      tip.style.left    = (event.offsetX + 12) + "px";
      tip.style.top     = (event.offsetY - 8)  + "px";
      debugEl.textContent  = `topo id: ${d.id}`;
      debugEl.style.opacity = "1";
    })
    .on("mouseleave", function() {
      document.getElementById("tooltip").style.opacity = "0";
      debugEl.style.opacity = "0";
    })
    .on("click", function(event, d) {
      document.getElementById("tooltip").style.opacity = "0";
      const name = COUNTRY_NAMES[String(d.id)];
      if (!name) return;
      d3.selectAll(".country").classed("selected", false);
      d3.select(this).classed("selected", true);
      showPanel(name, countryData);
    });

  const zoom = d3.zoom()
    .scaleExtent([0.8, 12])
    .on("zoom", e => g.attr("transform", e.transform));

  svg.call(zoom);
  document.getElementById("zoom-in").onclick    = () => svg.transition().call(zoom.scaleBy, 1.5);
  document.getElementById("zoom-out").onclick   = () => svg.transition().call(zoom.scaleBy, 0.67);
  document.getElementById("zoom-reset").onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);
}

init();
