async function call(location) {
  let key = "49300941498d11c0fc09606011c78780";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;

  let response;

  try {
    console.log("loading...");
    response = await fetch(url);
    console.log("loading finished!");
    response = await manageErrors(response);
    return response.json();
  } catch (error) {
    console.log(error);
  }

  function manageErrors(res) {
    if (!res.ok) {
      throw Error(response.status);
    }
    return res;
  }
}

function dealWithJson(json) {
  const main = json.main;
  const weather = json.weather[0];
  const name = json.name;

  return { main, weather, name };
}

function updateDisplay(obj) {
  if (!obj) displayWarning();

  const display = document.querySelector(".display");

  const icon = display.querySelector(".display--weather-icon");
  const city = display.querySelector(".display--city");
  const temperature = document.querySelector(".display--temperature");

  icon.src = `http://openweathermap.org/img/wn/${obj.weather.icon}@2x.png`;
  city.textContent = obj.name;
  temperature.textContent = `${Math.round(obj.main.temp - 273.15)}℃`;
}

function displayWarning() {
  const warning = document.querySelector(".warning");
  warning.textContent = `Can't find any city with this name, maybe you have a typo?`;
  warning.style.display = "block";
  warning.style.opacity = "100%";

  setTimeout(() => {
    warning.style.opacity = "0%";
  }, 4000);
}

const input = document.querySelector("#city-search");
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    call(input.value)
      .then((r) => updateDisplay(dealWithJson(r)))
      .catch((r) => displayWarning());
  }
});
