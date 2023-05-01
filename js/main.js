import Kanban from "./view/Kanban.js";
import { getUserProfile } from "./api/KanbanAPI.js"

const kanban = new Kanban(document.querySelector(".kanban"));

document.addEventListener("scroll", () => {
  const header = document.querySelector(".menu-bar-wrapper");

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// display username
const usernameBlock = document.querySelector('#username');
const data = (await getUserProfile());
usernameBlock.innerHTML += data.user.firstname_en + " " + data.user.lastname_en;

