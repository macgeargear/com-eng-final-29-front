function _countAssignment() {
  let countAssignment = [0, 0, 0];
  let i = 0;
  const elm = Array.from(document.querySelectorAll(".kanban__column-title"));
  for (const e of Array.from(elm)) {
    countAssignment[i] = Math.max(
      0,
      e.nextElementSibling.childElementCount - 1
    );
    i++;
  }
  return countAssignment;
}

function openModal() {
  const click = document.getElementById("summary");
  click.addEventListener("click", () => {
    document.querySelector("#modal-summary").style.display = "flex";
    updateProgress();
  });
}

function closeModal() {
  const close = document.querySelector(".summary-close");
  close.addEventListener("click", () => {
    document.querySelector("#modal-summary").style.display = "none";
  });
}

function updateProgress() {
  const notstarted = document.getElementById("notstarted");
  const inprogress = document.getElementById("inprogress");
  const completed = document.getElementById("completed");
  const pastdue = document.getElementById("pastdue");

  const countAssignment = _countAssignment();
  const total = countAssignment.reduce((acc, a) => acc + a, 0);

  notstarted.innerHTML = `${Math.round((countAssignment[0] / total) * 100)}%`;
  inprogress.innerHTML = `${Math.round((countAssignment[1] / total) * 100)}%`;
  completed.innerHTML = `${Math.round((countAssignment[2] / total) * 100)}%`;
}

function run() {
  openModal();
  closeModal();
}

run();
