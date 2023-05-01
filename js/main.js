import KanbanAPI from "./api/KanbanAPI.js";
import Kanban from "./view/Kanban.js";

const kanban = new Kanban(document.querySelector(".kanban"));
// await kanban.renderColumns();

document.addEventListener("scroll", () => {
  const header = document.querySelector(".menu-bar-wrapper");

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
