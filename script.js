const addMedicationBtn = document.getElementById("addMedBtn");
const medModal = document.getElementById("medModal");
const closeModalBtn = document.getElementById("closeModal");

// FORM SECTION
const form = document.getElementById("med-form");
const medName = document.getElementById("med-name");
const timeInput = document.getElementById("time-input");
const addTimeBtn = document.getElementById("add-time-btn");
const medNotes = document.getElementById("med-notes");
const medQuantity = document.getElementById("med-quantity");
const medGout = document.getElementById("med-gout-only");
const cancelModalBtn = document.getElementById("cancel-modal");
const autocompleteList = document.getElementById("auto-complete-list");

// STEP 1: Fetching data from the RxNorm API for medication suggestions
async function fetchMedicationSuggestions(query) {
  const url = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// This sends a request to the server
fetchMedicationSuggestions("aspirin");

form.addEventListener("submit", (e) => {
    e.preventDefault();

  console.log(e);
});


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