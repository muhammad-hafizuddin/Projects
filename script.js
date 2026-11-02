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

const fetchMedicationSuggestions = async (query) => {
  try {
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}&maxEntries=???`
    );

    // fetch doesn't throw on 404/500, so check it yourself
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // candidate may be missing → fall back to an empty array
    const candidates = data.approximateGroup?.candidate ?? [];

    // keep only candidates that have a name, then take just the name
    const names = candidates
      .filter(c => c.name)
      .map(c => c.name);

    // Set removes duplicates, spread turns it back into an array
    return [...new Set(names)];

  } catch (error) {
    console.error('Medication lookup failed:', error);
    return []; // fail quietly: the user can still type manually
  }
};

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