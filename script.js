document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

let touchStartY = 0;

document.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.touches[0].clientY;
  },
  { passive: true }
);

document.addEventListener(
  "touchmove",
  (event) => {
    let touchY = event.touches[0].clientY;

    if (window.scrollY === 0 && touchY > touchStartY) {
      event.preventDefault();
    }
  },
  { passive: false }
);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bottom-bar button").forEach((button) => {
    button.addEventListener("click", () => {
      const pageToShow = button.dataset.page;

      document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
      });

      document.querySelector(`.${pageToShow}`).classList.add("active");

      document.querySelectorAll(".bottom-bar button").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".page6 button").forEach((button) => {
    button.addEventListener("click", () => {
      const pageToShow = button.dataset.page;

      document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
      });

      document.querySelector(`.${pageToShow}`).classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const updateTime = () => {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const jalaliDate = new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now);

    const persianDate = new Intl.DateTimeFormat("en-UK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);

    document.getElementById("time").textContent = time;
    document.getElementById("date").textContent = jalaliDate;
    document.getElementById("date2").textContent = persianDate;
  };
  setInterval(updateTime, 1000);
  updateTime();

  const apiKey = "3045dd712ffe6e702e3245525ac7fa38";
  const weatherElement = document.getElementById("weather");
  const descElement = document.getElementById("date-description");
  const location = document.getElementById("location");
  const weatherImageElement = document.getElementById("weather-image");

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fa`
      );
      const data = await response.json();

      const iconCode = data.weather[0].icon;

      weatherElement.textContent = `${Math.floor(data.main.temp)}°C`;
      descElement.textContent = `${data.weather[0].description} (${data.main.humidity}%)`;
      location.textContent = `${data.name}، ایران`;

      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      weatherImageElement.src = iconUrl;
    } catch (error) {
      weatherElement.textContent = "ارور";
      console.error(error);
    }
  };

  const defaultLatitude = 35.6892;
  const defaultLongitude = 51.389;

  fetchWeather(defaultLatitude, defaultLongitude);
});

document.addEventListener("DOMContentLoaded", () => {
  const taskTitleInput = document.getElementById("task-title");
  const taskDescriptionInput = document.getElementById("task-description");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskLists = document.querySelectorAll(".task-list");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let selectedCategory = "daily";
  let activeFilter = "all";

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      selectedCategory = button.dataset.category;
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.category;
      updateTaskLists();
    });
  });

  const updateTaskLists = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskLists.forEach((list) => (list.innerHTML = ""));

    tasks
      .filter(
        (task) => activeFilter === "all" || task.category === activeFilter
      )
      .forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.toggle("completed", task.completed);
        taskItem.setAttribute("data-category", task.category); // Assign category for styling

        taskItem.innerHTML = `
          <span>
            <strong>${task.title}</strong> 
            ${task.description ? `<p>${task.description}</p>` : ""}
          </span>
          <div class='btns'>
              <button class="check" onclick="toggleTaskCompletion(${index})">${
          task.completed
            ? "<img src='icon/x.svg' />"
            : "<img src='icon/done.svg' />"
        }</button>
              <button class="delete" onclick="deleteTask(${index})"><img src="icon/trash.svg" /></button>
          </div>
        `;

        taskLists.forEach((list) => list.appendChild(taskItem.cloneNode(true)));
      });
  };

  addTaskBtn.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();

    if (title) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push({
        title,
        description,
        category: selectedCategory,
        completed: false,
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));

      taskTitleInput.value = "";
      taskDescriptionInput.value = "";
      updateTaskLists();
    } else {
      alert("فیلد عنوان رو پر کن");
    }
  });

  window.toggleTaskCompletion = (index) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskLists();
  };

  window.deleteTask = (index) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskLists();
  };

  updateTaskLists();
});

const apiUrl =
  "https://corsproxy.io/?url=https://api.dastyar.io/express/financial-item";

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const tileContainer = document.getElementById("tileContainer");

    const formattedValue = (price) => {
      const number = Number(price);

      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
      } else {
        return number.toLocaleString();
      }
    };

    data.forEach((item) => {
      const tile = document.createElement("div");
      tile.className = "tile";

      const changeColor =
        item.change > 0 ? "green" : item.change < 0 ? "red" : "#fff";

      const formattedPrice = formattedValue(item.price);
      const formattedChange = Number(item.change).toFixed(2);

      tile.innerHTML = `
          <div class="tile-info">
            <div class="tile-text">
              <h3>${item.title}</h3>
              <p>${item.key}</p>
            </div>
            <img src="https://liara-s3.dastyar.io/Img/icons/finance/${item.image}" alt="${item.title}">
          </div>
          <div class="value">
            ${formattedPrice}
            <div class="change" style="color: ${changeColor};">(${formattedChange}%)</div>
          </div>
        `;

      tileContainer.appendChild(tile);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

(async function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      contents.forEach((content) => content.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
})();

async function fetchArticles(url, containerId, type = "default") {
  const response = await fetch(url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  let articles = [];

  if (type === "default") {
    const rows = doc.querySelectorAll(".rowCard");
    articles = Array.from(rows).map((row) => {
      const title = row.querySelector(".rowCard__title")?.textContent.trim();
      const description = row
        .querySelector(".rowCard__description")
        ?.textContent.trim();
      const date = row.querySelector(".rowCard__date")?.textContent.trim();
      const author = row
        .querySelector(".rowCard__author a")
        ?.textContent.trim();
      const imageElement = row.querySelector(".rowCard__picture img");
      const image =
        imageElement?.getAttribute("src") ||
        imageElement?.getAttribute("data-src");
      const link = row.querySelector(".rowCard__title")?.getAttribute("href");

      return { title, description, date, image, author, link };
    });
  } else if (type === "isna") {
    const newsItems = doc.querySelectorAll(".news");
    articles = Array.from(newsItems).map((item) => {
      const title = item.querySelector(".desc h3 a")?.textContent.trim();
      const description = item.querySelector(".desc p")?.textContent.trim();
      const link = item.querySelector(".desc h3 a")?.getAttribute("href");
      const date = item.querySelector(".desc time a")?.textContent.trim();
      const imageElement = item.querySelector("img");
      const image =
        imageElement?.getAttribute("src") ||
        imageElement?.getAttribute("data-src");

      return { title, description, date, image, link, type };
    });
  }

  const list = document.querySelector(`#${containerId} .news-list`);
  list.innerHTML = "";

  articles.forEach((article) => {
    const listItem = document.createElement("li");
    listItem.style.listStyleType = "none";

    listItem.innerHTML = `
      <div class="news-card">
        <img src="${article.image}" alt="${article.title}">
        <div class="news-data">
          <h2 class="news-title">${article.title}</h2>
          <p>${article.description || "No description available"}</p>
        </div>
        <div class="news-date">
          <p>
            ${article.date || "Unknown date"} 
            ${article.author ? `- ${article.author}` : ""}
          </p>
        </div>
      </div>
    `;

    const titleElement = listItem.querySelector(".news-title");
    titleElement.addEventListener("click", async (event) => {
      event.stopPropagation();
      const modal = document.getElementById("news-modal");
      const modalImage = document.getElementById("modal-img");
      const modalTitle = document.getElementById("modal-title");
      const modalContent = document.getElementById("modal-content");

      modalImage.innerHTML = `<img src="${article.image}" /><div class="img-layer"></div>`;
      modalTitle.innerHTML = `<h2>${article.title}</h2>`;
      modalContent.innerHTML = "<p>بارگذاری ...</p>";

      modal.classList.remove("hide");
      modal.classList.add("show");
      document.body.style.overflow = "hidden";

      console.log(article.link);

      let articleLink = article.link;

      if (article.type === "isna") {
        articleLink = `https://mehrnews.ir/${article.link}`;
      }

      const postResponse = await fetch(
        `https://corsproxy.io/?url=${articleLink}`
      );

      const postHtml = await postResponse.text();
      const postDoc = parser.parseFromString(postHtml, "text/html");
      const postContent =
        postDoc.querySelector(".articlePost")?.innerHTML ||
        postDoc.querySelector(".item-text")?.innerHTML;

      modalContent.innerHTML = postContent || "<p>محتوای پست لود نمیشه :(</p>";
    });

    list.appendChild(listItem);
  });
}

function initializeFetch() {
  fetchArticles("https://digiato.com/daily-timeline", "digiato-list");
  fetchArticles(
    "https://corsproxy.io/?url=https://vigiato.net/daily-timeline",
    "vigiato-list"
  );
  fetchArticles(
    "https://corsproxy.io/?url=https://www.mehrnews.com/archive",
    "isna-list",
    "isna"
  );
}

initializeFetch();

const modal = document.getElementById("news-modal");
const closeModalBtn = modal.querySelector(".close-btn");

const closeModal = () => {
  modal.classList.remove("show");
  modal.classList.add("hide");

  setTimeout(() => {
    document.body.style.overflow = "visible";
  }, 500);
};

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

const PROXY_URL = "https://corsproxy.io/?url=";
const CITY_URL = "https://aqicn.org/city/tehran/";
const FULL_URL = `${PROXY_URL}${encodeURIComponent(CITY_URL)}`;

const card = document.getElementById("aqi-card");
const aqiValue = document.getElementById("aqi-value");

fetch(FULL_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const aqi = doc.querySelector(".aqivalue").textContent.trim();

    aqiValue.textContent = `${aqi}`;

    const aqiNum = parseInt(aqi, 10);
    if (aqiNum >= 150) {
      aqiValue.style.backgroundColor = "#ff00009e";
    } else if (aqiNum >= 100) {
      aqiValue.style.backgroundColor = "#ffa5009e";
    } else if (aqiNum >= 50) {
      aqiValue.style.backgroundColor = "#ffff009e";
    } else {
      aqiValue.style.backgroundColor = "#00c80085";
    }
  })
  .catch((error) => {
    aqiValue.textContent = "Error";
    console.error("Fetch error:", error);
  });

let display = document.getElementById("display");
let currentInput = "";

function appendToDisplay(value) {
  currentInput += value;
  display.innerText = currentInput;
}

function calculate() {
  try {
    let expression = currentInput
      .replace(/sin\(/g, "Math.sin((Math.PI / 180)*")
      .replace(/cos\(/g, "Math.cos((Math.PI / 180)*")
      .replace(/tan\(/g, "Math.tan((Math.PI / 180)*")
      .replace(/cotg\(/g, "1/Math.tan((Math.PI / 180)*")
      .replace(/%/g, "/100");

    let result = eval(expression);

    result = Math.round(result * 1000000000) / 1000000000;

    animateDisplay();
    setTimeout(() => {
      display.innerText = result;
      currentInput = result.toString();
    }, 100);
  } catch (error) {
    display.innerText = "چرت و پرت نزن :/";
    currentInput = "";
  }
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  display.innerText = currentInput;
}

function animateDisplay() {
  display.style.transition = "transform 0.1s ease";
  display.style.transform = "translateY(-20px)";
  setTimeout(() => {
    display.style.transform = "translateY(0)";
  }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=35.6892&lon=51.389&appid=3045dd712ffe6e702e3245525ac7fa38&units=metric&lang=fa"
  )
    .then((response) => response.json())
    .then((data) => {
      const weatherDescription = data.weather[0].description;
      const temp = data.main.temp;
      const feelsLike = data.main.feels_like;
      const tempMin = data.main.temp_min;
      const tempMax = data.main.temp_max;
      const humidity = data.main.humidity;
      const visibility = data.visibility;
      const windSpeed = data.wind.speed;
      const clouds = data.clouds.all;
      const rain = data.rain ? data.rain["1h"] : 0;
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
        "fa-IR"
      );
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString(
        "fa-IR"
      );

      document.getElementById("weather-description").textContent =
        translateWeatherDescription(weatherDescription);
      document.getElementById("temperature").textContent = `${temp}°C`;
      document.getElementById("feels-like").textContent = `${feelsLike}°C`;
      document.getElementById("temp-min").textContent = `${tempMin}°C`;
      document.getElementById("temp-max").textContent = `${tempMax}°C`;
      document.getElementById("humidity").textContent = `${humidity}%`;
      document.getElementById("visibility").textContent = `${visibility} متر`;
      document.getElementById(
        "wind-speed"
      ).textContent = `${windSpeed} متر بر ثانیه`;
      document.getElementById("clouds").textContent = `${clouds}%`;
      document.getElementById("rain").textContent = `${rain} میلی‌متر`;
      document.getElementById("sunrise").textContent = sunrise;
      document.getElementById("sunset").textContent = sunset;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
});

function translateWeatherDescription(description) {
  const translations = {
    "clear sky": "آسمان صاف",
    "few clouds": "چند ابر",
    "scattered clouds": "ابرهای پراکنده",
    "broken clouds": "ابرهای نیمه‌پراکنده",
    "shower rain": "بارش باران",
    rain: "باران",
    thunderstorm: "طوفان رعد و برق",
    snow: "برف",
    mist: "مه",
    drizzle: "بارش خفیف",
  };

  return translations[description] || description;
}

let currencyData = [];

async function fetchCurrencies() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    currencyData = [
      { key: "تومان", title: "تومان", price: 1 },
      ...data.filter((item) => item.category === "currency"),
    ];

    populateDropdowns();
  } catch (error) {
    console.error("Error fetching currency data:", error);
  }
}

function populateDropdowns() {
  const fromDropdown = document.querySelector("#fromDropdown .dropdown-list");
  const toDropdown = document.querySelector("#toDropdown .dropdown-list");

  currencyData.forEach((currency) => {
    const option1 = document.createElement("li");
    option1.textContent = currency.title;
    option1.setAttribute("data-key", currency.key);
    option1.onclick = () =>
      selectCurrency("fromDropdown", currency.title, currency.key);

    const option2 = option1.cloneNode(true);
    option2.onclick = () =>
      selectCurrency("toDropdown", currency.title, currency.key);

    fromDropdown.appendChild(option1);
    toDropdown.appendChild(option2);
  });
}

function toggleDropdown(dropdownId) {
  document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
    if (dropdown.id !== dropdownId) {
      dropdown.classList.remove("open");
    }
  });

  document.getElementById(dropdownId).classList.toggle("open");
}

function selectCurrency(dropdownId, title, key) {
  document.querySelector(`#${dropdownId} .selected`).textContent = title;
  document.getElementById(dropdownId).setAttribute("data-selected", key);
  document.getElementById(dropdownId).classList.remove("open");
}

function convertCurrency() {
  const amount = parseFloat(
    document.getElementById("amount").value.replace(/,/g, "")
  );
  const fromCurrency = document
    .getElementById("fromDropdown")
    .getAttribute("data-selected");
  const toCurrency = document
    .getElementById("toDropdown")
    .getAttribute("data-selected");
  const resultElement = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    resultElement.textContent = "مقدار نامعتبر";
    return;
  }

  const fromRate = currencyData.find((c) => c.key === fromCurrency)?.price;
  const toRate = currencyData.find((c) => c.key === toCurrency)?.price;

  if (!fromRate || !toRate) {
    resultElement.textContent = "ارز نامعتبر";
    return;
  }

  const convertedAmount = (amount * fromRate) / toRate;
  resultElement.textContent = `نتیجه : ${convertedAmount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${toCurrency}`;
}

function formatInput(input) {
  let value = input.value.replace(/,/g, "");
  if (!isNaN(value) && value.length > 0) {
    input.value = parseFloat(value).toLocaleString("en-US");
  }
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-dropdown")) {
    document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("open");
    });
  }
});

fetchCurrencies();
