const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const buttons = document.querySelectorAll(".buttons button");
const menuButton = document.getElementById("menuButton");
const dropdown = document.getElementById("dropdown");
const themeToggle = document.getElementById("themeToggle");
let history = [];

buttons.forEach((btn) => {
  btn.addEventListener("click", () => handleInput(btn.textContent));
});

function handleInput(input) {
  if (input === "=") {
    try {
      const expression = display.textContent
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/π/g, "Math.PI")
        .replace(/log\(/g, "Math.log10(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(");
      const result = eval(expression);
      history.push(`${display.textContent} = ${result}`);
      display.textContent = result;
      updateHistory();
    } catch {
      display.textContent = "Error";
    }
  } else if (input === "AC") {
    display.textContent = "";
    history = [];
    updateHistory();
  } else if (input === "C") {
    display.textContent = display.textContent.slice(0, -1);
  } else {
    display.textContent += input;
  }
}

function updateHistory() {
  historyDisplay.innerHTML = history.slice(-3).reverse().join("<br>");
}

menuButton.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = themeToggle.textContent === "🌗" ? "🌞" : "🌗";
});

const converterData = {
  Length: { Meters: 1, Kilometers: 0.001, Miles: 0.000621371, Feet: 3.28084 },
  Temperature: {
    CelsiusToFahrenheit: (c) => (c * 9) / 5 + 32,
    FahrenheitToCelsius: (f) => ((f - 32) * 5) / 9,
    CelsiusToKelvin: (c) => c + 273.15,
    KelvinToCelsius: (k) => k - 273.15,
  },
  Area: { "Sq Meters": 1, "Sq Kilometers": 0.000001, "Sq Miles": 3.861e-7 },
  Volume: { Liters: 1, Milliliters: 1000, "Cubic Meters": 0.001 },
  Weight: { Grams: 1, Kilograms: 0.001, Pounds: 0.00220462 },
  Speed: { "Meters/sec": 1, "Km/hr": 3.6, "Miles/hr": 2.23694 },
  Pressure: { Pascal: 1, Bar: 0.00001, Atmosphere: 0.00000986923 },
  Currency: { USD: 1, EUR: 0.85, INR: 74 },
};

function showConverterUI(type) {
  const section = document.createElement("div");
  section.className = "converter";

  const title = document.createElement("h3");
  title.innerText = `${type} Converter`;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter value";

  const fromSelect = document.createElement("select");
  const toSelect = document.createElement("select");

  const resultDiv = document.createElement("div");
  resultDiv.style.marginTop = "10px";
  resultDiv.style.fontWeight = "bold";

  const backButton = document.createElement("button");
  backButton.textContent = "← Back to Calculator";
  backButton.style.marginTop = "15px";
  backButton.addEventListener("click", () => {
    section.remove();
  });

  if (type === "Temperature") {
    fromSelect.innerHTML = `<option value="Celsius">Celsius</option><option value="Fahrenheit">Fahrenheit</option><option value="Kelvin">Kelvin</option>`;
    toSelect.innerHTML = fromSelect.innerHTML;
  } else if (type === "Number System") {
    fromSelect.innerHTML = `<option value="Decimal">Decimal</option><option value="Binary">Binary</option><option value="Hexadecimal">Hexadecimal</option><option value="Octal">Octal</option>`;
    toSelect.innerHTML = fromSelect.innerHTML;
  } else {
    const units = Object.keys(converterData[type]);
    units.forEach((unit) => {
      fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
      toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
  }

  function updateConversion() {
    const value = input.value.trim();
    const from = fromSelect.value;
    const to = toSelect.value;
    let result = "Unsupported conversion";

    if (["Length", "Area", "Volume", "Weight", "Speed", "Pressure", "Currency"].includes(type)) {
      const base = parseFloat(value) / converterData[type][from];
      result = base * converterData[type][to];
    } else if (type === "Temperature") {
      const num = parseFloat(value);
      if (from === to) result = num;
      else if (from === "Celsius" && to === "Fahrenheit") result = converterData.Temperature.CelsiusToFahrenheit(num);
      else if (from === "Fahrenheit" && to === "Celsius") result = converterData.Temperature.FahrenheitToCelsius(num);
      else if (from === "Celsius" && to === "Kelvin") result = converterData.Temperature.CelsiusToKelvin(num);
      else if (from === "Kelvin" && to === "Celsius") result = converterData.Temperature.KelvinToCelsius(num);
    } else if (type === "Number System") {
      let decimal;
      try {
        if (from === "Binary") decimal = parseInt(value, 2);
        else if (from === "Hexadecimal") decimal = parseInt(value, 16);
        else if (from === "Octal") decimal = parseInt(value, 8);
        else decimal = parseInt(value, 10);

        if (isNaN(decimal)) throw new Error();

        if (to === "Binary") result = decimal.toString(2);
        else if (to === "Hexadecimal") result = decimal.toString(16).toUpperCase();
        else if (to === "Octal") result = decimal.toString(8);
        else result = decimal.toString(10);
      } catch {
        result = "Invalid input";
      }
    }

    resultDiv.innerText = `Result: ${result}`;
  }

  input.addEventListener("input", updateConversion);
  fromSelect.addEventListener("change", updateConversion);
  toSelect.addEventListener("change", updateConversion);

  section.appendChild(title);
  section.appendChild(input);
  section.appendChild(fromSelect);
  section.appendChild(toSelect);
  section.appendChild(resultDiv);
  section.appendChild(backButton);

  const container = document.querySelector(".calculator-container");
  const oldConverter = document.querySelector(".converter");
  if (oldConverter) oldConverter.remove();
  container.appendChild(section);
}

const dropdownItems = document.querySelectorAll(".dropdown-item");
dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    const type = item.textContent.trim();
    if (converterData[type] || type === "Temperature" || type === "Number System") {
      showConverterUI(type);
      dropdown.classList.add("hidden");
    }
  });
});

// ✅ Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/\d/.test(key)) handleInput(key);
  else if ("+-*/().".includes(key)) handleInput(key);
  else if (key === "Enter") handleInput("=");
  else if (key === "Backspace") handleInput("C");
  else if (key === "Escape") handleInput("AC");
  else if (key.toLowerCase() === "p") handleInput("π");
  else if (key === "%") handleInput("%");
});
