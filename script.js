const addMedicationBtn = document.getElementById("addMedBtn");
const medModal = document.getElementById("medModal");
const closeModalBtn = document.getElementById("closeModal");

// when modal opens — prevent background from scrolling
 addMedicationBtn.addEventListener("click", () => {
   medModal.classList.remove("hidden");
   document.body.style.overflow = 'hidden'; 
 });

 // when modal closes — restore scrolling
closeModalBtn.addEventListener("click", () => {
  medModal.classList.add("hidden");
});

// also close when clicking the dark overlay behind the modal
medModal.addEventListener('click', (e) => {
  if (e.target === medModal) {        // clicked the overlay not the content
    medModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
});