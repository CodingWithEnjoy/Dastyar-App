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

  const updateTaskLists = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskLists.forEach((list) => (list.innerHTML = ""));

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.toggle("completed", task.completed);

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
      tasks.push({ title, description, completed: false });
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

const apiUrl = "https://api.dastyar.io/express/financial-item";

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

(async function scrapeDigiato() {
  const response = await fetch("https://digiato.com/daily-timeline");
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const rows = doc.querySelectorAll(".rowCard");
  const articles = Array.from(rows).map((row) => {
    const title = row.querySelector(".rowCard__title")?.textContent.trim();
    const description = row
      .querySelector(".rowCard__description")
      ?.textContent.trim();
    const date = row.querySelector(".rowCard__date")?.textContent.trim();
    const author = row.querySelector(".rowCard__author a")?.textContent.trim();
    const imageElement = row.querySelector(".rowCard__picture img");
    const image =
      imageElement?.getAttribute("src") ||
      imageElement?.getAttribute("data-src");
    const link = row.querySelector(".rowCard__title")?.getAttribute("href");

    return { title, description, date, image, author, link };
  });

  const list = document.getElementById("newspaper-list");
  articles.forEach((article) => {
    const listItem = document.createElement("li");
    listItem.style.listStyleType = "none";

    listItem.innerHTML = `
      <div class="news-card">
        <img src="${article.image}" alt="${article.title}">
        <div class="news-data">
          <h2 class="news-title">${article.title}</h2>
          <p>${article.description}</p>
        </div>
        <div class="news-date"><p>${article.date} - ${article.author}</p></div>
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

      const postResponse = await fetch(article.link);
      const postHtml = await postResponse.text();
      const postDoc = parser.parseFromString(postHtml, "text/html");
      const postContent = postDoc.querySelector(".articlePost")?.innerHTML;

      modalContent.innerHTML = postContent || "<p>محتوای پست لود نمیشه :(</p>";
    });

    list.appendChild(listItem);
  });

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
})();

const API_URL = "https://api2.waqi.info/api/feed/@10652/aqi.json";
const card = document.getElementById("aqi-card");
const aqiValue = document.getElementById("aqi-value");
const dominantPol = document.getElementById("dominant-pol");

fetch(API_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const aqi = data.rxs.obs[0].msg.aqi;
    const pol = data.rxs.obs[0].msg.dominentpol;

    aqiValue.textContent = `${aqi}`;
    dominantPol.textContent = `آلودگی : ${pol}`;

    if (aqi >= 150) {
      aqiValue.style.backgroundColor = "#ff00009e";
    } else if (aqi >= 100) {
      aqiValue.style.backgroundColor = "#ffa5009e";
    } else if (aqi >= 50) {
      aqiValue.style.backgroundColor = "#ffff009e";
    } else {
      aqiValue.style.backgroundColor = "#00c80085";
    }
  })
  .catch((error) => {
    aqiValue.textContent = "";
    dominantPol.textContent = "";
    console.error("Fetch error:", error);
  });

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) =>
      console.error("Service Worker Registration Failed:", error)
    );
}
