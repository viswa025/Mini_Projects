  const display = document.getElementById("display");

    function cal(data) {
      display.value += data;
    }

    function calculate() {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = "Error";
      }
    }

    function clearDisplay() {
      display.value = "";
    }