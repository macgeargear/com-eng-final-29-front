import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";
export default class Item {
  constructor(id, content, instruction, dueTime) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Item.createRoot();
    this.elements.input = this.elements.root.querySelector(
      ".kanban__item-input"
    );

    // Construct Modal
    // get importance element
    this.elements.timeLeft = this.elements.root.querySelector(`.time-left`);
    this.elements.closeModal = this.elements.root.querySelector(`.close`);
    this.elements.modal = this.elements.root.querySelector(`.modal`);
    this.elements.modalContent =
      this.elements.root.querySelector(`.modal-content`);
    this.elements.modalTitle = this.elements.root.querySelector(`.modal-title`);
    this.elements.modalInstruction =
      this.elements.root.querySelector(".modal-instruction");
    this.elements.modalDayLeft =
      this.elements.root.querySelector(`.modal-day-left`);
    this.elements.modalTime = this.elements.root.querySelector(`.time`);
    this.elements.modalDueDate =
      this.elements.root.querySelector(`.modal-duedate`);

    // init this item
    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.content = content;
    this.elements.root.appendChild(bottomDropZone);

    // init modal
    this.elements.input.setAttribute("id", `open-modal-${this.id}`);
    this.elements.modal.setAttribute("id", `modal-${this.id}`);
    this.elements.modalContent.setAttribute("id", `modal-content-${this.id}`);
    this.elements.closeModal.setAttribute("id", `close-modal-${this.id}`);
    this.elements.closeModal.textContent = `close`;
    this.elements.modalTitle.textContent = content;
    this.elements.modalInstruction.innerHTML = instruction;
    this.elements.modal.style.display = "none";

    // set time
    this.elements.modalDueDate.innerHTML += this.getTime(dueTime);
    const hourLeft = this.getHourLeft(dueTime);
    const dayLeft = Math.floor(hourLeft / 24);
    // console.log(content, dayLeft);
    if (dayLeft > 0) {
      this.elements.modalDayLeft.innerHTML += dayLeft + " Day Left";
      this.elements.timeLeft.innerHTML += dayLeft + " Day Left";
    } else if (dayLeft == 0) {
      // const hourLeft = this.getHourLeft(dueTime);
      this.elements.input.style.background = "#f0f4c3";
      if (hourLeft >= 1) {
        this.elements.modalDayLeft.innerHTML += hourLeft + " Hour Left";
        this.elements.timeLeft.innerHTML += hourLeft + " Hour Left";
      } else {
        const minuteLeft = this.getminuteLefr(dueTime);
        this.elements.modalDayLeft.innerHTML += minuteLeft + " Minute Left";
        this.elements.timeLeft.innerHTML += minuteLeft + " Minute Left";
      }
    } else {
      this.elements.modalDayLeft.innerHTML = "This assignment is ended";
      this.elements.timeLeft.innerHTML += "This assignment is ended";

      this.elements.input.style.background = "#111111";
    }

    this.elements.input.innerHTML +=
      "<br><br>" +
      `<p class="item-day-left">${this.elements.timeLeft.innerHTML}</p>`;

    // modal
    // open
    this.elements.input.addEventListener("click", () => {
      this.elements.modal.style.display = "block";
    });

    // close
    this.elements.closeModal.addEventListener("click", () => {
      this.elements.modal.style.display = "none";
    });
    // close when click outside
    window.addEventListener("click", (event) => {
      if (event.target == this.elements.modal) {
        this.elements.modal.style.display = "none";
      }
    });

    this.elements.root.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    this.elements.input.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }

  getHourLeft(dueTime) {
    const unixTimestampMs = Number(dueTime) * 1000;

    // Get the date and time from the Unix timestamp
    const date = new Date(unixTimestampMs);

    // Get the difference in milliseconds between the target date and now
    const differenceMs = date.getTime() - Date.now();

    // Convert the difference to hours and round down
    const hoursLeft = Math.floor(differenceMs / (1000 * 60 * 60));

    // Output the number of hours left
    return hoursLeft;
  }

  getminuteLefr(dueTime) {
    const unixTimestampMs = Number(dueTime) * 1000;

    // Get the date and time from the Unix timestamp
    const date = new Date(unixTimestampMs);

    // Get the difference in milliseconds between the target date and now
    const differenceMs = date.getTime() - Date.now();

    // Convert the difference to minutes and round down
    const minutesLeft = Math.floor(differenceMs / (1000 * 60));

    // Output the number of minutes left
    return minutesLeft;
  }

  getTime(dueTime) {
    const date = new Date(Number(dueTime) * 1000);

    // Get the individual components of the date and time
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns a zero-based index
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Create a formatted date string in the desired format
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    // Output the formatted date and time string
    return formattedDateTime;
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
        <div class="kanban__item" draggable="true">
       
          <div class="modal">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close"></button>
                <h1 class="modal-title"></h1>
              </div>
              <div class="instruction-container">
                <div class="modal-day-left" id="countdown">
                  <div class="countdown"><span id="days" class="time"></span></div>
                </div> 
                <p class="modal-label">instruction</p>
                <p class="modal-instruction"></p>
                <button class="modal-duedate">due: </button>
              </div>
            </div>
          </div>
          <div class="kanban__item-input"><div class="time-left"></div></div>
        </div>
    `).children[0];
  }
}
