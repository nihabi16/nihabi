/*document.addEventListener("DOMContentLoaded", function() {
  const enterBtn = document.getElementById("enterBtn");
  const input = document.getElementById("magicWord");
  const message = document.getElementById("message");

  function startConfetti(duration = 800) {
    // placeholder for actual confetti
    console.log("Confetti for " + duration + "ms");
  }

  function doEnter() {
    const word = input.value.trim().toLowerCase();

    if (word === "nihabi") { // only accept this
      message.textContent = "Yes 💖";
      message.style.color = "lightgreen";
      startConfetti(800);
      document.body.classList.add("fade-away");

      setTimeout(() => {
        window.location.href = "home.html";
      }, 850);
    } else {
      message.textContent = "Try again 💔";
      message.style.color = "pink";
      input.value = "";
      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 300);
    }
  }

  // click button
  enterBtn.addEventListener("click", doEnter);

  // enter key
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      doEnter();
    }
  });
});*/
document.addEventListener("DOMContentLoaded", function() {
  const enterBtn = document.getElementById("enterBtn");
  const input = document.getElementById("magicWord");
  const message = document.getElementById("message");

  function startConfetti(duration = 800) {
    // placeholder: integrate confetti library if you want
    console.log("Confetti for " + duration + "ms");
  }

  function doEnter() {
    const word = input.value.trim().toLowerCase();

    // only proceed if correct
    if (word === "nihabi") {
      message.textContent = "You got it 😉💖";
      message.style.color = "lightgreen";
      startConfetti(800);
      document.body.classList.add("fade-away");

      setTimeout(() => {
        window.location.href = "home.html"; // go to home
      }, 850);
    } else {
      // wrong answer: stay here
      message.textContent = "Nahhh! Beb 💔";
      message.style.color = "pink";
      input.value = ""; // clear input
      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 300);
    }
  }

  // button click
  enterBtn.addEventListener("click", doEnter);

  // press Enter key
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      doEnter();
    }
  });
});
