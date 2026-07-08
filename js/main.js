const inSpaceBtn = document.querySelector('[data-section="today-in-space"]');
const launchesBtn = document.querySelector('[data-section="launches"]');
const planetsBtn = document.querySelector('[data-section="planets"]');
const inSpaceSection = document.querySelector("#today-in-space");
const launchSection = document.querySelector("#launches");
const planetSection = document.querySelector("#planets");
const sections = document.querySelectorAll("div section");
const planets = document.querySelectorAll('[data-planet-id]');
const apodTitle = document.querySelector("#apod-title");
const apodExplanation = document.querySelector("#apod-explanation");
const apodDateInfo = document.querySelector("#apod-date-info");
const apodDateDetail = document.querySelector("#apod-date-detail");
const apodCopyright = document.querySelector("#apod-copyright");
const apodDate = document.querySelector("#apod-date");
const apodInput = document.querySelector("#apod-date-input")
const apodImg = document.querySelector("#apod-image");
const apodLoading = document.querySelector("#apod-loading");
const apodUrl = "https://api.nasa.gov/planetary/apod?api_key=GGHMzg3aCDXxLBARyzJ3kzdT4Rk27O7abTWItDB0";
const planetsUrl = "https://solar-system-opendata-proxy.vercel.app/api/planets";
const launchesUrl = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?";
const fullResBtn = document.querySelector("#apod-image-container button");
const imgContainer = document.querySelector("#apod-image-container");
const loadBtn = document.querySelector("#load-date-btn");
const todayBtn = document.querySelector("#today-apod-btn");
const toggleBtn = document.querySelector("#sidebar-toggle"); 
const sidebar = document.querySelector("#sidebar");
const btns = [planetsBtn, launchesBtn, inSpaceBtn];

let apod;
let imgUrl;
let launchesData = [];
let planetsList = [];
let planetId;
let normalizedDate
let newApod;

window.addEventListener("load", () => {
  getApodData()
  getLaunchesData()
  getPlanet()
})

btns.forEach(btn => {
  btn.addEventListener("click", e => {

    btns.forEach(btn => {
      btn.classList.remove("bg-blue-500/10", "text-blue-400")
    })

    e.currentTarget.classList.remove("text-slate-300")
    e.currentTarget.classList.add("bg-blue-500/10", "text-blue-400")

  })
})

inSpaceBtn.addEventListener("click", e => {
  showSection(inSpaceSection)
})

launchesBtn.addEventListener("click", e => {
  showSection(launchSection);
})

planetsBtn.addEventListener("click", e => {
  showSection(planetSection)
});

toggleBtn.addEventListener("click", e => {
  // sidebar.classList.add("sidebar-mobile.sidebar-open")
  sidebar.classList.toggle("sidebar-mobile")
})

apodInput.addEventListener("input", e => {
  const chosenDate = apodInput.value;
  apodInput.nextElementSibling.innerHTML = chosenDate;
  searchByDate(chosenDate)
});

loadBtn.addEventListener("click", e => {
  displayApodData(newApod)
})

todayBtn.addEventListener("click", e => {
  apodInput.nextElementSibling.innerHTML = apod.date.split("T")[0];
  displayApodData(apod)
})

fullResBtn.addEventListener("click", e => {
  window.open(`${imgUrl}`, '_blank');
})

planets.forEach(planet => {
  planet.addEventListener("click", e => {

    planetId = e.currentTarget.getAttribute("data-planet-id")
    switchPlanet()

  })
})

function showSection(activeSection) {
  sections.forEach(section => {

    section.style.display = section === activeSection ? "block" : "none";

  });
}

async function getApodData() {
  const loading = "loading...";
  apodTitle.innerHTML = loading;
  apodExplanation.innerHTML = "Loading description...";
  apodDateInfo.innerHTML = loading;
  apodDateDetail.innerHTML = loading;
  apodDate.innerHTML = loading;
  apodLoading.classList.remove("hidden");

  try {
    const response = await fetch(apodUrl);
    const data = await response.json();
    apod = data;

    apodLoading.classList.add("hidden");
    imgUrl = data.url;

    displayApodData(data);
    normalizeDate();
  }
  catch (error) {
    const loadingError = "error loading";
    apodTitle.innerHTML = `${loadingError} title`;
    apodExplanation.innerHTML = `${loadingError} description`;
    apodDateInfo.innerHTML = `${loadingError} date`;
    apodDateDetail.innerHTML = `${loadingError} date`;
    apodDate.innerHTML = `${loadingError} date`;
    apodLoading.classList.add("hidden");
    createErrorScreen();
  }
}

function displayApodData(obj) {
  const existingError = imgContainer.querySelector(".fa-triangle-exclamation")?.parentElement;
  if (existingError) {
    existingError.remove();
  }

  apodTitle.innerHTML = obj.title;
  apodExplanation.innerHTML = obj.explanation;
  apodDateInfo.innerHTML = dateFormatter(obj.date);
  apodDateDetail.innerHTML = dateFormatter(obj.date);
  apodDate.innerHTML = `Astronomy Picture of the Day - ${dateFormatter(obj.date)}`;
  apodCopyright.innerHTML = `&copy; ${obj.copyright || "unknown"}`;

  const existingIframe = imgContainer.querySelector("iframe");
  if (existingIframe) {
    existingIframe.remove();
  }

  if (obj.media_type === "video") {
    apodImg.classList.add("hidden");

    const videoPlayer = document.createElement("iframe");
    videoPlayer.src = obj.url;
    videoPlayer.className = "w-full h-full";
    videoPlayer.setAttribute("frameborder", "0");
    videoPlayer.setAttribute("allowfullscreen", "");

    imgContainer.appendChild(videoPlayer);
  } else {
    apodImg.classList.remove("hidden");
    apodImg.setAttribute("src", obj.url);
  }

  apodInput.value = obj.date.split("T")[0];
}

function normalizeDate() {
  const normalizedDate = apod.date.split("T")[0];
  apodInput.max = new Date().toISOString().split("T")[0];
  apodInput.min = "1995-06-16"
  apodInput.value = normalizedDate;
  apodInput.nextElementSibling.innerHTML = normalizedDate;
}

async function searchByDate(date) {
  try {
    const response = await fetch(`${apodUrl}&date=${encodeURIComponent(date)}`);
    const data = await response.json();
    newApod = data
  } catch (error) { }
}

function createErrorScreen() {
  const errorScreen = document.createElement("div");
  const errorTitle = document.createElement("h3");
  const errorDesc = document.createElement("span");
  const alert = document.createElement("span");
  const titleNode = document.createTextNode("Failed to load today's image");
  const descNode = document.createTextNode("Please try again later");

  errorDesc.style.cssText = `color:#596980`
  errorTitle.style.cssText = `color : #8E9EB6 ; font-size:20px`
  alert.classList.add("fa-solid", "fa-triangle-exclamation");
  alert.style.cssText = `color: #FF6467 ; 
  font-size: 36px`
  errorScreen.classList.add("text-center", "absolute");

  errorScreen.appendChild(alert);
  errorScreen.appendChild(errorTitle);
  errorTitle.appendChild(titleNode);
  errorDesc.appendChild(descNode);
  errorScreen.appendChild(errorDesc);
  imgContainer.appendChild(errorScreen);
}

async function getLaunchesData() {

  try {

    const response = await fetch(`${launchesUrl}limit=10`);
    const data = await response.json()
    launchesData = data.results
    displayLaunches()

  }
  catch (error) {

  }
}

function displayLaunches() {
  const imgPlaceholder = "./images/launch-placeholder.png";
  const featuredLaunch = document.querySelector("#featured-launch")
  const cardGrid = document.querySelector("#launches-grid");

  let box = "";
  let box2 = "";

  launchesData.slice(1).forEach(data => {
    box += ` <div
        class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
        <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
            <img src="${data.image?.image_url}" alt="${data.name || 'Launch Image'}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${imgPlaceholder}';">
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
              ${data.status?.abbrev || 'N/A'}
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              ${data.name || 'Unknown Launch'}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${data.launch_service_provider?.name || 'Unknown Provider'}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${dateFormatter(data.net)}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${timeFormatter(data.net)}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">${data.rocket?.configuration?.families?.[0]?.name || 'N/A'}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${data.pad?.location?.name || 'Unknown Location'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button
              class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
              Details
            </button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>`;
  });

  launchesData.slice(0, 1).forEach(data => {
    box2 += `<div
            class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
            <div
              class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
              </div>
            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
              <div class="flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-4">
                    <span
                      class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                      <i class="fas fa-star"></i>
                      Featured Launch
                    </span>
                    <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      ${data.status?.abbrev}
                    </span>
                  </div>
                  <h3 class="text-3xl font-bold mb-3 leading-tight">
                    ${data.name}
                  </h3>
                  <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-building"></i>
                      <span>${data.launch_service_provider?.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-rocket"></i>
                      <span>${data.rocket?.configuration?.families?.[0]?.name}</span>
                    </div>
                  </div>
                  <div
                    class="${isTwoDaysFromNow(dateFormatter(data.net)) ? "inline-flex" : "hidden"} items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                    <i class="fas fa-clock text-2xl text-blue-400"></i>
                    <div>
                      <p class="text-2xl font-bold text-blue-400">2</p>
                      <p class="text-xs text-slate-400">Days Until Launch</p>
                    </div>
                  </div>
                  <div class="grid xl:grid-cols-2 gap-4 mb-6">
                    <div class="bg-slate-900/50 rounded-xl p-4">
                      <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                        <i class="fas fa-calendar"></i>
                        Launch Date
                      </p>
                      <p class="font-semibold">${dateFormatter(data.net)}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                      <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                        <i class="fas fa-clock"></i>
                        Launch Time
                      </p>
                      <p class="font-semibold">${timeFormatter(data.net)}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                      <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                        <i class="fas fa-map-marker-alt"></i>
                        Location
                      </p>
                      <p class="font-semibold text-sm">${data.pad?.location?.name}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                      <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                        <i class="fas fa-globe"></i>
                        Country
                      </p>
                      <p class="font-semibold">${data.pad.country.alpha_3_code}</p>
                    </div>
                  </div>
                  <p class="text-slate-300 leading-relaxed mb-6">
                    ${data.mission.description}
                  </p>
                </div>
                <div class="flex flex-col md:flex-row gap-3">
                  <button
                    class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                    <i class="fas fa-info-circle"></i>
                    View Full Details
                  </button>
                  <div class="icons self-end md:self-center">
                    <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                      <i class="far fa-heart"></i>
                    </button>
                    <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                      <i class="fas fa-bell"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="relative">
                <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                  <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                  <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                    <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                  </div>
                  <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent">
                    <img src="${data.image?.image_url}" alt="${data.name || 'Launch Image'}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${imgPlaceholder}'">
                  </div>
                </div>
              </div>
            </div>
          </div>`
  })

  cardGrid.innerHTML = box;
  featuredLaunch.innerHTML = box2

}

function isTwoDaysFromNow(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate.getTime() === twoDaysFromNow.getTime();
}

function dateFormatter(date) {
  if (!date) return "loading...";

  const today = new Date(date);
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return formattedDate;
}

function timeFormatter(time) {
  const exactTime = new Date(time);
  const localTime = exactTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });

  return `${localTime} UTC`;
}

async function getPlanet() {
  try {
    const response = await fetch(`${planetsUrl}`);
    const data = await response.json();

    planetsList = data.bodies
    displayTableData()

  } catch (error) {
    error
  }
}

function switchPlanet() {
  const planetImg = document.querySelector("#planet-detail-image");
  const planetName = document.querySelector("#planet-detail-name");
  const planetDesc = document.querySelector("#planet-detail-description");
  const planetDistance = document.querySelector("#planet-distance");
  const planetRadius = document.querySelector("#planet-radius");
  const planetMass = document.querySelector("#planet-mass");
  const planetDensity = document.querySelector("#planet-density");
  const planetOrbitalPeriod = document.querySelector("#planet-orbital-period");
  const planetRotation = document.querySelector("#planet-rotation");
  const planetMoons = document.querySelector("#planet-moons");
  const planetGravity = document.querySelector("#planet-gravity");
  const planetDiscoverer = document.querySelector("#planet-discoverer");
  const planetDiscoveryDate = document.querySelector("#planet-discovery-date");
  const planetBodyType = document.querySelector("#planet-body-type");
  const planetVol = document.querySelector("#planet-volume");
  const planetPerihelion = document.querySelector("#planet-perihelion");
  const planetAphelion = document.querySelector("#planet-aphelion");
  const planetInclination = document.querySelector("#planet-inclination");
  const planetEccentricity = document.querySelector("#planet-eccentricity");
  const planetAxialTilt = document.querySelector("#planet-axial-tilt");
  const planetTemp = document.querySelector("#planet-temp");
  const planetEscape = document.querySelector("#planet-escape");
  const planetFacts = document.querySelector("#planet-facts");

  let box = "";

  for (let i = 0; i < planetsList.length; i++) {

    const planetsData = planetsList[i]

    if (planetId == planetsData.englishName.toLowerCase()) {

      planetImg.setAttribute("src", planetsData.image)
      planetName.innerHTML = planetsData.englishName
      planetDesc.innerHTML = planetsData.description

      planetDistance.innerHTML = `${(planetsData.semimajorAxis / 1000000).toFixed(1)}M km`
      planetRadius.innerHTML = `${planetsData.meanRadius.toFixed()} km`
      planetMass.innerHTML = `${planetsData.mass.massValue} x 10<sup>${planetsData.mass.massExponent}</sup> kg`
      planetDensity.innerHTML = `${planetsData.density.toFixed(2)} g/cm<sup>3</sup>`
      planetOrbitalPeriod.innerHTML = `${planetsData.sideralOrbit.toFixed(2)} days`
      planetRotation.innerHTML = `${Math.round(planetsData.sideralRotation)} hours`
      planetGravity.innerHTML = `${planetsData.gravity.toFixed(2)} m/s<sup>2</sup>`
      planetBodyType.innerHTML = planetsData.bodyType
      planetVol.innerHTML = `${planetsData.vol.volValue} x 10<sup>${planetsData.vol.volExponent}</sup> kg`

      planetsData.moons === null ? planetMoons.innerHTML = `0` : planetMoons.innerHTML = planetsData.moons.length
      planetsData.discoveryDate == "" ? planetDiscoveryDate.innerHTML = `Ancient` : planetDiscoveryDate.innerHTML = planetsData.discoveryDate
      planetsData.discoveredBy == "" ? planetDiscoverer.innerHTML = `Known since antiquity` : planetDiscoverer.innerHTML = planetsData.discoveredBy

      planetPerihelion.innerHTML = `${(planetsData.perihelion / 1000000).toFixed(1)}M km`
      planetAphelion.innerHTML = `${(planetsData.aphelion / 1000000).toFixed(1)}M km`
      planetEccentricity.innerHTML = planetsData.eccentricity
      planetInclination.innerHTML = `${planetsData.inclination}&deg;`
      planetAxialTilt.innerHTML = `${planetsData.axialTilt}&deg;`
      planetTemp.innerHTML = `${planetsData.avgTemp}&deg;C`
      planetEscape.innerHTML = `${planetsData.escape.toFixed(1)} km/s`


      box += `<li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Mass: ${planetsData.mass.massValue} x 10<sup>${planetsData.mass.massExponent}</sup> kg</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Surface gravity: ${planetsData.gravity.toFixed(2)} m/s<sup>2</sup></span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Density: ${planetsData.density.toFixed(2)} g/cm<sup>3</sup></span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Axial tilt: ${planetsData.axialTilt}&deg;</span>
                </li>`
    }

    planetFacts.innerHTML = box;
  }
}

function displayTableData() {
  const planetTable = document.querySelector("#planet-comparison-tbody");

  let box = "";

  const planetColor = ['#06b6d4', '#f97316', '#3b82f6', '#ef4444', '#fb923c', '#facc15', '#06b6d4', '#2563eb']

  planetsList.forEach((planet, index) => {

    let typeBadgeClass = "background-color: #6240A3; color: #C084FC";
    if (planet.type === "Gas Giant") typeBadgeClass = "background-color: #6240A3; color: #C084FC";
    if (planet.type === "Ice Giant") typeBadgeClass = "background-color: #2C56A1 ; color : #60A5FA";
    if (planet.type === "Terrestrial") typeBadgeClass = "background-color: #8B4F32; color: #FB923C ";


    const currentColor = planetColor[index];

    box += `
      <tr class="hover:bg-slate-800/30 transition-colors ${planet.englishName === 'Earth' ? 'bg-blue-500/5' : ''}">
        <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
          <div class="flex items-center space-x-2 md:space-x-3">
            <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${currentColor}">
            </div>
            <span class="font-semibold text-sm md:text-base whitespace-nowrap">${planet.englishName}</span>
          </div>
        </td>
        
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${(planet.semimajorAxis / 1.496e+8).toFixed(2)}
        </td>
        
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${(planet.meanRadius * 2).toLocaleString()}
        </td>
        
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${calcMass(planet.mass.massValue, planet.mass.massExponent)}
        </td>
        
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${calcOrbitalPeriod(planet.sideralOrbit)}
        </td>
        
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${planet.moons === null ? 0 : planet.moons.length}
        </td>
        
        <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
          <span style="${typeBadgeClass}" class="px-2 py-1 rounded text-xs">${planet.type}</span>
        </td>
      </tr>
    `;
  });

  planetTable.innerHTML = box;
}

function calcOrbitalPeriod(period) {

  if (period < 365) {
    return `${Math.round(period)} days`;

  } else {
    const years = (period / 365).toFixed(2);

    return `${years} years`;
  }

}

function calcMass(value, exponent) {
  const planetMass = value * Math.pow(10, exponent);
  const earthMass = 5.97237 * Math.pow(10, 24);

  const finalValue = planetMass / earthMass

  return finalValue.toFixed(3)
}