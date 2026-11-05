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

// RENDERAUTOCOMPLETE SECTION
const medNameInput = document.getElementById('med-name');
const autoList     = document.getElementById('auto-complete-list');

// STORAGE SECTION
const STORAGE_KEY = 'caretrack-medications';
// Load medications from localStorage or use default if none exist
const defaultMedications = [
  { id: 'med-1', name: 'APO-CLOPIDOGREL 75mg', dose: '1 tablet',
    times: ['06:30'], goutOnly: false, active: true,
    notes: 'Blood thinner — stroke prevention', quantity: 30 },
  { id: 'med-2', name: 'LIPITOR 40mg (Atorvastatin)', dose: '1 tablet',
    times: ['20:15'], goutOnly: false, active: true,
    notes: 'Cholesterol', quantity: 30 },
  { id: 'med-3', name: 'TRIPLIXAM 10/2.5/10mg', dose: '1 tablet',
    times: ['09:30'], goutOnly: false, active: true,
    notes: 'Blood pressure', quantity: 30 },
  { id: 'med-4', name: 'ETORICOXIB 90mg (Arcoxia)', dose: '1 tablet',
    times: ['14:00', '20:15'], goutOnly: true, active: true,
    notes: 'Gout pain relief — when necessary', quantity: 14 },
  { id: 'med-5', name: 'ALLOPURINOL 300mg (Zyloric)', dose: '1 tablet',
    times: ['09:30'], goutOnly: false, active: true,
    notes: 'Gout prevention', quantity: 30 },
  { id: 'med-6', name: 'TOLCHICINE 0.6mg (Colchicine)', dose: '1 tablet',
    times: ['14:00', '20:15'], goutOnly: true, active: true,
    notes: 'Gout — when necessary', quantity: 14 },
];

const loadMedications = () => {
  const saved = localStorage.getItem(STORAGE_KEY);        // read using the key

  if (!saved) return defaultMedications;          // first visit: nothing saved yet

  try {
    return JSON.parse(saved);                       // string → array
  } catch (error) {
    console.error('Saved data is corrupted:', error);
    return defaultMedications;
  }
};

const saveMedications = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));   // array → string
};

let medications = loadMedications();

console.log('Loaded medications:', medications);

// Function to fetch medication suggestions from the API
const fetchMedicationSuggestions = async (query) => {
  try {
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}&maxEntries=8`
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
fetchMedicationSuggestions("lipitor").then(console.log);


// Render the suggestions in the dropdown
const renderSuggestions = (names) => {
  autoList.innerHTML = '';              // clear old suggestions

  if (names.length === 0) {
    autoList.classList.add('hidden');   // nothing to show
    return;
  }

  names.forEach(name => {
    const item = document.createElement('div');
    item.className   = 'auto-complete-item'; // class from your CSS
    item.textContent = name;            // textContent, not innerHTML

    item.addEventListener('click', () => {
      medNameInput.value = name;         // put the chosen name in the input
      autoList.classList.add('hidden');
    });

    autoList.appendChild(item);
  });

  autoList.classList.remove('hidden');
};

let debounceTimer;

medNameInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);          // cancel the previous timer

  const query = medNameInput.value.trim();

  if (query.length < 2 ) {             // too short to search
    autoList.classList.add('hidden');
    return;
  }

  debounceTimer = setTimeout(async () => {
    const names = await fetchMedicationSuggestions(query);
    if (medNameInput.value.trim() !== query) return; // user kept typing, ignore this result
    renderSuggestions(names);
  }, 300);                         // milliseconds to wait

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