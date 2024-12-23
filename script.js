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
      weatherElement.textContent = "Failed to load weather";
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
          <span><strong>${task.title}</strong> (${task.description})</span>
          <div class='btns'>
              <button class="check" onclick="toggleTaskCompletion(${index})">${
        task.completed ? "بازگشت" : "انجام"
      }</button>
              <button class="delete" onclick="deleteTask(${index})">حذف</button>
          </div>
      `;

      taskLists.forEach((list) => list.appendChild(taskItem.cloneNode(true)));
    });
  };

  addTaskBtn.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();

    if (title && description) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push({ title, description, completed: false });
      localStorage.setItem("tasks", JSON.stringify(tasks));

      taskTitleInput.value = "";
      taskDescriptionInput.value = "";
      updateTaskLists();
    } else {
      alert("Please enter both task title and description");
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
  const response = await fetch(
    "https://digiato.com/daily-timeline?category=tech"
  );
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

    return { title, description, date, image, author };
  });

  const list = document.getElementById("newspaper-list");
  articles.forEach((article) => {
    const listItem = document.createElement("li");
    listItem.style.listStyleType = "none";

    listItem.innerHTML = `
      <div class="news-card">
        <img src="${article.image}" alt="${article.title}">
          <div class="news-data">
            <h2>${article.title}</h2>
            <p>${article.description}</p>
          </div>
        <div class="news-date"><p>${article.date} - ${article.author}</p></div>
      </div>
    `;

    list.appendChild(listItem);
  });
})();
