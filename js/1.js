const $input = document.getElementsByTagName("input")[0];
const $allButtons = document.getElementsByTagName("button");
const $whiteButtons = document.querySelectorAll("button:not(.primary)");
const $primaryButtons = document.getElementsByClassName("primary");
const $ACbutton = $whiteButtons[1];
const $removeButton = $whiteButtons[0];
const $bracketsButton = $whiteButtons[13];
const $result = document.getElementById("result");
const $body = document.body;
const $numberButtons = Array.from($whiteButtons).filter(
    (button) =>
        Number.parseInt(button.innerText) ||
        button.innerText == "0" ||
        button.innerText == "."
);
const $activeButtons = [...$numberButtons, ...$primaryButtons];

//****for styling****/
const $inputError = document.querySelector(".clear_input_container");
const $buttons = document.querySelectorAll("button");
$buttons.forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.add("brPressed");
        setTimeout(() => {
            button.classList.remove("brPressed");
        }, 250);
    });
});

let result;
//1. перебираем все кнопки
Array.from($allButtons).forEach((button) => {
    //2. отслеживаем событие при нажатии на кнопку
    button.addEventListener("click", (e) => {
        console.log(button.innerText === "0");
        //3. остановка всплытия
        e.stopPropagation();
        //!4. убираем 0 (?)
        if ($input.value == "0") {
            $input.value = "";
        }
        //5. вывод выражения в input
        if ($activeButtons.includes(button)) {
            if (button.innerText === "." && $input.value == "") {
                $input.value = "0.";
            } else {
                $input.value += button.innerText;
            }
        }
        //6. логика кнопок
        if (button == $removeButton) {
            $input.value = $input.value.slice(0, -1);
        }
        if (button == $ACbutton) {
            $input.value = "0";
        }
        if (button == $bracketsButton) {
            $input.value = "(" + $input.value + ")";
        }
        if (button.innerText === "." && $input.value == "0") {
            $input.value = "0.";
        }
        if (button.innerText === "0" && $input.value == "0") {
            $input.value = "0";
        }
        //9. вывод ответа
        // visibleZero(button);
        calculate();
    });
});

function calculate() {
    //7. знак деления
    result = $input.value.replaceAll("•", "*");
    if (!["+", "-", "*", "÷", "/", "(", "."].includes(result.slice(-1))) {
        try {
            result = math.evaluate(result);
            if (String(result).length > 15) {
                result = String(result).slice(0, 15);
            }
            $result.innerText = "=" + result;
        } catch (e) {
            /* error animation*/
            $result.innerText = "error";
        }
        if ($result.innerText === "error") {
            $inputError.classList.add("error");
        } else {
            $inputError.classList.remove("error");
        }
        //8. добавляем opacity при окончании строки не на число
        $result.style.opacity = "1";
    } else {
        $result.style.opacity = "0.5";
    }
    if (!result) {
        $result.innerText = "";
    }
}

// ***** 0 при нажатии на точку
function visibleZero(button) {
    if (button.innerText === "." && $input.value == "0") {
        $input.value = "0.";
    }
}
//10. убираем 0 при фокусе input
$input.addEventListener("focus", () => {
    if ($input.value == "0") $input.value = "";
});
//11. отслеживаем событие input
$input.addEventListener("input", (e) => {
    console.log(result);
    calculate();
});

window.addEventListener("keydown", () => {
    $input.focus();
});
