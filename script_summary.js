(() => {
  function openModal() {
    const click = document.getElementById("summary");
    const test = document.getElementById("summary-status-items");
    console.log(click);
    console.log(test);
    click.addEventListener("click", () => {
      document.querySelector(".summary-container").style.display = "block";
      console.log("click");
    });
  }

  function closeModal() {
    const close = document.querySelector(".summary-close");
    close.addEventListener("click", () => {
      document.querySelector(".summary-container").style.display = "none";
    });
  }

  function run() {
    openModal();
    closeModal();
  }

  run();
})();
