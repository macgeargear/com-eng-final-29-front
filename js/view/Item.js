import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";
import { countDown } from "../countdown.js";
export default class Item {
  constructor(id, content, instruction, dueDate, dueTime) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Item.createRoot();
    this.elements.input = this.elements.root.querySelector(
      ".kanban__item-input"
    );

    // Construct Modal
    this.elements.closeModal = this.elements.root.querySelector(`.close`);
    this.elements.modal = this.elements.root.querySelector(`.modal`);
    this.elements.modalContent =
      this.elements.root.querySelector(`.modal-content`);
    this.elements.modalTitle = this.elements.root.querySelector(`.modal-title`);
    this.elements.modalInstruction =
      this.elements.root.querySelector(".modal-instruction");

    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.content = content;
    this.elements.root.appendChild(bottomDropZone);

    this.elements.input.setAttribute("id", `open-modal-${this.id}`);
    this.elements.modal.setAttribute("id", `modal-${this.id}`);
    this.elements.modalContent.setAttribute("id", `modal-content-${this.id}`);
    this.elements.closeModal.setAttribute("id", `close-modal-${this.id}`);
    this.elements.closeModal.textContent = `close`;
    this.elements.modalTitle.textContent = content;
    this.elements.modalInstruction.innerHTML = instruction;

    console.log(countDown(dueDate));

    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim();

      if (newContent == this.content) return;

      this.content = newContent;
      KanbanAPI.updateItem(id, {
        content: this.content,
      });
    };

    this.elements.input.addEventListener("blur", onBlur);
    this.elements.root.addEventListener("dblclick", () => {
      const check = confirm("Are you sure you want to delete this item?");
      if (check) {
        KanbanAPI.deleteItem(id);
        this.elements.input.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    // modal
    // open
    this.elements.input.addEventListener("click", async () => {
      // countDown(dueDate);
      this.elements.modal.style.display = "block";
    });

    // close
    this.elements.closeModal.addEventListener("click", () => {
      this.elements.modal.style.display = "none";
    });

    this.elements.root.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    this.elements.input.addEventListener("drop", (e) => {
      e.preventDefault();
    });
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
                  <div class="countdown"><span id="days"></span></div> Day left
                </div> 
                <p class="modal-label">instruction</p>
                <p class="modal-instruction"></p>
                <button class="modal-duedate">due: 2022-03-04</button>
              </div>
            </div>
          </div>
          <div class="kanban__item-input"></div>
        </div>
    `).children[0];
  }
}
