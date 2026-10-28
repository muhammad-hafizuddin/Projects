const addMedicationBtn = document.getElementById("addMedBtn");
const medModal = document.getElementById("medModal");
const closeModalBtn = document.getElementById("closeModal");


 addMedicationBtn.addEventListener("click", () => {
   medModal.classList.remove("hidden");
 });

closeModalBtn.addEventListener("click", () => {
  medModal.classList.add("hidden");
});