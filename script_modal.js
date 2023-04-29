// Get the modal element
var modal = document.getElementById("myModal");

// Get the close button element for the modal
var closeBtn = modal.querySelector(".close");

// When the user clicks on the button, open the modal
function openModal(modalId) {
  let thisModal = document.getElementById(modalId);
  console.log(thisModal);
  thisModal.style.display = "block";
}

// When the user clicks on the close button or outside the modal, close the modal
function closeModal(modalId) {
  let thisModal = document.getElementById(modalId);
  console.log(thisModal);
  thisModal.style.display = "none";
}
// closeBtn.onclick = function() {
//   modal.style.display = "none";
// }

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
