// map.js — rendering, zoom, pan, click, panel

const COUNTRY_NAMES = {
  "004": "Afghanistan",      "008": "Albania",                  "012": "Algeria",
  "024": "Angola",           "028": "Antigua and Barbuda",      "031": "Azerbaijan",
  "032": "Argentina",        "036": "Australia",                "040": "Austria",
  "044": "Bahamas",          "048": "Bahrain",                  "050": "Bangladesh",
  "051": "Armenia",          "052": "Barbados",                 "056": "Belgium",
  "064": "Bhutan",           "068": "Bolivia",                  "070": "Bosnia and Herzegovina",
  "072": "Botswana",         "076": "Brazil",                   "084": "Belize",
  "090": "Solomon Islands",  "096": "Brunei Darussalam",        "100": "Bulgaria",
  "104": "Myanmar",          "108": "Burundi",                  "112": "Belarus",
  "116": "Cambodia",         "120": "Cameroon",                 "124": "Canada",
  "132": "Cabo Verde",       "140": "Central African Republic", "144": "Sri Lanka",
  "148": "Chad",             "152": "Chile",                    "156": "China",
  "158": "Taiwan",           "170": "Colombia",                 "174": "Comoros",
  "178": "Congo",            "180": "Democratic Republic of the Congo",
  "184": "Cook Islands",     "188": "Costa Rica",               "191": "Croatia",
  "192": "Cuba",             "196": "Cyprus",                   "203": "Czechia",
  "204": "Benin",            "208": "Denmark",                  "212": "Dominica",
  "214": "Dominican Republic","218": "Ecuador",                 "222": "El Salvador",
  "226": "Equatorial Guinea","231": "Ethiopia",                 "232": "Eritrea",
  "233": "Estonia",          "238": "Falkland Islands",         "242": "Fiji",
  "246": "Finland",          "250": "France",                   "262": "Djibouti",
  "266": "Gabon",            "268": "Georgia",                  "270": "Gambia",
  "275": "Palestine",        "276": "Germany",                  "288": "Ghana",
  "296": "Kiribati",         "300": "Greece",                   "304": "Greenland",
  "308": "Grenada",          "320": "Guatemala",                "324": "Guinea",
  "328": "Guyana",           "332": "Haiti",                    "340": "Honduras",
  "348": "Hungary",          "352": "Iceland",                  "356": "India",
  "360": "Indonesia",        "364": "Iran",                     "368": "Iraq",
  "372": "Ireland",          "376": "Israel",                   "380": "Italy",
  "384": "Côte d'Ivoire",    "388": "Jamaica",                  "392": "Japan",
  "398": "Kazakhstan",       "400": "Jordan",                   "404": "Kenya",
  "408": "North Korea",      "410": "South Korea",              "414": "Kuwait",
  "417": "Kyrgyzstan",       "418": "Laos",                     "422": "Lebanon",
  "426": "Lesotho",          "428": "Latvia",                   "430": "Liberia",
  "434": "Libya",            "440": "Lithuania",                "442": "Luxembourg",
  "450": "Madagascar",       "454": "Malawi",                   "458": "Malaysia",
  "462": "Maldives",         "466": "Mali",                     "470": "Malta",
  "478": "Mauritania",       "480": "Mauritius",                "484": "Mexico",
  "496": "Mongolia",         "498": "Moldova",                  "499": "Montenegro",
  "504": "Morocco",          "508": "Mozambique",               "512": "Oman",
  "516": "Namibia",          "520": "Nauru",                    "524": "Nepal",
  "528": "Netherlands",      "540": "New Caledonia",            "548": "Vanuatu",
  "554": "New Zealand",      "558": "Nicaragua",                "562": "Niger",
  "566": "Nigeria",          "578": "Norway",                   "583": "Micronesia",
  "584": "Marshall Islands", "585": "Palau",                    "586": "Pakistan",
  "591": "Panama",           "598": "Papua New Guinea",         "600": "Paraguay",
  "604": "Peru",             "608": "Philippines",              "616": "Poland",
  "620": "Portugal",         "624": "Guinea-Bissau",            "626": "Timor-Leste",
  "630": "Puerto Rico",      "634": "Qatar",                    "642": "Romania",
  "643": "Russia",           "646": "Rwanda",                   "659": "Saint Kitts and Nevis",
  "662": "Saint Lucia",      "670": "Saint Vincent and the Grenadines",
  "678": "Sao Tome and Principe", "682": "Saudi Arabia",        "686": "Senegal",
  "688": "Serbia",           "690": "Seychelles",               "694": "Sierra Leone",
  "702": "Singapore",        "703": "Slovakia",                 "704": "Vietnam",
  "705": "Slovenia",         "706": "Somalia",                  "710": "South Africa",
  "716": "Zimbabwe",         "724": "Spain",                    "728": "South Sudan",
  "729": "Sudan",            "732": "Western Sahara",           "740": "Suriname",
  "748": "Eswatini",         "752": "Sweden",                   "756": "Switzerland",
  "760": "Syria",            "762": "Tajikistan",               "764": "Thailand",
  "768": "Togo",             "776": "Tonga",                    "780": "Trinidad and Tobago",
  "784": "United Arab Emirates", "788": "Tunisia",              "792": "Türkiye",
  "795": "Turkmenistan",     "798": "Tuvalu",                   "800": "Uganda",
  "804": "Ukraine",          "807": "North Macedonia",          "818": "Egypt",
  "826": "United Kingdom",   "834": "Tanzania",                 "840": "United States",
  "854": "Burkina Faso",     "858": "Uruguay",                  "860": "Uzbekistan",
  "862": "Venezuela",        "882": "Samoa",                    "887": "Yemen",
  "894": "Zambia",
};

// ─── HELPERS ─────────────────────────────────

function normalise(val, invert) {
  if (!val || val === "unknown") return "unknown";
  if (val === "death_penalty")   return "death";
  if (invert) {
    if (val === "no")  return "good";
    if (val === "yes") return "bad";
    return "partial";
  }
  if (val === "yes") return "good";
  if (val === "no")  return "bad";
  return "partial";
}

function getCountryColor(name, data) {
  if (!name || !data[name]) return MAP_COLOR.empty;
  const d      = data[name];
  const normed = RIGHTS.map(r => normalise(d[r.key] || "unknown", r.invert));
  if (normed.includes("death")) return MAP_COLOR.death;
  const unk     = normed.filter(s => s === "unknown").length;
  const good    = normed.filter(s => s === "good").length;
  const bad     = normed.filter(s => s === "bad").length;
  const partial = normed.filter(s => s === "partial").length;
  if (unk >= good && unk >= bad && unk >= partial) return MAP_COLOR.empty;
  const known = normed.filter(s => s !== "unknown");
  if (good / known.length >= 0.5) return MAP_COLOR.yes;
  if (bad  / known.length >= 0.5) return MAP_COLOR.no;
  return MAP_COLOR.partial;
}

function getQuestionColor(name, data, key) {
  if (!name || !data[name]) return MAP_COLOR.empty;
  const rule = RIGHTS.find(r => r.key === key);
  if (!rule) return getCountryColor(name, data);

  const raw = data[name][key] || "unknown";
  const norm = normalise(raw, rule.invert);
  if (norm === "death") return MAP_COLOR.death;
  if (norm === "good") return MAP_COLOR.yes;
  if (norm === "bad") return MAP_COLOR.no;
  if (norm === "partial") return MAP_COLOR.partial;
  return MAP_COLOR.empty;
}

function matchesQuestionStatus(name, data, key, status) {
  if (key === "all" || status === "all") return true;
  if (!name || !data[name]) return status === "unknown";
  return (data[name][key] || "unknown") === status;
}

// ─── PANEL ───────────────────────────────────

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
        const norm = normalise(d[r.key] || "unknown", r.invert);
        const col  = norm === "good"    ? "var(--yes)"
                   : norm === "death"   ? "var(--death-color)"
                   : norm === "bad"     ? "var(--no)"
                   : norm === "partial" ? "var(--partial)"
                   : "var(--unknown)";
        return `<div class="score-segment" style="background:${col}" title="${r.question}"></div>`;
      }).join("")}
    </div>
    ${d.note ? `<p class="right-note" style="margin-top:10px">${d.note}</p>` : ""}
  `;

  const rightsHTML = RIGHTS.map(r => {
    const val  = d[r.key] || "unknown";
    const norm = normalise(val, r.invert);
    const cls  = val === "death_penalty" ? "status-death"
               : norm === "good"         ? "status-yes"
               : norm === "bad"          ? "status-no"
               : norm === "partial"      ? "status-partial"
               : "status-unknown";
    return `<div class="right-item">
      <div class="right-question">${r.question}</div>
      <span class="right-status ${cls}">${STATUS_LABEL[val] || val}</span>
    </div>`;
  }).join("");

  document.getElementById("panel-rights").innerHTML = `
    <div style="padding-bottom:14px;border-bottom:1px solid var(--border);margin-bottom:4px">${scoreHTML}</div>
    ${rightsHTML}
  `;
}

// ─── INIT ─────────────────────────────────────

async function init() {
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
        Could not load map.<br><br>Run a local server:<br>
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

  svg.append("defs").append("clipPath")
    .attr("id", "sphere-clip")
    .append("path").datum({type:"Sphere"}).attr("d", path);
  g.attr("clip-path", "url(#sphere-clip)");

  g.append("path").datum({type:"Sphere"}).attr("class","sphere").attr("d", path);
  g.append("path").datum(d3.geoGraticule()()).attr("class","graticule").attr("d", path);

  const countries = topojson.feature(world, world.objects.countries);
  const countryList = countries.features
    .map(feature => ({ id: String(feature.id), name: COUNTRY_NAMES[String(feature.id)] }))
    .filter(country => country.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  const searchInput = document.getElementById("country-search");
  const suggestions = document.getElementById("country-suggestions");
  const clearSearch = document.getElementById("clear-search");
  const clearQuestion = document.getElementById("clear-question");
  const clearMap = document.getElementById("clear-map");
  const legend = document.getElementById("map-legend");
  const questionFilter = document.getElementById("question-filter");
  const statusFilter = document.getElementById("status-filter");
  let activeSuggestion = -1;
  let selectedCountryId = null;

  questionFilter.insertAdjacentHTML("beforeend", RIGHTS
    .map(right => `<option value="${right.key}">${right.question}</option>`)
    .join(""));

  // Map credit — bottom right
  const creditEl = document.createElement("div");
  creditEl.id = "map-credit";
  creditEl.innerHTML = `Map: <a href="https://github.com/topojson/world-atlas" target="_blank">Natural Earth / world-atlas</a>`;
  container.appendChild(creditEl);

  function clearSelectedCountry() {
  selectedCountryId = null;

  d3.selectAll(".country")
    .classed("selected", false);

  document.getElementById("panel-country").textContent = "Select a country";
  document.getElementById("panel-sub").textContent = "Click on the map";

  document.getElementById("panel-empty").style.display = "block";

  document.getElementById("panel-rights").style.display = "none";
  document.getElementById("panel-rights").innerHTML = "";
}

  function closeSuggestions() {
    activeSuggestion = -1;
    suggestions.classList.remove("is-open");
    suggestions.innerHTML = "";
    searchInput.setAttribute("aria-expanded", "false");
  }

  function getSearchMatches() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return [];

    return countryList
      .filter(country => country.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        return Number(bStarts) - Number(aStarts) || a.name.localeCompare(b.name);
      })
      .slice(0, 7);
  }

  function renderSuggestions() {
    const matches = getSearchMatches();
    suggestions.innerHTML = "";

    if (!matches.length) {
      closeSuggestions();
      return;
    }

    matches.forEach((country, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "suggestion-option";
      option.id = `country-suggestion-${index}`;
      option.setAttribute("role", "option");
      option.textContent = country.name;
      option.addEventListener("mousedown", event => event.preventDefault());
      option.addEventListener("click", () => {
        selectCountryByName(country.name);
        closeSuggestions();
      });
      suggestions.appendChild(option);
    });

    activeSuggestion = -1;
    suggestions.classList.add("is-open");
    searchInput.setAttribute("aria-expanded", "true");
  }

  function moveActiveSuggestion(direction) {
    const options = [...suggestions.querySelectorAll(".suggestion-option")];
    if (!options.length) return false;

    activeSuggestion = (activeSuggestion + direction + options.length) % options.length;
    options.forEach((option, index) => {
      option.classList.toggle("is-active", index === activeSuggestion);
      option.setAttribute("aria-selected", index === activeSuggestion ? "true" : "false");
    });
    return true;
  }

  function updateLegend() {
    const questionKey = questionFilter.value;
    const questionText = questionKey === "all"
      ? "Overall rights score"
      : questionFilter.options[questionFilter.selectedIndex].text;
    const rows = questionKey === "all"
      ? [
          ["var(--map-yes)", "Mostly protective"],
          ["var(--map-partial)", "Mixed / partial"],
          ["var(--map-no)", "Mostly restrictive"],
          ["var(--map-death)", "Death penalty risk"],
          ["var(--map-empty)", "No data"],
        ]
      : [
          ["var(--map-yes)", "Protective answer"],
          ["var(--map-partial)", "Partial / varies"],
          ["var(--map-no)", "Restrictive answer"],
          ["var(--map-death)", "Death penalty"],
          ["var(--map-empty)", "No data"],
        ];

    legend.innerHTML = `
      <div class="legend-title">${questionText}</div>
      ${rows.map(([color, label]) => `
        <div class="legend-row">
          <span class="legend-swatch" style="background:${color}"></span>
          <span>${label}</span>
        </div>
      `).join("")}
    `;
  }

  function selectCountryByName(name) {
  const match = countryList.find(
    country => country.name.toLowerCase() === name.toLowerCase()
  );

  if (!match) return false;

  selectedCountryId = String(match.id);

  d3.selectAll(".country")
    .classed(
      "selected",
      d => String(d.id) === selectedCountryId
    );

  showPanel(match.name, countryData);

  searchInput.value = match.name;

  applyFilters();

  closeSuggestions();

  return true;
}

  function selectFirstSearchMatch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return false;
    const match = countryList.find(country => country.name.toLowerCase().includes(query));
    return match ? selectCountryByName(match.name) : false;
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const questionKey = questionFilter.value;

    statusFilter.disabled = questionKey === "all";
    if (questionKey === "all") statusFilter.value = "all";
    clearQuestion.style.visibility = questionKey === "all" ? "hidden" : "visible";

    d3.selectAll(".country")
      .attr("fill", d => {
        const name = COUNTRY_NAMES[String(d.id)];
        return questionKey === "all"
          ? getCountryColor(name, countryData)
          : getQuestionColor(name, countryData, questionKey);
      })
      .classed("search-match", d => {
		const name = (COUNTRY_NAMES[String(d.id)] || "").toLowerCase();
		if (!query.length) return false;

		return (
			name === query ||
			name.startsWith(query + " ")
  );
})
      .classed("filtered-out", d => {
        const name = COUNTRY_NAMES[String(d.id)] || "";
        const normalized = name.toLowerCase();
		const searchMismatch = query.length > 0 && normalized !== query && !normalized.startsWith(query + " ");
        const statusMismatch = !matchesQuestionStatus(name, countryData, questionKey, statusFilter.value);
        return searchMismatch || statusMismatch;
      });
    updateLegend();
  }

  g.selectAll(".country")
    .data(countries.features)
    .enter().append("path")
    .attr("class", "country")
    .attr("data-country-id", d => String(d.id))
    .attr("role", "button")
    .attr("tabindex", 0)
    .attr("aria-label", d => COUNTRY_NAMES[String(d.id)] || `Country id ${d.id}`)
    .attr("d", path)
    .attr("fill", d => getCountryColor(COUNTRY_NAMES[String(d.id)], countryData))
    .on("mousemove", function(event, d) {
      const name = COUNTRY_NAMES[String(d.id)];
      const tip  = document.getElementById("tooltip");
      tip.textContent   = name || `(id ${d.id})`;
      tip.style.opacity = "1";
      tip.style.left    = (event.offsetX + 12) + "px";
      tip.style.top     = (event.offsetY - 8)  + "px";
    })
    .on("mouseleave", function() {
      document.getElementById("tooltip").style.opacity = "0";
    })
    .on("click", function(event, d) {
	  document.getElementById("tooltip").style.opacity = "0";

	  const name = COUNTRY_NAMES[String(d.id)];

	  if (!name) return;

	  selectedCountryId = String(d.id);

	  d3.selectAll(".country")
		.classed(
		  "selected",
		  c => String(c.id) === selectedCountryId
		);

	  showPanel(name, countryData);

	  searchInput.value = name;

	  applyFilters();

	  this.blur();
	})
    .on("keydown", function(event, d) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const name = COUNTRY_NAMES[String(d.id)];
      if (name) selectCountryByName(name);
    });

  searchInput.addEventListener("input", () => {
    applyFilters();
    renderSuggestions();
  });
  searchInput.addEventListener("focus", renderSuggestions);
  searchInput.addEventListener("blur", () => window.setTimeout(closeSuggestions, 120));
  searchInput.addEventListener("change", () => {
    if (searchInput.value.trim()) selectFirstSearchMatch();
  });
  searchInput.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" && moveActiveSuggestion(1)) {
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowUp" && moveActiveSuggestion(-1)) {
      event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const options = [...suggestions.querySelectorAll(".suggestion-option")];
      if (activeSuggestion >= 0 && options[activeSuggestion]) {
        selectCountryByName(options[activeSuggestion].textContent);
      } else {
        selectFirstSearchMatch();
      }
    }
    if (event.key === "Escape") {
      closeSuggestions();
    }
  });
  questionFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    closeSuggestions();
    applyFilters();
    searchInput.focus();
  });
  clearQuestion.addEventListener("click", () => {
    questionFilter.value = "all";
    statusFilter.value = "all";
    applyFilters();
  });
  clearMap.addEventListener("click", () => {
    searchInput.value = "";
    questionFilter.value = "all";
    statusFilter.value = "all";
    clearSelectedCountry();
    closeSuggestions();
    applyFilters();
  });

  applyFilters();

  const zoom = d3.zoom()
    .scaleExtent([1, 12])
    .translateExtent([[-W * 0.5, -H * 0.5], [W * 1.5, H * 1.5]])
    .on("zoom", e => g.attr("transform", e.transform));

  svg.call(zoom);
  document.getElementById("zoom-in").onclick    = () => svg.transition().call(zoom.scaleBy, 1.5);
  document.getElementById("zoom-out").onclick   = () => svg.transition().call(zoom.scaleBy, 0.67);
  document.getElementById("zoom-reset").onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);
}

init();
