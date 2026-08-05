const COUNTRY_NAMES = {
  "004": "Afghanistan",      "008": "Albania",                  "010": "Antarctica", "012": "Algeria",
  "024": "Angola",           "031": "Azerbaijan",
  "032": "Argentina",        "036": "Australia",                "040": "Austria",
  "044": "Bahamas",          "050": "Bangladesh",
  "051": "Armenia",          "056": "Belgium",
  "064": "Bhutan",           "068": "Bolivia",                  "070": "Bosnia and Herzegovina",
  "072": "Botswana",         "076": "Brazil",                   "084": "Belize",
  "090": "Solomon Islands",  "096": "Brunei Darussalam",        "100": "Bulgaria",
  "104": "Myanmar",          "108": "Burundi",                  "112": "Belarus",
  "116": "Cambodia",         "120": "Cameroon",                 "124": "Canada",
  "132": "Cabo Verde",       "140": "Central African Republic", "144": "Sri Lanka",
  "148": "Chad",             "152": "Chile",                    "156": "China",
  "158": "Taiwan",           "170": "Colombia",                 
  "178": "Republic of the Congo",            "180": "Democratic Republic of the Congo",
  "188": "Costa Rica",               "191": "Croatia",
  "192": "Cuba",             "196": "Cyprus",                   "203": "Czechia",
  "204": "Benin",            "208": "Denmark",
  "214": "Dominican Republic","218": "Ecuador",                 "222": "El Salvador",
  "226": "Equatorial Guinea","231": "Ethiopia",                 "232": "Eritrea",
  "233": "Estonia",          "238": "Falkland Islands",         "242": "Fiji",
  "246": "Finland",          "250": "France",                   "260": "French Southern Territories",
  "262": "Djibouti",
  "266": "Gabon",            "268": "Georgia",                  "270": "Gambia",
  "275": "Palestine",        "276": "Germany",                  "288": "Ghana",
  "300": "Greece",                   "304": "Greenland",
  "320": "Guatemala",                "324": "Guinea",
  "328": "Guyana",           "332": "Haiti",                    "340": "Honduras",
  "348": "Hungary",          "352": "Iceland",                  "356": "India",
  "360": "Indonesia",        "364": "Iran",                     "368": "Iraq",
  "372": "Ireland",          "376": "Israel",                   "380": "Italy",
  "384": "Ivory Coast",    "388": "Jamaica",                  "392": "Japan",
  "398": "Kazakhstan",       "400": "Jordan",                   "404": "Kenya",
  "408": "North Korea",      "410": "South Korea",              "414": "Kuwait",
  "417": "Kyrgyzstan",       "418": "Laos",                     "422": "Lebanon",
  "426": "Lesotho",          "428": "Latvia",                   "430": "Liberia",
  "434": "Libya",            "440": "Lithuania",                "442": "Luxembourg",
  "450": "Madagascar",       "454": "Malawi",                   "458": "Malaysia",
  "466": "Mali",
  "478": "Mauritania",                       "484": "Mexico",
  "496": "Mongolia",         "498": "Moldova",                  "499": "Montenegro",
  "504": "Morocco",          "508": "Mozambique",               "512": "Oman",
  "516": "Namibia",          "524": "Nepal",
  "528": "Netherlands",      "540": "New Caledonia",            "548": "Vanuatu",
  "554": "New Zealand",      "558": "Nicaragua",                "562": "Niger",
  "566": "Nigeria",          "578": "Norway",
  "586": "Pakistan",
  "591": "Panama",           "598": "Papua New Guinea",         "600": "Paraguay",
  "604": "Peru",             "608": "Philippines",              "616": "Poland",
  "620": "Portugal",         "624": "Guinea-Bissau",            "626": "Timor-Leste",
  "630": "Puerto Rico",      "634": "Qatar",                   
  "642": "Romania",
  "643": "Russia",           "646": "Rwanda",
  "682": "Saudi Arabia",        "686": "Senegal",
  "688": "Serbia",                          "694": "Sierra Leone",
  "702": "Singapore",        "703": "Slovakia",                 "704": "Vietnam",
  "705": "Slovenia",         "706": "Somalia",                  "710": "South Africa",
  "716": "Zimbabwe",         "724": "Spain",                    "728": "South Sudan",
  "729": "Sudan",            "732": "Western Sahara",           "740": "Suriname",
  "748": "Eswatini",         "752": "Sweden",                   "756": "Switzerland",
  "760": "Syria",            "762": "Tajikistan",               "764": "Thailand",
  "768": "Togo",             "780": "Trinidad and Tobago",
  "784": "United Arab Emirates", "788": "Tunisia",              "792": "Turkey",
  "795": "Turkmenistan",     "800": "Uganda",
  "804": "Ukraine",          "807": "North Macedonia",          "818": "Egypt",
  "826": "United Kingdom",   "834": "Tanzania",                 "840": "United States",
  "854": "Burkina Faso",     "858": "Uruguay",                  "860": "Uzbekistan",
  "862": "Venezuela",        "887": "Yemen",					"894": "Zambia",
};

// IDs that are sub-shapes of a named country (Cyprus bases, etc.)
// They render on the map but should behave as their parent
const SHAPE_ALIAS = {
  // Akrotiri and Dhekelia (UK bases on Cyprus) — show as Cyprus
  // These have no ID in the TopoJSON so they show as undefined — handled by the undefined guard
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function normalise(val, invert) {
  if (!val || val === "unknown") return "unknown";
  if (val === "death") return "death";
  if (invert) {
    if (val === "no") return "good";
    if (val === "yes") return "bad";
    return "partial";
  }
  if (val === "yes") return "good";
  if (val === "no") return "bad";
  return "partial";
}

function getCountryColor(name, data) {
  if (!name || !data[name]) return MAP_COLOR.empty;
  const d = data[name];
  const normed = RIGHTS.map(r => normalise(d[r.key] || "unknown", r.invert));
  if (normed.includes("death")) return MAP_COLOR.death;
  const unk = normed.filter(s => s === "unknown").length;
  const good = normed.filter(s => s === "good").length;
  const bad = normed.filter(s => s === "bad").length;
  const partial = normed.filter(s => s === "partial").length;
  if (unk >= good && unk >= bad && unk >= partial) return MAP_COLOR.empty;
  const known = normed.filter(s => s !== "unknown");
  if (good / known.length >= 0.5) return MAP_COLOR.yes;
  if (bad / known.length >= 0.5) return MAP_COLOR.no;
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

// ─── LEGEND ───────────────────────────────────────────────────────────────────

function updateLegend(questionKey) {
  const legend = document.getElementById("map-legend");
  if (!legend) return;
  const isOverall = !questionKey || questionKey === "all";
  const title = isOverall ? "Overall rights score" : RIGHTS.find(r => r.key === questionKey)?.question || "";
  const rows = isOverall
    ? [["var(--map-yes)","Mostly protective"],["var(--map-partial)","Mixed / partial"],["var(--map-no)","Mostly restrictive"],["var(--map-death)","Death penalty"],["var(--map-empty)","No data"]]
    : [["var(--map-yes)","Protective"],["var(--map-partial)","Partial / varies"],["var(--map-no)","Restrictive"],["var(--map-death)","Death penalty"],["var(--map-empty)","No data"]];
  legend.innerHTML = `<div class="legend-title">${title}</div>${rows.map(([c,l])=>`<div class="legend-row"><span class="legend-swatch" style="background:${c}"></span><span>${l}</span></div>`).join("")}`;
}

// ─── PANEL ────────────────────────────────────────────────────────────────────

function showPanel(name, data) {
  const panelCountry = document.getElementById("panel-country");
  const panelSub = document.getElementById("panel-sub");
  panelCountry.textContent = name;
  panelCountry.classList.add("has-country");
  document.getElementById("panel-empty").style.display = "none";
  document.getElementById("panel-rights").style.display = "block";
  const d = data[name];
  if (!d) {
    panelSub.style.display = "none";
    document.getElementById("panel-rights").innerHTML = `<p class="no-data-msg">No data for this country yet.`;
    if (window._openDrawer) window._openDrawer();
    return;
  }
  panelSub.style.display = "none";
  const scoreHTML = `<div class="score-label">Rights at a glance</div><div class="score-bar">${RIGHTS.map(r => {
    const norm = normalise(d[r.key] || "unknown", r.invert);
    const col = norm === "good" ? "var(--yes)" : norm === "death" ? "var(--death-color)" : norm === "bad" ? "var(--no)" : norm === "partial" ? "var(--partial)" : "var(--unknown)";
    return `<div class="score-segment" style="background:${col}" title="${r.question}"></div>`;
  }).join("")}</div>${d.note ? `<p class="right-note" style="margin-top:10px">${d.note}</p>` : ""}`;
  const rightsHTML = RIGHTS.map(r => {
    const val = d[r.key] || "unknown";
    const norm = normalise(val, r.invert);
    const cls = val === "death" ? "status-death" : norm === "good" ? "status-yes" : norm === "bad" ? "status-no" : norm === "partial" ? "status-partial" : "status-unknown";
    return `<div class="right-item"><div class="right-question">${r.question}</div><span class="right-status ${cls}">${STATUS_LABEL[val] || val}</span></div>`;
  }).join("");
  document.getElementById("panel-rights").innerHTML = `<div style="padding-bottom:14px;border-bottom:1px solid var(--border);margin-bottom:4px">${scoreHTML}</div>${rightsHTML}`;
  if (window._openDrawer) window._openDrawer();
}

function clearPanel() {
  const panelCountry = document.getElementById("panel-country");
  panelCountry.textContent = "Select a country";
  panelCountry.classList.remove("has-country");
  document.getElementById("panel-sub").style.display = "";
  document.getElementById("panel-empty").style.display = "block";
  document.getElementById("panel-rights").style.display = "none";
  document.getElementById("panel-rights").innerHTML = "";
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

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
    document.getElementById("map-container").innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:13px;text-align:center;padding:40px">Could not load map.<br><br>Run a local server:<br><code style="font-size:11px;color:var(--text-dim);margin-top:8px;display:block">python3 -m http.server 8080</code></div>`;
    return;
  }

  const container = document.getElementById("map-container");
  const W = container.clientWidth;
  const H = container.clientHeight;

  const svg = d3.select("#map-container").append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
  const projection = d3.geoNaturalEarth1().scale(W / 6.5).translate([W / 2, H / 2]);
  const path = d3.geoPath().projection(projection);
  const g = svg.append("g");

  svg.append("defs").append("clipPath").attr("id", "sphere-clip").append("path").datum({type:"Sphere"}).attr("d", path);
  g.attr("clip-path", "url(#sphere-clip)");
  g.append("path").datum({type:"Sphere"}).attr("class","sphere").attr("d", path);
  g.append("path").datum(d3.geoGraticule()()).attr("class","graticule").attr("d", path);

  const countries = topojson.feature(world, world.objects.countries);

  // build name lookup — primary: by numeric id, fallback: by properties.name for shapes with no id (Kosovo, Somaliland, etc.)
  const nameByProps = { "Kosovo": "Kosovo", "Somaliland": "Somaliland", "N. Cyprus": "Northern Cyprus", "Northern Cyprus": "Northern Cyprus", "Akrotiri": "Cyprus", "Dhekelia": "Cyprus" };

  function getShapeName(d) {
    const byId = COUNTRY_NAMES[String(d.id)];
    if (byId) return byId;
    if (d.properties && d.properties.name && nameByProps[d.properties.name]) return nameByProps[d.properties.name];
    return null;
  }
  const optionsHTML = RIGHTS.map(r => `<option value="${r.key}">${r.question}</option>`).join("");
  ["question-filter","question-filter-mobile"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.insertAdjacentHTML("beforeend", optionsHTML);
  });

  // ─── filters ──────────────────────────────────────────────────────────────

  let activeQuestion = "all";
  let activeStatus = "all";
  let selectedName = null;

  const qDesktop = document.getElementById("question-filter");
  const sDesktop = document.getElementById("status-filter");
  const qMobile = document.getElementById("question-filter-mobile");
  const sMobile = document.getElementById("status-filter-mobile");

  function recolor() {
    countryPaths.attr("fill", d => {
      const name = getShapeName(d);
      return activeQuestion === "all" ? getCountryColor(name, countryData) : getQuestionColor(name, countryData, activeQuestion);
    });
  }

  function applyFilter() {
    activeQuestion = (qDesktop && qDesktop.value !== "all") ? qDesktop.value : (qMobile && qMobile.value !== "all") ? qMobile.value : "all";
    activeStatus = (sDesktop && sDesktop.value !== "all") ? sDesktop.value : (sMobile && sMobile.value !== "all") ? sMobile.value : "all";
    if (sDesktop) sDesktop.disabled = activeQuestion === "all";
    if (sMobile) sMobile.disabled = activeQuestion === "all";
    recolor();
    updateLegend(activeQuestion);
    if (activeStatus !== "all" && activeQuestion !== "all") {
      countryPaths.classed("filtered-out", d => {
        const name = getShapeName(d);
        if (!name || !countryData[name]) return activeStatus !== "unknown";
        return (countryData[name][activeQuestion] || "unknown") !== activeStatus;
      });
    } else {
      countryPaths.classed("filtered-out", false);
    }
  }

  function syncMobileToDesktop() {
    if (qDesktop && qMobile) qDesktop.value = qMobile.value;
    if (sDesktop && sMobile) sDesktop.value = sMobile.value;
    applyFilter();
  }

  function syncDesktopToMobile() {
    if (qMobile && qDesktop) qMobile.value = qDesktop.value;
    if (sMobile && sDesktop) sMobile.value = sDesktop.value;
    applyFilter();
  }

  if (qDesktop) qDesktop.addEventListener("change", syncDesktopToMobile);
  if (sDesktop) sDesktop.addEventListener("change", syncDesktopToMobile);
  if (qMobile) qMobile.addEventListener("change", () => { if (qMobile.value === "all" && sMobile) sMobile.value = "all"; syncMobileToDesktop(); });
  if (sMobile) sMobile.addEventListener("change", syncMobileToDesktop);

  // clear buttons
  const clearSearch = document.getElementById("clear-search");
  const clearQuestion = document.getElementById("clear-question");
  if (clearQuestion) clearQuestion.addEventListener("click", () => {
    if (qDesktop) qDesktop.value = "all";
    if (sDesktop) sDesktop.value = "all";
    if (qMobile) qMobile.value = "all";
    if (sMobile) sMobile.value = "all";
    applyFilter();
  });

  // ─── country paths ────────────────────────────────────────────────────────

  const countryPaths = g.selectAll(".country")
    .data(countries.features)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", d => getCountryColor(getShapeName(d), countryData))
    .on("mousemove", function(event, d) {
      const name = getShapeName(d);
      const tip = document.getElementById("tooltip");
      if (!name) { tip.style.opacity = "0"; return; }
      tip.textContent = name;
      tip.style.opacity = "1";
      tip.style.left = (event.offsetX + 12) + "px";
      tip.style.top = (event.offsetY - 8) + "px";
    })
    .on("mouseleave", function() {
      document.getElementById("tooltip").style.opacity = "0";
    })
    .on("click", function(event, d) {
      document.getElementById("tooltip").style.opacity = "0";
      const name = getShapeName(d);
      if (!name) {
        // clicked blank/unknown area — deselect
        d3.selectAll(".country").classed("selected", false);
        selectedName = null;
        clearPanel();
        return;
      }
      selectedName = name;
      d3.selectAll(".country").classed("selected", false);
      d3.select(this).classed("selected", true);
      showPanel(name, countryData);
    });

  // click on sphere (ocean) also deselects
  g.select(".sphere").on("click", () => {
    d3.selectAll(".country").classed("selected", false);
    selectedName = null;
    clearPanel();
  });

  // ─── zoom ─────────────────────────────────────────────────────────────────

  const zoom = d3.zoom().scaleExtent([1, 12]).translateExtent([[-W * 0.5, -H * 0.5], [W * 1.5, H * 1.5]]).on("zoom", e => g.attr("transform", e.transform));
  svg.call(zoom);
  document.getElementById("zoom-in").onclick = () => svg.transition().call(zoom.scaleBy, 1.5);
  document.getElementById("zoom-out").onclick = () => svg.transition().call(zoom.scaleBy, 0.67);
  document.getElementById("zoom-reset").onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);

  // ─── search ───────────────────────────────────────────────────────────────

  const allNames = [...new Set([...Object.values(COUNTRY_NAMES), ...Object.values(nameByProps)])].sort();
  const searchInput = document.getElementById("country-search");
  const searchResults = document.getElementById("country-suggestions");

  function zoomToCountry(name) {
    const feature = countries.features.find(f => getShapeName(f) === name);
    if (!feature) return;
    const [[x0,y0],[x1,y1]] = path.bounds(feature);
    const cx = (x0+x1)/2, cy = (y0+y1)/2;
    const scale = Math.min(8, 0.9 / Math.max((x1-x0)/W, (y1-y0)/H));
    svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity.translate(W/2, H/2).scale(scale).translate(-cx, -cy));
    d3.selectAll(".country").classed("selected", false);
    countryPaths.filter(f => getShapeName(f) === name).classed("selected", true);
    selectedName = name;
    showPanel(name, countryData);
  }

  function closeSuggestions() {
    searchResults.innerHTML = "";
    searchResults.classList.remove("is-open");
  }

  function renderSuggestions(q) {
    searchResults.innerHTML = "";
    if (!q) { closeSuggestions(); return; }
    const matches = allNames.filter(n => n.toLowerCase().startsWith(q.toLowerCase())).slice(0, 7);
    if (!matches.length) { closeSuggestions(); return; }
    matches.forEach(name => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "suggestion-option";
      btn.textContent = name;
      btn.addEventListener("mousedown", e => e.preventDefault());
      btn.addEventListener("click", () => {
        searchInput.value = name;
        closeSuggestions();
        zoomToCountry(name);
      });
      searchResults.appendChild(btn);
    });
    searchResults.classList.add("is-open");
  }

  searchInput.addEventListener("input", () => renderSuggestions(searchInput.value.trim()));
  searchInput.addEventListener("blur", () => setTimeout(closeSuggestions, 150));
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Escape") { searchInput.value = ""; closeSuggestions(); }
    if (e.key === "Enter") {
      const first = allNames.find(n => n.toLowerCase().startsWith(searchInput.value.trim().toLowerCase()));
      if (first) { searchInput.value = first; closeSuggestions(); zoomToCountry(first); }
    }
  });

  if (clearSearch) clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    closeSuggestions();
    searchInput.focus();
  });

  document.addEventListener("click", e => {
    if (!document.getElementById("search-zone") && !e.target.closest(".search-zone")) closeSuggestions();
  });

  // initial legend
  updateLegend("all");
}

init();

// ─── MOBILE DRAWER ────────────────────────────────────────────────────────────

function initDrawer() {
  const panel = document.getElementById("panel");
  const handle = document.getElementById("panel-header");
  const isMobile = () => window.innerWidth <= 768;

  function openDrawer() { panel.classList.add("drawer-open"); }
  function closeDrawer() { panel.classList.remove("drawer-open"); }
  function isOpen() { return panel.classList.contains("drawer-open"); }

  window._openDrawer = openDrawer;

  const toggleBtn = document.getElementById("filters-toggle");
  const filtersBody = document.getElementById("filters-body");
  if (toggleBtn) toggleBtn.addEventListener("click", () => {
    const collapsed = filtersBody.classList.toggle("is-collapsed");
    toggleBtn.parentElement.classList.toggle("filters-open", !collapsed);
  });

  const legendToggle = document.getElementById("legend-toggle");
  const legendBody = document.getElementById("panel-legend-body");
  if (legendToggle) legendToggle.addEventListener("click", () => {
    const collapsed = legendBody.classList.toggle("is-collapsed");
    legendToggle.parentElement.classList.toggle("filters-open", !collapsed);
  });

  // keep mobile legend in sync with desktop legend
  const desktopLegend = document.getElementById("map-legend");
  if (legendBody && desktopLegend) {
    const observer = new MutationObserver(() => { legendBody.innerHTML = desktopLegend.innerHTML; });
    observer.observe(desktopLegend, { childList: true, subtree: true });
    legendBody.innerHTML = desktopLegend.innerHTML;
  }

  let startY = 0, startOpen = false;
  handle.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
    startOpen = isOpen();
    panel.style.transition = "none";
  }, { passive: true });
  handle.addEventListener("touchmove", e => {
    if (!isMobile()) return;
    const dy = e.touches[0].clientY - startY;
    const peek = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--drawer-peek"));
    const base = startOpen ? 0 : panel.offsetHeight - peek;
    const next = Math.max(0, Math.min(panel.offsetHeight - peek, base + dy));
    panel.style.transform = `translateY(${next}px)`;
  }, { passive: true });
  handle.addEventListener("touchend", e => {
    if (!isMobile()) return;
    panel.style.transition = "";
    panel.style.transform = "";
    const dy = e.changedTouches[0].clientY - startY;
    if (startOpen) { if (dy > 60) closeDrawer(); else openDrawer(); }
    else { if (dy < -60) openDrawer(); else closeDrawer(); }
  });
  handle.addEventListener("click", () => { if (isMobile()) isOpen() ? closeDrawer() : openDrawer(); });
  document.getElementById("map-container").addEventListener("touchstart", () => { if (isMobile() && isOpen()) closeDrawer(); }, { passive: true });
}

initDrawer();