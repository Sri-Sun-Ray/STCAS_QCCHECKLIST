let unsavedChanges=false;
const rowImages = new Map(); // Store images for each row
// Delegated event listeners to track any changes and enable the Update button automatically
document.addEventListener("change", function (event) {
  if (event.target.matches("input, select, textarea")) {
    markDataAsUnsaved();
  }
});
document.addEventListener("input", function (event) {
  if (event.target.matches("input, textarea")) {
    markDataAsUnsaved();
  }
});
const k=0
// Variables to store station info from session or none
let stationId = "";
let stationName = "";
let zone = [];
let division = [];
let sectionName=[];
let initialDate = "";
let updatedDate = "";

var data = [];



// Update division dropdown based on selected zone
function updateDivisionNames() {
  const zoneSelect = document.getElementById("zone");
  const divisionSelect = document.getElementById("division");
  const selectedZone = zoneSelect.value;

  console.log("updateDivisionNames called with zone:", selectedZone);

  // Store the current division value to restore it if possible
  const currentDivision = divisionSelect.value;
  console.log("Current division value:", currentDivision);

  // Clear existing options
  divisionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

  // If no zone is selected, don't populate divisions
  if (!selectedZone) {
    console.log("No zone selected, returning early");
    return;
  }

  // Define all divisions with their corresponding zones
  const divisions = [
    { name: "Mumbai", zone: "CR" },
    { name: "Nagpur", zone: "CR" },
    { name: "Bhusawal", zone: "CR" },
    { name: "Pune", zone: "CR" },
    { name: "Sholapur", zone: "CR" },
    { name: "Howrah-COO", zone: "ER" },
    { name: "Pt Deendayal Upadhy - Pradhankhnta", zone: "ECR" },
    { name: "Matura-Palwal", zone: "NCR" },
    { name: "Jhansi", zone: "NCR" },
    { name: "Nanded-Aurangabad", zone: "SCR" },
    { name: "Vijayawada - Ballarshah", zone: "SCR" },
    { name: "Bangalore - Mysore", zone: "SWR" },
    { name: "Bajva - Ahmedabad", zone: "WR" },
    { name: "Ahmedabad", zone: "WR" },
    { name: "Ratlam", zone: "WR" },
    { name: "Rajkot", zone: "WR" },
    { name: "Bhopal", zone: "WCR" },
    { name: "Matura-Nagda", zone: "WCR" }
  ];

  // Filter divisions for the selected zone
  const filteredDivisions = divisions.filter(div => div.zone === selectedZone);

  // Add filtered divisions to the dropdown
  filteredDivisions.forEach(div => {
    const option = document.createElement("option");
    option.value = div.name;
    option.text = div.name;
    option.setAttribute("data-zone", div.zone);
    if (div.name === currentDivision) {
      option.selected = true;
    }
    divisionSelect.appendChild(option);
  });

  // If no divisions are available for the selected zone, ensure the dropdown is reset
  if (filteredDivisions.length === 0) {
    divisionSelect.value = "";
  }

  console.log("updateDivisionNames completed. Final division value:", divisionSelect.value);
}


function updateSectionNames() {
  const zoneSelect = document.getElementById("zone");
  const sectionSelect = document.getElementById("section-name");
  const selectedZone = zoneSelect.value;

  console.log("updateSectionNames called with zone:", selectedZone);

  // Store the current section value to restore it if possible
  const currentSection = sectionSelect.value;
  console.log("Current division value:", currentSection);

  // Clear existing options
  sectionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

  // If no zone is selected, don't populate sections
  if (!selectedZone) {
    console.log("No zone selected, returning early");
    return;
  }

  // Define all sections with their corresponding zones
  const sections = [
    { name: "Mumbai", zone: "CR" },
    { name: "Nagpur", zone: "CR" },
    { name: "Bhusawal", zone: "CR" },
    { name: "Pune", zone: "CR" },
    { name: "Sholapur", zone: "CR" },
    { name: "Howrah-COO", zone: "ER" },
    { name: "Pt Deendayal Upadhy - Pradhankhnta", zone: "ECR" },
    { name: "Matura-Palwal", zone: "NCR" },
    { name: "Jhansi", zone: "NCR" },
    { name: "Nanded-Aurangabad", zone: "SCR" },
    { name: "Vijayawada - Ballarshah", zone: "SCR" },
    { name: "Bangalore - Mysore", zone: "SWR" },
    { name: "Bajva - Ahmedabad", zone: "WR" },
    { name: "Ahmedabad", zone: "WR" },
    { name: "Ratlam", zone: "WR" },
    { name: "Rajkot", zone: "WR" },
    { name: "Bhopal", zone: "WCR" },
    { name: "Matura-Nagda", zone: "WCR" }
  ];

  // Filter sections for the selected zone
  const filteredSections = sections.filter(sec => sec.zone === selectedZone);

  // Add filtered sections to the dropdown
  filteredSections.forEach(sec => {
    const option = document.createElement("option");
    option.value = sec.name;
    option.text = sec.name;
    option.setAttribute("data-zone", sec.zone);
    if (sec.name === currentSection) {
      option.selected = true;
    }
    sectionSelect.appendChild(option);
  });

  // If no sections are available for the selected zone, ensure the dropdown is reset
  if (filteredSections.length === 0) {
    sectionSelect.value = "";
  }

  console.log("updateSectionNames completed. Final section value:", sectionSelect.value);
}

// Toggle subsections visibility
function toggleSubsections(button) {
  const subsectionsDiv = button.nextElementSibling;
  if (subsectionsDiv && subsectionsDiv.classList.contains('subsections')) {
    // Toggle the display
    const isHidden = subsectionsDiv.style.display === 'none' || subsectionsDiv.style.display === '';

    if (isHidden) {
      subsectionsDiv.style.display = 'block';
      subsectionsDiv.classList.add('show');
      // Update arrow icon by replacing text content carefully
      const text = button.innerText;
      if (text.startsWith('▶')) {
        button.innerText = text.replace('▶', '▼');
      }
      button.classList.add('expanded');
    } else {
      subsectionsDiv.style.display = 'none';
      subsectionsDiv.classList.remove('show');
      // Update arrow icon by replacing text content carefully
      const text = button.innerText;
      if (text.startsWith('▼')) {
        button.innerText = text.replace('▼', '▶');
      }
      button.classList.remove('expanded');
    }
  }
}

// Store current active subsection globally
let activeSubsection = null;

// Function to clear section content while preserving station info
function clearSectionContent() {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  // Find and remove all table containers (sections)
  const tableContainers = mainContent.querySelectorAll('.table-container');
  tableContainers.forEach(container => container.remove());

  // Find and remove action buttons div
  const actionButtons = mainContent.querySelector('.action-buttons');
  if (actionButtons) {
    actionButtons.remove();
  }

  // Find and remove section headings
  const headings = mainContent.querySelectorAll('.section-heading');
  headings.forEach(heading => heading.remove());
}

// Function to filter table rows based on subsection
function filterTableRows(tableId, subsection) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.warn(`Table with ID ${tableId} not found`);
    return;
  }

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    // Get the first cell content (S_No)
    const firstCell = row.querySelector('td:first-child');
    const sNo = firstCell ? firstCell.innerText.trim() : '';

    if (!subsection) {
      // If no subsection specified, show all rows
      row.style.display = '';
      visibleCount++;
    } else {
      // Only show rows that start with the subsection number
      if (sNo && sNo.startsWith(subsection)) {
        row.style.display = '';
        visibleCount++;
        console.log(`Showing row: ${sNo}`);
      } else {
        row.style.display = 'none';
        console.log(`Hiding row: ${sNo} (looking for: ${subsection})`);
      }
    }
  });

  console.log(`Filter complete. Showing ${visibleCount} out of ${rows.length} rows for subsection ${subsection}`);
}

// In showSection, decide if it's okay to switch sections, and if so, highlight the new button.
async function showSection(section, subsection) {
  if (unsavedChanges) {
    const proceed = confirm("You have unsaved changes in this section. Do you want to continue?");
    if (!proceed) {
      return;
    } else {
      unsavedChanges = false;
    }
  }

  const buttons = document.querySelectorAll(".sidebar .button");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Handle subsection buttons
  const allSubsectionButtons = document.querySelectorAll(".sidebar .subsection-button");
  allSubsectionButtons.forEach(btn => btn.classList.remove("active"));

  // If subsection is provided, highlight the active subsection button
  if (subsection) {
    activeSubsection = subsection;
    const activeSubBtn = [...allSubsectionButtons].find(btn => {
      return btn.getAttribute('onclick') === `showSection('${section}', '${subsection}')`;
    });
    if (activeSubBtn) {
      activeSubBtn.classList.add("active");
    }
  } else {
    activeSubsection = null;
  }

  const newActiveBtn = [...buttons].find(btn => {
    return btn.getAttribute('onclick') === `showSection('${section}')`;
  });

  if (newActiveBtn) {
    newActiveBtn.classList.add("active");
  }



  const mainContent = document.getElementById("main-content");
  const currentDate = new Date().toISOString().split("T")[0];

  // ✅ Global listeners to ensure ANY change in the section enables the Update button
  mainContent.removeEventListener("input", markDataAsUnsaved);
  mainContent.removeEventListener("change", markDataAsUnsaved);
  mainContent.addEventListener("input", markDataAsUnsaved);
  mainContent.addEventListener("change", markDataAsUnsaved);

  const storedLocal = localStorage.getItem("stationDetails");
  const storedSession = sessionStorage.getItem("stationInfo");

  console.log("Stored session data:", storedSession);

  let stationInfo = {};
  if (storedLocal) {
    stationInfo=JSON.parse(storedLocal);
  }
  else if(storedSession){
    stationInfo=JSON.parse(storedSession);
  } else {
    stationInfo = {
      stationId: "",
      stationName: "",
      zone: "",
      division: "",
      sectionName: "",
      initialDate: "",
      updatedDate: ""
    };
    console.log("No stored session data, using default station info");
  }



  /*const stationId = document.getElementById("station-id")?.value;
  const division = document.getElementById("division")?.value;
  const zone = document.getElementById("zone")?.value;*/
  const stationId=stationInfo.stationId;
  const division=stationInfo.division;
  const zone=stationInfo.zone;


  let backendSectionId=section;
    if (["0.0","2.0","3.0","4.0","5.0","6.0","7.0","8.0","9.0","10.0","11.0","12.0","13.0"].includes(section)) {
    backendSectionId = parseInt(section, 10);
  }


  const exists = await checkExistingObservations(stationId, division, zone, backendSectionId, subsection);

  setTimeout(() => {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
      const saveBtn = actionButtons.querySelector('#save-btn');
      const getDetailsBtn = actionButtons.querySelector('#get-details-btn');
      const updateBtn = actionButtons.querySelector('#update-btn');

      // NEW: Check in-memory observations first to maintain state across subsection navigation
      if (window.allObservations && window.allObservations.length > 0) {
          let hasDataForSubsection = false;
          if (subsection) {
              // Check if currently loaded data has entries for this specific subsection/prefix
              hasDataForSubsection = window.allObservations.some(obs => obs.S_no && String(obs.S_no).startsWith(subsection));
              console.log(`[showSection] In-memory check for subsection ${subsection}: ${hasDataForSubsection}`);
          } else {
             // If no subsection, check if we have data for this specific section ID
             const checkSectionId = section.replace('.', '_');
             hasDataForSubsection = window.allObservations.some(obs => obs.section_id === checkSectionId);
             console.log(`[showSection] In-memory check for section ${section} (${checkSectionId}): ${hasDataForSubsection}`);
          }

          if (hasDataForSubsection) {
              if (saveBtn) saveBtn.style.display = 'none';
              if (getDetailsBtn) getDetailsBtn.style.display = 'none';
              if (updateBtn) updateBtn.style.display = 'inline-block';
          } else {
              if (saveBtn) saveBtn.style.display = 'inline-block';
              if (getDetailsBtn) getDetailsBtn.style.display = 'none'; // Don't ask to get details again if we have the full set
              if (updateBtn) updateBtn.style.display = 'none';
          }
          return;
      }

      // If we don't have local data, but DB says exists:
      if (exists) {
        console.log("DB indicates data exists. Fetching full details to sync UI...");
        // Call getDetails to populate the form and correctly set button states based on actual data
        getDetails();
        return;
      }

      // If exists is false:
      if (saveBtn) saveBtn.style.display = 'inline-block';
      if (getDetailsBtn) getDetailsBtn.style.display = 'none';
      if (updateBtn) updateBtn.style.display = 'none';

    }
  }, 100);

  const stationIdElem = document.getElementById("station-id");
  if (stationIdElem) {
    stationIdElem.value = stationInfo.stationId || "";
  }

  const stationNameElem = document.getElementById("station-name");
  if (stationNameElem) {
    stationNameElem.value = stationInfo.stationName || "";
  }

  const zoneElem = document.getElementById("zone");
  if (zoneElem) {
    // Temporarily remove the onchange event to prevent updateDivisionNames from being called
    const originalOnChange = zoneElem.getAttribute('onchange');
    zoneElem.removeAttribute('onchange');

    zoneElem.value = stationInfo.zone || "";

    // If zone is set, update division dropdown and then set division value
    if (stationInfo.zone) {
      updateDivisionNames();
      // Set division value after a short delay to ensure dropdown is populated
      setTimeout(() => {
        const divisionElem = document.getElementById("division");
        if (divisionElem && stationInfo.division) {
          divisionElem.value = stationInfo.division;
          console.log("Setting division value to:", stationInfo.division);
        }
      }, 50);

      updateSectionNames();
      // Set section value after a short delay to ensure dropdown is populated.

      setTimeout(()=>{
        const sectionNameElem=document.getElementById("section-name");
        if(sectionNameElem && stationInfo.sectionName){
          sectionNameElem.value=stationInfo.sectionName;
          console.log("Setting section value to:", stationInfo.sectionName);
        }
      },50);
    }

    // Restore the onchange event
    if (originalOnChange) {
      zoneElem.setAttribute('onchange', originalOnChange);
    }
  } else {
    // If zone is not set, still try to set division value
    const divisionElem = document.getElementById("division");
    if (divisionElem) {
      divisionElem.value = stationInfo.division || "";
    }

    const sectionNameElem = document.getElementById("section-name");
    if (sectionNameElem) {
      sectionNameElem.value = stationInfo.sectionName || "";
  }
}



  const stationDetailsHTML = `
    <div id="form-container">
      <section>
        <form id="stationForm" action="connect.php" method="POST" onsubmit="event.preventDefault(); return false;">
          <table class="detail-box station-table">
            <tr>
              <td><strong>Station ID:</strong><input type="text" id="station-id" placeholder="Enter the Station ID" value="${stationInfo ? stationInfo.stationId : ""}"></td>
              <td><strong>Station Name:</strong><input type="text" id="station-name" placeholder="Enter the Station Name" value="${stationInfo ? stationInfo.stationName : ""}"></td>
              <td><strong>Zone:</strong>
                <select name="zone" id="zone" onchange="updateDivisionNames(); updateSectionNames();">
                  <option value="" disabled selected>Select</option>
                  <option value="CR" ${stationInfo && stationInfo.zone === "CR" ? "selected" : ""}>Central Railway</option>
                  <option value="ER" ${stationInfo && stationInfo.zone === "ER" ? "selected" : ""}>Eastern Railway</option>
                  <option value="ECR" ${stationInfo && stationInfo.zone === "ECR" ? "selected" : ""}>East Central Railway</option>
                  <option value="ECoR" ${stationInfo && stationInfo.zone === "ECoR" ? "selected" : ""}>East Coast Railway</option>
                  <option value="NR" ${stationInfo && stationInfo.zone === "NR" ? "selected" : ""}>Northern Railway</option>
                  <option value="NCR" ${stationInfo && stationInfo.zone === "NCR" ? "selected" : ""}>North Central Railway</option>
                  <option value="NER" ${stationInfo && stationInfo.zone === "NER" ? "selected" : ""}>North Eastern Railway</option>
                  <option value="NFR" ${stationInfo && stationInfo.zone === "NFR" ? "selected" : ""}>North Frontier Railway</option>
                  <option value="NWR" ${stationInfo && stationInfo.zone === "NWR" ? "selected" : ""}>North Western Railway</option>
                  <option value="SR" ${stationInfo && stationInfo.zone === "SR" ? "selected" : ""}>Southern Railway</option>
                  <option value="SCR" ${stationInfo && stationInfo.zone === "SCR" ? "selected" : ""}>South Central Railway</option>
                  <option value="SER" ${stationInfo && stationInfo.zone === "SER" ? "selected" : ""}>South Eastern Railway</option>
                  <option value="SECR" ${stationInfo && stationInfo.zone === "SECR" ? "selected" : ""}>South East Central Railway</option>
                  <option value="SWR" ${stationInfo && stationInfo.zone === "SWR" ? "selected" : ""}>South Western Railway</option>
                  <option value="WR" ${stationInfo && stationInfo.zone === "WR" ? "selected" : ""}>Western Railway</option>
                  <option value="WCR" ${stationInfo && stationInfo.zone === "WCR" ? "selected" : ""}>West Central Railway</option>
                </select>
              </td>
              <td><strong>Division:</strong>
                <select id="division">
                  <option value="" disabled selected>Select</option>
                  <option value="Mumbai" data-zone="CR" ${stationInfo && stationInfo.division === "Mumbai" ? "selected" : ""}>Mumbai</option>
                  <option value="Nagpur" data-zone="CR" ${stationInfo && stationInfo.division === "Nagpur" ? "selected" : ""}>Nagpur</option>
                  <option value="Bhusawal" data-zone="CR" ${stationInfo && stationInfo.division === "Bhusawal" ? "selected" : ""}>Bhusawal</option>
                  <option value="Pune" data-zone="CR" ${stationInfo && stationInfo.division === "Pune" ? "selected" : ""}>Pune</option>
                  <option value="Sholapur" data-zone="CR" ${stationInfo && stationInfo.division === "Sholapur" ? "selected" : ""}>Sholapur</option>
                  <option value="Howrah-COO" data-zone="ER" ${stationInfo && stationInfo.division === "Howrah-COO" ? "selected" : ""}>Howrah-COO</option>
                  <option value="Pt Deendayal Upadhy - Pradhankhnta" data-zone="ECR" ${stationInfo && stationInfo.division === "Pt Deendayal Upadhy - Pradhankhnta" ? "selected" : ""}>Pt Deendayal Upadhy - Pradhankhnta</option>
                  <option value="Matura-Palwal" data-zone="NCR" ${stationInfo && stationInfo.division === "Matura-Palwal" ? "selected" : ""}>Matura-Palwal</option>
                  <option value="Jhansi" data-zone="NCR" ${stationInfo && stationInfo.division === "Jhansi" ? "selected" : ""}>Jhansi</option>
                  <option value="Nanded-Aurangabad" data-zone="SCR" ${stationInfo && stationInfo.division === "Nanded-Aurangabad" ? "selected" : ""}>Nanded-Aurangabad</option>
                  <option value="Vijayawada - Ballarshah" data-zone="SCR" ${stationInfo && stationInfo.division === "Vijayawada - Ballarshah" ? "selected" : ""}>Vijayawada - Ballarshah</option>
                  <option value="Bangalore - Mysore" data-zone="SWR" ${stationInfo && stationInfo.division === "Bangalore - Mysore" ? "selected" : ""}>Bangalore - Mysore</option>
                  <option value="Bajva - Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.division === "Bajva - Ahmedabad" ? "selected" : ""}>Bajva - Ahmedabad</option>
                  <option value="Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.division === "Ahmedabad" ? "selected" : ""}>Ahmedabad</option>
                  <option value="Ratlam" data-zone="WR" ${stationInfo && stationInfo.division === "Ratlam" ? "selected" : ""}>Ratlam</option>
                  <option value="Rajkot" data-zone="WR" ${stationInfo && stationInfo.division === "Rajkot" ? "selected" : ""}>Rajkot</option>
                  <option value="Bhopal" data-zone="WCR" ${stationInfo && stationInfo.division === "Bhopal" ? "selected" : ""}>Bhopal</option>
                  <option value="Matura-Nagda" data-zone="WCR" ${stationInfo && stationInfo.division === "Matura-Nagda" ? "selected" : ""}>Matura-Nagda</option>
                </select>
              </td>
              <td><strong>Section :</strong>
                <select id="section-name">
                  <option value="" disabled selected>Select</option>
                  <option value="Mumbai" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Mumbai" ? "selected" : ""}>Mumbai</option>
                  <option value="Nagpur" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Nagpur" ? "selected" : ""}>Nagpur</option>
                  <option value="Bhusawal" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Bhusawal" ? "selected" : ""}>Bhusawal</option>
                  <option value="Pune" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Pune" ? "selected" : ""}>Pune</option>
                  <option value="Sholapur" data-zone="CR" ${stationInfo && stationInfo.sectionName === "Sholapur" ? "selected" : ""}>Sholapur</option>
                  <option value="Howrah-COO" data-zone="ER" ${stationInfo && stationInfo.sectionName === "Howrah-COO" ? "selected" : ""}>Howrah-COO</option>
                  <option value="Pt Deendayal Upadhy - Pradhankhnta" data-zone="ECR" ${stationInfo && stationInfo.sectionName === "Pt Deendayal Upadhy - Pradhankhnta" ? "selected" : ""}>Pt Deendayal Upadhy - Pradhankhnta</option>
                  <option value="Matura-Palwal" data-zone="NCR" ${stationInfo && stationInfo.sectionName === "Matura-Palwal" ? "selected" : ""}>Matura-Palwal</option>
                  <option value="Jhansi" data-zone="NCR" ${stationInfo && stationInfo.sectionName === "Jhansi" ? "selected" : ""}>Jhansi</option>
                  <option value="Nanded-Aurangabad" data-zone="SCR" ${stationInfo && stationInfo.sectionName === "Nanded-Aurangabad" ? "selected" : ""}>Nanded-Aurangabad</option>
                  <option value="Vijayawada - Ballarshah" data-zone="SCR" ${stationInfo && stationInfo.sectionName === "Vijayawada - Ballarshah" ? "selected" : ""}>Vijayawada - Ballarshah</option>
                  <option value="Bangalore - Mysore" data-zone="SWR" ${stationInfo && stationInfo.sectionName === "Bangalore - Mysore" ? "selected" : ""}>Bangalore - Mysore</option>
                  <option value="Bajva - Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Bajva - Ahmedabad" ? "selected" : ""}>Bajva - Ahmedabad</option>
                  <option value="Ahmedabad" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Ahmedabad" ? "selected" : ""}>Ahmedabad</option>
                  <option value="Ratlam" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Ratlam" ? "selected" : ""}>Ratlam</option>
                  <option value="Rajkot" data-zone="WR" ${stationInfo && stationInfo.sectionName === "Rajkot" ? "selected" : ""}>Rajkot</option>
                  <option value="Bhopal" data-zone="WCR" ${stationInfo && stationInfo.sectionName === "Bhopal" ? "selected" : ""}>Bhopal</option>
                  <option value="Matura-Nagda" data-zone="WCR" ${stationInfo && stationInfo.sectionName === "Matura-Nagda" ? "selected" : ""}>Matura-Nagda</option>
                </select>
              </td>
              <td><strong>Initial Date:</strong><input type="date" id="initial-date" style="font-family: inherit; font-size: inherit; color: inherit; border: 1px solid #ccc; padding: 5px 10px;" /></td>
              <td><strong>Updated Date:</strong><input type="date" id="updated-date" style="font-family: inherit; font-size: inherit; color: inherit; border: 1px solid #ccc; padding: 5px 10px;" /></td>
            </tr>
          </table>
        </form>
      </section>
    </div>
  `;

  mainContent.innerHTML = stationDetailsHTML;
  console.log(k);

  // Note: Division dropdown is already populated in the HTML template above
  // and the zone value is already set, so updateDivisionNames() will be called
  // automatically when the zone dropdown's onchange event fires

  setTimeout(() => {
    const initialDateInput = document.getElementById("initial-date");
    if (initialDateInput) {
      // Use stored initialDate if available, otherwise use today
      let dateValue = (stationInfo && stationInfo.initialDate) ? new Date(stationInfo.initialDate) : new Date();
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, "0");
      const day = String(dateValue.getDate()).padStart(2, "0");
      initialDateInput.value = `${year}-${month}-${day}`;
    }

    const updatedDateInput = document.getElementById("updated-date");
    if (updatedDateInput) {
      // Always use today for updatedDate when opening to edit
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      updatedDateInput.value = `${year}-${month}-${day}`;
    }
  }, 10);



  // Dynamically load content based on the section clicked
  if (section === "0.0") {
    let saveBtnDisplay = "inline-block";
    let getDetailsBtnDisplay = "none";

    // Check if we came from the Edit button in viewReports.php
    const urlParams = new URLSearchParams(window.location.search);
    const stationIdFromUrl = urlParams.get('station_id');

    // If we came from the Edit button, show Get Details and hide Save
    if (stationIdFromUrl) {
      saveBtnDisplay = "none";
      getDetailsBtnDisplay = "inline-block";
    }
    mainContent.innerHTML += `
      <div class="actio-buttons">
         <button
          id="station-info-btn"
          type="button"
          onclick="saveStationInfo('station-info')"
          style="display:${saveBtnDisplay};"
        >
          Save Station Info
        </button>
        <button
          id="get-details-btn"
          data-section="0.0"
          onclick="getDetails()"
          style="display:${getDetailsBtnDisplay};"
        >
          Get Details
        </button>
        
      </div>
    `;
  }else if (section === "2.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading">SERIAL NUMBER VERIFICATION</h3>
      <div class="table-container">
      <table class="observations" id="observations-section-2_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Units/Serial Numbers</th>
            <th>Observation</th>
            <th>Remarks/Comments</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-2_0">
        <tr id="row-11">
        <td>1.1</td>
      <td class="observation_text" style="padding-right: 10px;"> 
      Stationary Kavach Unit
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "/>
  </td>
      
       <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
      </td>
      <td class ="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
      </td>
      <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-11" style="display: none;">
      <button class="add-image" onclick="startCamera(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-11" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-11" accept="image/*" multiple onchange="displayImages(this, 11)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-11"></div>
      <!-- Camera Container -->
    <div id="camera-container-11" style="display: none;">
      <video id="camera-11" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(11)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-11" style="display: none;"></canvas>
    </div>
  </td>

    </tr>
        <tr id="row-12">
        <td>1.2</td>
      <td class="observation_text" style="padding-right: 10px;">
    Peripheral Processing Card 1
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "/>
  </td>
      <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
      <td class ="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
      </td>
      <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-12" style="display: none;">
      <button class="add-image" onclick="startCamera(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-12" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-12" accept="image/*" multiple onchange="displayImages(this, 12)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-12"></div>
      <!-- Camera Container -->
    <div id="camera-container-12" style="display: none;">
      <video id="camera-12" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(12)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-12" style="display: none;"></canvas>
    </div>
  </td>

    </tr>

    <tr id="row-13">
  <td>1.3</td>
  <td class="observation_text" style="padding-right: 10px;">
    Peripheral Processing Card 2
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 113) {
      this.value = this.value.slice(-113);
    }
    toggleNotInstalledOption(this);
  "/>
  </td>
  

  
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-13" style="display: none;">
      <button class="add-image" onclick="startCamera(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-13" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-13" accept="image/*" multiple onchange="displayImages(this, 13)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-13"></div>
      <!-- Camera Container -->
    <div id="camera-container-13" style="display: none;">
      <video id="camera-13" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(13)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-13" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-14">
  <td>1.4</td>
  <td class="observation_text" style="padding-right: 10px;">
   Vital Computer Card -1
    <input 
      type="text" 
      id="kavach-main-unit" 
      name="barcode_kavach_main_unit" 
      pattern="^\d{10,15}$" 
      title="Enter a number between 10 to 15 digits" 
      placeholder="Scan Barcode" 
      style="width:180px; padding:5px; font-size:14px;" 
      oninput="
        if (this.value.length > 15) this.value = this.value.slice(-15);
        toggleNotInstalledOption(this);
      "
    >
  </td>
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-14" style="display: none;">
      <button class="add-image" onclick="startCamera(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-14" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-14" accept="image/*" multiple onchange="displayImages(this, 14)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-14"></div>
      <!-- Camera Container -->
    <div id="camera-container-14" style="display: none;">
      <video id="camera-14" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(14)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-14" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-15">
  <td>1.5</td>
  <td class="observation_text">
    Vital Computer Card -2
    <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  <td class="select">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
 <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-15" style="display: none;">
      <button class="add-image" onclick="startCamera(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-15" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-15" accept="image/*" multiple onchange="displayImages(this, 15)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-15"></div>
      <!-- Camera Container -->
    <div id="camera-container-15" style="display: none;">
      <video id="camera-15" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(15)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-15" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-16">
  <td>1.6</td>
   <td class="observation_text">
    Vital Computer Card -3<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
   oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  
  </td>
  <td class="select">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-16" style="display: none;">
      <button class="add-image" onclick="startCamera(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-16" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-16" accept="image/*" multiple onchange="displayImages(this, 16)" style="display: none;">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-16"></div>
      <!-- Camera Container -->
    <div id="camera-container-16" style="display: none;">
      <video id="camera-16" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(16)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-16" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-17">
  <td>1.7</td>
   <td class="observation_text">
    Voter Card -1 <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </td>
  
  <td class="select">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px; margin-bottom: 10px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
   <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td style="padding-right: 10px;">
    <button class="add-image" onclick="showUploadOptions(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Add Image</button>
    <div class="upload-options" id="upload-options-17" style="display: none;">
      <button class="add-image" onclick="startCamera(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Camera</button>
      <label for="file-input-17" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-17" accept="image/*" multiple onchange="displayImages(this, 17)" style="display: none;">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-17"></div>
      <!-- Camera Container -->
    <div id="camera-container-17" style="display: none;">
      <video id="camera-17" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Capture Image</button>
      <button class="add-image" onclick="stopCamera(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(17)" style="margin-left: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;">🔄 Switch Camera</button>
      <canvas id="canvas-17" style="display: none;"></canvas>
    </div>
  </td>
</tr>
<tr id="row-18">
  <td>1.8</td>
  <td class="observation_text">
     Voter Card -2<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </td>
   <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(10)">Add Image</button>
    <div class="upload-options" id="upload-options-10" style="display: none;">
      <button class="add-image" onclick="startCamera(10)">Camera</button>
      <label for="file-input-10" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-10" accept="image/*" multiple onchange="displayImages(this, 10)">
   </div>
      <!-- Container for multiple images --> 
      <div id="image-container-10"></div>
      <!-- Camera Container -->
    <div id="camera-container-10" style="display: none;">
      <video id="camera-10" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(10)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(10)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(10)">🔄 Switch Camera</button>
      <canvas id="canvas-10" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-19">
  <td>1.9</td>
  <td class="observation_text">
    Vital Gateway Card 1<input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </td>
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(19)">Add Image</button>
    <div class="upload-options" id="upload-options-19" style="display: none;">
      <button class="add-image" onclick="startCamera(19)">Camera</button>
      <label for="file-input-19" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-19" accept="image/*" multiple onchange="displayImages(this, 19)">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-19"></div>
      <!-- Camera Container -->
    <div id="camera-container-19" style="display: none;">
      <video id="camera-19" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(19)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(19)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(19)">🔄 Switch Camera</button>
      <canvas id="canvas-19" style="display: none;"></canvas>
    </div>
  </td>
</tr>

<tr id="row-110">
  <td>1.10</td>
  <td class="observation_text">      
   Vital Gateway Card 2 <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  
  </td>
  <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
  <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
  <td>
    <button class="add-image" onclick="showUploadOptions(12)">Add Image</button>
    <div class="upload-options" id="upload-options-12" style="display: none;">
      <button class="add-image" onclick="startCamera(12)">Camera</button>
      <label for="file-input-12" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
      <input type="file" id="file-input-12" accept="image/*" multiple onchange="displayImages(this, 12)">
    </div>
      <!-- Container for multiple images --> 
      <div id="image-container-12"></div>
      <!-- Camera Container -->
    <div id="camera-container-12" style="display: none;">
      <video id="camera-12" width="100%" height="auto" autoplay></video>
      <button class="add-image" onclick="captureImage(12)">Capture Image</button>
      <button class="add-image" onclick="stopCamera(12)">Stop Camera</button>
      <button class="reverse-camera" onclick="switchCamera(12)">🔄 Switch Camera</button>
      <canvas id="canvas-12" style="display: none;"></canvas>
    </div>
  </td>
</tr>

          </tr>
          <tr id="row-111">
            <td>1.11</td>
           <td class="observation_text">Vital Gateway Card 3 (NMS)
           <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
           
          </td>
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
              <td>
       <button class="add-image" onclick="showUploadOptions(111)">Add Image</button>
<div class="upload-options" id="upload-options-111" style="display: none;">
  <button class="add-image" onclick="startCamera(111)">Camera</button>
  <label for="file-input-111" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-111" accept="image/*" multiple onchange="displayImages(this, 111)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-111"></div>
      <!-- Camera Container -->
<div id="camera-container-111" style="display: none;">
  <video id="camera-111" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(111)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(111)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(111)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-111" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-14">
            <td >1.12</td>
           <td class="observation_text"> Field Scanner Card 1
           <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
   oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> 
          </td>

        
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
             <td>
       <button class="add-image" onclick="showUploadOptions(14)">Add Image</button>
<div class="upload-options" id="upload-options-14" style="display: none;">
  <button class="add-image" onclick="startCamera(14)">Camera</button>
  <label for="file-input-14" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-14" accept="image/*" multiple onchange="displayImages(this, 14)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-14"></div>
      <!-- Camera Container -->
<div id="camera-container-14" style="display: none;">
  <video id="camera-14" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(14)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(14)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(14)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-14" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-113">
            <td>1.13</td>
           <td class="observation_text"> Field Scanner Card 2
        <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 113) {
      this.value = this.value.slice(-113);
    }
    toggleNotInstalledOption(this);
  "
/>  
 <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
          <td>
       <button class="add-image" onclick="showUploadOptions(113)">Add Image</button>
<div class="upload-options" id="upload-options-113" style="display: none;">
  <button class="add-image" onclick="startCamera(113)">Camera</button>
 <label for="file-input-113" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-113" accept="image/*" multiple onchange="displayImages(this, 113)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-113"></div>
      <!-- Camera Container -->
<div id="camera-container-113" style="display: none;">
  <video id="camera-113" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(113)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(113)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(113)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-113" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-114">
            <td>1.14</td>
           <td class="observation_text">
 Field Scanner Card 3
  <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
  </div>
</td>

            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(16)">Add Image</button>
<div class="upload-options" id="upload-options-16" style="display: none;">
  <button class="add-image" onclick="startCamera(16)">Camera</button>
  <label for="file-input-16" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-16" accept="image/*" multiple onchange="displayImages(this, 16)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-16"></div>
      <!-- Camera Container -->
<div id="camera-container-16" style="display: none;">
  <video id="camera-16" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(16)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(16)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(16)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-16" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-115">
            <td>1.15</td>
           <td class="observation_text">Field Scanner Card 4
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
   oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(115)">Add Image</button>
<div class="upload-options" id="upload-options-115" style="display: none;">
  <button class="add-image" onclick="startCamera(115)">Camera</button>
 <label for="file-input-115" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-115" accept="image/*" multiple onchange="displayImages(this, 115)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-115"></div>
      <!-- Camera Container -->
<div id="camera-container-115" style="display: none;">
  <video id="camera-115" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(115)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(115)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(115)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-115" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-116">
            <td>1.16</td>
           <td class="observation_text"> Station Radio Power Supply card-1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(18)">Add Image</button>
<div class="upload-options" id="upload-options-18" style="display: none;">
  <button class="add-image" onclick="startCamera(18)">Camera</button>
<label for="file-input-18" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-18" accept="image/*" onchange="displayImages(this, 18)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-18"></div>
      <!-- Camera Container -->
<div id="camera-container-18" style="display: none;">
  <video id="camera-18" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(18)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(18)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(18)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-18" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-117">
            <td>1.17</td>
           <td class="observation_text"> Next Gen/. Cal Amp Radio Modem
           <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(117)">Add Image</button>
<div class="upload-options" id="upload-options-117" style="display: none;">
  <button class="add-image" onclick="startCamera(117)">Camera</button>
  <label for="file-input-117" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-117" accept="image/*" multiple onchange="displayImages(this, 117)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-117"></div>
      <!-- Camera Container -->
<div id="camera-container-117" style="display: none;">
  <video id="camera-117" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(117)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(117)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(117)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-117" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>
          <tr id="row-118">
            <td>1.18</td>
           <td class="observation_text"> GPS & GSM Antenna-1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
    oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(20)">Add Image</button>
<div class="upload-options" id="upload-options-20" style="display: none;">
  <button class="add-image" onclick="startCamera(20)">Camera</button>
 <label for="file-input-20" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-20" accept="image/*" multiple onchange="displayImages(this, 20)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-20"></div>
      <!-- Camera Container -->
<div id="camera-container-20" style="display: none;">
  <video id="camera-20" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(20)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(20)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(20)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-20" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>


          </tr>
          <tr id="row-119">
            <td>1.19</td>
           <td class="observation_text"> GPS & GSM Antenna-2
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
            <td>
       <button class="add-image" onclick="showUploadOptions(119)">Add Image</button>
<div class="upload-options" id="upload-options-119" style="display: none;">
  <button class="add-image" onclick="startCamera(119)">Camera</button>
 <label for="file-input-119" class="upload-label" style="cursor: pointer; padding: 5px 10px; font-size: 14px;">Upload from Device</label>
  <input type="file" id="file-input-119" accept="image/*" multiple onchange="displayImages(this, 119)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-119"></div>
      <!-- Camera Container -->
<div id="camera-container-119" style="display: none;">
  <video id="camera-119" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(119)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(119)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(119)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-119" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>

          </tr>

          <tr id="row-120">
            <td>1.20</td>
           <td class = "observation_text"> SMOCIP Unit
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
           <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(22)">Add Image</button>
<div class="upload-options" id="upload-options-22" style="display: none;">
  <button class="add-image" onclick="startCamera(22)">Camera</button>
  <label for="file-input-22" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-22" accept="image/*" multiple onchange="displayImages(this, 22)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-22"></div>
      <!-- Camera Container -->
<div id="camera-container-22" style="display: none;">
  <video id="camera-22" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(22)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(22)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(22)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-22" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-121">
            <td>1.21</td>
           <td class = "observation_text">SMOCIP Termination Box
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
           <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(121)">Add Image</button>
<div class="upload-options" id="upload-options-121" style="display: none;">
  <button class="add-image" onclick="startCamera(121)">Camera</button>
  <label for="file-input-121" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-121" accept="image/*" multiple onchange="displayImages(this, 121)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-121"></div>
      <!-- Camera Container -->
<div id="camera-container-121" style="display: none;">
  <video id="camera-121" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(121)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(121)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(121)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-121" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
          <tr id="row-122">
            <td>1.22</td>
           <td class = "observation_text"> PDU Box
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
             <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(223)">Add Image</button>
<div class="upload-options" id="upload-options-223" style="display: none;">
  <button class="add-image" onclick="startCamera(223)">Camera</button>
  <label for="file-input-223" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-223" accept="image/*" multiple onchange="displayImages(this, 223)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-223"></div>
      <!-- Camera Container -->
<div id="camera-container-223" style="display: none;">
  <video id="camera-223" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(223)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(223)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(223)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-223" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-123">
            <td>1.23</td>
           <td class = "observation_text"> RTU 1
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(123)">Add Image</button>
<div class="upload-options" id="upload-options-123" style="display: none;">
  <button class="add-image" onclick="startCamera(123)">Camera</button>
  <label for="file-input-123" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-123" accept="image/*" multiple onchange="displayImages(this, 123)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-123"></div>
      <!-- Camera Container -->
<div id="camera-container-123" style="display: none;">
  <video id="camera-123" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(123)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(123)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(123)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-123" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

            <tr id="row-124">
            <td>1.24</td>
           <td class = "observation_text"> RTU-2
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/>
            <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
            <td class="remarks">
              <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
            </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(225)">Add Image</button>
<div class="upload-options" id="upload-options-225" style="display: none;">
  <button class="add-image" onclick="startCamera(225)">Camera</button>
  <label for="file-input-225" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-225" accept="image/*" multiple onchange="displayImages(this, 225)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-225"></div>
      <!-- Camera Container -->
<div id="camera-container-225" style="display: none;">
  <video id="camera-225" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(225)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(225)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(225)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-225" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

           <tr id="row-125">
            <td>1.25</td>
           <td class = "observation_text"> DC-DC Converter 
          <input 
  type="text" 
  id="kavach-main-unit" 
  name="barcode_kavach_main_unit" 
  pattern="^\d{10,15}$" 
  title="Enter a number between 10 to 15 digits" 
  placeholder="Scan Barcode" 
  style="width: 180px; padding: 5px; font-size: 14px;" 
  oninput="
    if(this.value.length > 15) {
      this.value = this.value.slice(-15);
    }
    toggleNotInstalledOption(this);
  "
/> <td class="select" style="padding-right: 10px;">
    <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
      <option value="Select">Select</option>
      <option value="Matching">Matching</option>
      <option value="Not Matching">Not Matching</option>
      <option value="Not Installed">Not Installed</option>
    </select>
  </td>
             <td class="remarks">
    <textarea placeholder="Verify with IC" rows="2" cols="20"></textarea><br>
  </td>
           <td>
       <button class="add-image" onclick="showUploadOptions(125)">Add Image</button>
<div class="upload-options" id="upload-options-125" style="display: none;">
  <button class="add-image" onclick="startCamera(125)">Camera</button>
  <label for="file-input-125" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-125" accept="image/*" multiple onchange="displayImages(this, 125)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-125"></div>
      <!-- Camera Container -->
<div id="camera-container-125" style="display: none;">
  <video id="camera-125" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(125)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(125)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(125)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-125" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
          </tr>

          
        </tbody>
      </table>
      </div>
      <div class="note" 
     style="display: inline-block; 
            background-color: #fff8dc; 
            border-left: 5px solid #a88314; 
            font-family: Arial, sans-serif; 
            color: #856404; 
            padding: 6px 12px; 
            margin-left: 40px; 
            border-radius: 4px; 
            white-space: nowrap;">
  ⚠️ <strong>Note:</strong> If any card or unit is replaced, kindly enter the new number and mention FSR details along with the old card number in the <strong>Remarks</strong> section.
</div>

      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('2_0', null, true)">
        Update
      </button>
    <button type="button" id= "save-btn" style = "display: inline-block;" onclick="saveObservation('2_0')">Save</button>
     <button id="get-details-btn" onclick="getDetails()">Get Details</button>
     <button type="button" id="add-row-btn" style="background-color: #28a745; color: white;" onclick="addRowWithPassword('2_0')">Add Row</button>
</div>`;
    loadCustomRows("2_0");
  } else if (section === "3.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading">Tower-Installation of Tower(If applicable based on the Contract)</h3>
       <div class="table-container">
      <table class="observations" id="observations-section-3_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-3_0">

    <tr id="row-21">
      <td>2.1</td>
      <td class="observation_text">Dimensions of building (LxWxH)</td>
      <td class="requirement_text">Building shall be constructed as per approved Building Diagram</td>
      <td class = "select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(21)">Add Image</button>
<div class="upload-options" id="upload-options-21" style="display: none;">
  <button class="add-image" onclick="startCamera(21)">Camera</button>
  <label for="file-input-21" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-21" accept="image/*" multiple onchange="displayImages(this, 21)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-21"></div>
      <!-- Camera Container -->
<div id="camera-container-21" style="display: none;">
  <video id="camera-21" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(21)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(21)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(21)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-21" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-22">
      <td>2.2</td>
      <td class="observation_text">Construction Quality</td>
      <td class="requirement_text">Walls and steps shall be free from cracks.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(38)">Add Image</button>
<div class="upload-options" id="upload-options-38" style="display: none;">
  <button class="add-image" onclick="startCamera(38)">Camera</button>
  <label for="file-input-38" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-38" accept="image/*" multiple onchange="displayImages(this, 38)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-38"></div>
      <!-- Camera Container -->
<div id="camera-container-38" style="display: none;">
  <video id="camera-38" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(38)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(38)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(38)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-38" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
<tr id="row-23">
      <td>2.3</td>
      <td class="observation_text">Floor Quality</td>
      <td class="requirement_text">1. Floor surface shall be levelled properly.<br>
      2. Tiles shall be laid after completion of concrete flooring.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(23)">Add Image</button>
<div class="upload-options" id="upload-options-23" style="display: none;">
  <button class="add-image" onclick="startCamera(23)">Camera</button>
  <label for="file-input-23" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-23" accept="image/*" multiple onchange="displayImages(this, 23)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-23"></div>
      <!-- Camera Container -->
<div id="camera-container-23" style="display: none;">
  <video id="camera-23" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(23)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(23)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(23)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-23" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-24">
      <td>2.4</td>
      <td class="observation_text">Door Arrangement</td>
      <td class="requirement_text">Doors and Door locks shall be provided as per tender requirement</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(39088)">Add Image</button>
<div class="upload-options" id="upload-options-39088" style="display: none;">
  <button class="add-image" onclick="startCamera(39088)">Camera</button>
  <label for="file-input-39088" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-39088" accept="image/*" multiple onchange="displayImages(this, 39088)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-39088"></div>
      <!-- Camera Container -->
<div id="camera-container-39088" style="display: none;">
  <video id="camera-39088" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(39088)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(39088)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(39088)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-39088" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
<tr id="row-25">
      <td>2.5</td>
      <td class="observation_text">Ventilation</td>
      <td class="requirement_text">Adequate ventilation / exhaust fan provided as per tender.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(25)">Add Image</button>
<div class="upload-options" id="upload-options-25" style="display: none;">
  <button class="add-image" onclick="startCamera(25)">Camera</button>
  <label for="file-input-25" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-25" accept="image/*" multiple onchange="displayImages(this, 25)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-25"></div>
      <!-- Camera Container -->
<div id="camera-container-25" style="display: none;">
  <video id="camera-25" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(25)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(25)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(25)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-25" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-26">
      <td>2.6</td>
      <td class="observation_text">Fire safety</td>
      <td class="requirement_text">Fire extinguisher provided</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(40)">Add Image</button>
<div class="upload-options" id="upload-options-40" style="display: none;">
  <button class="add-image" onclick="startCamera(40)">Camera</button>
  <label for="file-input-40" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-40" accept="image/*" multiple onchange="displayImages(this, 40)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-40"></div>
      <!-- Camera Container -->
<div id="camera-container-40" style="display: none;">
  <video id="camera-40" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(40)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(40)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(40)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-40" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
   
    </tr>

    <tr id="row-27">
      <td>2.7</td>
      <td class="observation_text">Cable entry sealing</td>
      <td class="requirement_text">All wall/floor cable entries sealed with fire-retardant compound</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(27)">Add Image</button>
<div class="upload-options" id="upload-options-27" style="display: none;">
  <button class="add-image" onclick="startCamera(27)">Camera</button>
  <label for="file-input-27" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-27" accept="image/*" multiple onchange="displayImages(this, 27)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-27"></div>
      <!-- Camera Container -->
<div id="camera-container-27" style="display: none;">
  <video id="camera-27" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(27)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(27)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(27)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-27" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>   
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('3_0')">
        Update
      </button>
       <button type="button" id= "save-btn" style = "display: inline-block;"  onclick="if(validateMandatoryImages('3_0')) { saveObservation('3_0'); }">Save</button>
        <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

  } else if (section === "4.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > RTU  </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-4_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-4_0">
          <tr id="row-31">
      <td>3.1</td>
      <td class="observation_text">Installation Location</td>
      <td class="requirement_text">Installation shall be at the approved Cable Route Plan</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(31)">Add Image</button>
<div class="upload-options" id="upload-options-31" style="display: none;">
  <button class="add-image" onclick="startCamera(31)">Camera</button>
  <label for="file-input-31" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-31" accept="image/*" multiple onchange="displayImages(this, 31)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-31"></div>
      <!-- Camera Container -->
<div id="camera-container-31" style="display: none;">
  <video id="camera-31" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(31)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(31)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(31)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-31" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-32">
      <td>3.2</td>
      <td class="observation_text">Soil test</td>
      <td class="requirement_text">Soil test report shall be available for the location.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(4265)">Add Image</button>
<div class="upload-options" id="upload-options-4265" style="display: none;">
  <button class="add-image" onclick="startCamera(4265)">Camera</button>
  <label for="file-input-4265" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-4265" accept="image/*" multiple onchange="displayImages(this, 4265)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-4265"></div>
<!-- Camera Container -->
<div id="camera-container-4265" style="display: none;">
  <video id="camera-4265" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(4265)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(4265)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(4265)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-4265" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-33">
      <td>3.3</td>
      <td class="observation_text">Foundation work as per the SBC report</td>
      <td class="requirement_text">Foundation design shall be as per the SBC specified in the soil test report.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(33)">Add Image</button>
<div class="upload-options" id="upload-options-33" style="display: none;">
  <button class="add-image" onclick="startCamera(33)">Camera</button>
  <label for="file-input-33" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-33" accept="image/*" multiple onchange="displayImages(this, 33)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-33"></div>
<!-- Camera Container -->
<div id="camera-container-33" style="display: none;">
  <video id="camera-33" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(33)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(33)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(33)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-33" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-34">
      <td>3.4</td>
      <td class="observation_text">Erection of Tower</td>
      <td class="requirement_text">1. Verticality test shall be conducted as per RDSO drawing specifications.<br>
      2. Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.<br>
      3. Aviation lamp shall glow during night time only.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(44)">Add Image</button>
<div class="upload-options" id="upload-options-44" style="display: none;">
  <button class="add-image" onclick="startCamera(44)">Camera</button>
  <label for="file-input-44" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-44" accept="image/*" multiple onchange="displayImages(this, 44)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-44"></div>
<!-- Camera Container -->
<div id="camera-container-44" style="display: none;">
  <video id="camera-44" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(44)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(44)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(44)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-44" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-35">
      <td>3.5</td>
      <td class="observation_text">Tower Painting.</td>
      <td class="requirement_text">One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(35)">Add Image</button>
<div class="upload-options" id="upload-options-35" style="display: none;">
  <button class="add-image" onclick="startCamera(35)">Camera</button>
  <label for="file-input-35" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-35" accept="image/*" multiple onchange="displayImages(this, 35)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-35"></div>
<!-- Camera Container -->
<div id="camera-container-35" style="display: none;">
  <video id="camera-35" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(35)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(35)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(35)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-35" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   </tr>
    <tr id="row-36">
      <td>3.6</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Tower earthing shall be done per drawing: 5 16 76 0043.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(45098)">Add Image</button>
<div class="upload-options" id="upload-options-45098" style="display: none;">
  <button class="add-image" onclick="startCamera(45098)">Camera</button>
  <label for="file-input-45098" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-45098" accept="image/*" multiple onchange="displayImages(this, 45098)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-45098"></div>
<!-- Camera Container -->
<div id="camera-container-45098" style="display: none;">
  <video id="camera-45098" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(45098)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(45098)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(45098)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-45098" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('4_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('4_0')) { saveObservation('4_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if(section==="5.0"){
      // RF Antennas section with 3 subsections
    // Clear old section content but preserve station info
    clearSectionContent();
    mainContent.innerHTML += `
      <h3 class="section-heading" id="section-heading-5_0"> Power Supply </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-5_0">
        <thead>
         <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-5_0">
          <tr id="row-411">
      <td>4.1.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">1. IPS unit shall be installed as per approved floor plan drawing.<br>
                                   2. IPS unit shall be mounted on insulators and secured to the floor by grouting.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(411)">Add Image</button>
<div class="upload-options" id="upload-options-411" style="display: none;">
  <button class="add-image" onclick="startCamera(411)">Camera</button>
  <label for="file-input-411" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-411" accept="image/*" multiple onchange="displayImages(this, 411)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-411"></div>
      <!-- Camera Container -->
<div id="camera-container-411" style="display: none;">
  <video id="camera-411" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(411)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(411)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(411)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-411" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-412">
      <td>4.1.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering the IPS unit shall pass through cable glands and ensure no cable entry shall be left open without a cable gland.</td>
      <td class="select">
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(412)">Add Image</button>
<div class="upload-options" id="upload-options-412" style="display: none;">
  <button class="add-image" onclick="startCamera(412)">Camera</button>
  <label for="file-input-412" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-412" accept="image/*" multiple onchange="displayImages(this, 412)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-412"></div>
      <!-- Camera Container -->
<div id="camera-container-412" style="display: none;">
  <video id="camera-412" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(412)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(412)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(412)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-412" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-413">
      <td>4.1.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">1. IPS unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire.<br>
                                  2. Bolts shall be tightened with appropriate torque and torque marking shall be visible.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(413)">Add Image</button>
<div class="upload-options" id="upload-options-413" style="display: none;">
  <button class="add-image" onclick="startCamera(413)">Camera</button>
  <label for="file-input-413" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-413" accept="image/*" multiple onchange="displayImages(this, 413)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-413"></div>
      <!-- Camera Container -->
<div id="camera-container-413" style="display: none;">
  <video id="camera-413" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(413)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(413)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(413)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-413" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-414">
      <td>4.1.4</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">110VDC +/-1% output shall be in the range of 108.9 V DC to 111.1 V DC.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(414)">Add Image</button>
<div class="upload-options" id="upload-options-414" style="display: none;">
  <button class="add-image" onclick="startCamera(414)">Camera</button>
  <label for="file-input-414" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-414" accept="image/*" multiple onchange="displayImages(this, 414)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-414"></div>
      <!-- Camera Container -->
<div id="camera-container-414" style="display: none;">
  <video id="camera-414" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(414)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(414)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(414)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-414" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-421">
      <td>4.2.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">1. One PDU shall be installed near IPS and a second PDU shall be installed close to Stationary Kavach unit (Ref: Power supply diagram and Load Calculations).<br>
      2. PDU units shall be mounted on insulators and secured to the wall by grouting.<br>
      3. MCB and Fuse ratings shall be verified as per load calculation (Ref: Power supply diagram and Load Calculations)</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(421)">Add Image</button>
<div class="upload-options" id="upload-options-421" style="display: none;">
  <button class="add-image" onclick="startCamera(421)">Camera</button>
  <label for="file-input-421" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-421" accept="image/*" multiple onchange="displayImages(this, 421)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-421"></div>
      <!-- Camera Container -->
<div id="camera-container-421" style="display: none;">
  <video id="camera-421" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(421)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(421)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(421)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-421" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-422">
      <td>4.2.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">1. All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.<br>
      2. Output connections shall be maintained as per the Station PDU schematic (Ref drawing: 5 16 49 0671)</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(422)">Add Image</button>
<div class="upload-options" id="upload-options-422" style="display: none;">
  <button class="add-image" onclick="startCamera(422)">Camera</button>
  <label for="file-input-422" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-422" accept="image/*" multiple onchange="displayImages(this, 422)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-422"></div>
      <!-- Camera Container -->
<div id="camera-container-422" style="display: none;">
  <video id="camera-422" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(422)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(422)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(422)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-422" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-423">
      <td>4.2.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">1. PDU units shall be connected to the ring-earth conductor by using a 10 sq.mm green/yellow earthing wire.<br>
                                   2. Bolts shall be tightened with appropriate torque, and torque marking shall be visible.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(423)">Add Image</button>
<div class="upload-options" id="upload-options-423" style="display: none;">
  <button class="add-image" onclick="startCamera(423)">Camera</button>
  <label for="file-input-423" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-423" accept="image/*" multiple onchange="displayImages(this, 423)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-423"></div>
      <!-- Camera Container -->
<div id="camera-container-423" style="display: none;">
  <video id="camera-423" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(423)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(423)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(423)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-423" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-424">
      <td>4.2.4</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">Functional testing shall be performed as per the PDU test procedure 5 xx xx xxxx.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(424)">Add Image</button>
<div class="upload-options" id="upload-options-424" style="display: none;">
  <button class="add-image" onclick="startCamera(424)">Camera</button>
  <label for="file-input-424" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-424" accept="image/*" multiple onchange="displayImages(this, 424)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-424"></div>
      <!-- Camera Container -->
<div id="camera-container-424" style="display: none;">
  <video id="camera-424" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(424)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(424)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(424)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-424" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-431">
      <td>4.3.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">1. DC-DC converter Unit shall be installed as per approved floor plan drawing.<br>
2. Unit shall be mounted on insulators and secured to the floor by grouting.<br>
3. Segregation of input & output cabling to easy identify.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(431)">Add Image</button>
<div class="upload-options" id="upload-options-431" style="display: none;">
  <button class="add-image" onclick="startCamera(431)">Camera</button>
  <label for="file-input-431" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-431" accept="image/*" multiple onchange="displayImages(this, 431)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-431"></div>
      <!-- Camera Container -->
<div id="camera-container-431" style="display: none;">
  <video id="camera-431" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(431)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(431)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(431)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-431" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-432">
      <td>4.3.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables entering the unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(432)">Add Image</button>
<div class="upload-options" id="upload-options-432" style="display: none;">
  <button class="add-image" onclick="startCamera(432)">Camera</button>
  <label for="file-input-432" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-432" accept="image/*" multiple onchange="displayImages(this, 432)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-432"></div>
      <!-- Camera Container -->
<div id="camera-container-432" style="display: none;">
  <video id="camera-432" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(432)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(432)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(432)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-432" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-433">
      <td>4.3.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire and bolts shall be tightened with appropriate torque marking.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(433)">Add Image</button>
<div class="upload-options" id="upload-options-433" style="display: none;">
  <button class="add-image" onclick="startCamera(433)">Camera</button>
  <label for="file-input-433" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-433" accept="image/*" multiple onchange="displayImages(this, 433)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-433"></div>
      <!-- Camera Container -->
<div id="camera-container-433" style="display: none;">
  <video id="camera-433" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(433)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(433)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(433)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-433" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-434">
      <td>4.3.4</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">DC-DC converter output voltage shall be minimum 24 V DC, +/-1% VDC
Input voltage range shall be verified 110V</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(434)">Add Image</button>
<div class="upload-options" id="upload-options-434" style="display: none;">
  <button class="add-image" onclick="startCamera(434)">Camera</button>
  <label for="file-input-434" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-434" accept="image/*" multiple onchange="displayImages(this, 434)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-434"></div>
      <!-- Camera Container -->
<div id="camera-container-434" style="display: none;">
  <video id="camera-434" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(434)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(434)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(434)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-434" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('5_0', activeSubsection)">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('5_0')) { saveObservation('5_0', activeSubsection); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

    // Immediately filter rows if subsection is specified
    if (subsection) {
      console.log(`Section 5.0 rendered, applying filter for subsection: ${subsection}`);
      setTimeout(() => {
        filterTableRows('observations-section-5_0', subsection);
        const heading = document.getElementById('section-heading-5_0');
        if (heading) {
           if (subsection.startsWith("4.1")) heading.textContent = "4.1 IPS";
           else if (subsection.startsWith("4.2")) heading.textContent = "4.2 PDU";
           else if (subsection.startsWith("4.3")) heading.textContent = "4.3 DC-DC Converter";
        }
      }, 100);
    }
  }
  else if(section==="6.0"){
      // Installation of Kavach equipment - 4 subsections
    // Clear old section content but preserve station info
    clearSectionContent();
    mainContent.innerHTML += `
      <h3 class="section-heading" id="section-heading-6_0"> Installation of Kavach equipment </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-6_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-6_0">
          <tr id="row-511">
      <td>5.1.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Kavach Unit shall be installed as per approved Floor Plan diagram and mounted on insulators, secured by grouting.
No unused cable entries left open.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(511)">Add Image</button>
<div class="upload-options" id="upload-options-511" style="display: none;">
  <button class="add-image" onclick="startCamera(511)">Camera</button>
  <label for="file-input-511" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-511" accept="image/*" multiple onchange="displayImages(this, 511)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-511"></div>
      <!-- Camera Container -->
<div id="camera-container-511" style="display: none;">
  <video id="camera-511" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(511)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(511)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(511)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-511" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-512">
      <td>5.1.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">All external cables shall enter through cable glands only.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(512)">Add Image</button>
<div class="upload-options" id="upload-options-512" style="display: none;">
  <button class="add-image" onclick="startCamera(512)">Camera</button>
  <label for="file-input-512" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-512" accept="image/*" multiple onchange="displayImages(this, 512)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-512"></div>
      <!-- Camera Container -->
<div id="camera-container-512" style="display: none;">
  <video id="camera-512" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(512)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(512)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(512)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-512" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-513">
      <td>5.1.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Unit shall be connected to the ring earth using a 10 sq.mm green/yellow wire proper torque marking.
Cabinet doors (front & rear) earthed using copper braid</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(513)">Add Image</button>
<div class="upload-options" id="upload-options-513" style="display: none;">
  <button class="add-image" onclick="startCamera(513)">Camera</button>
  <label for="file-input-513" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-513" accept="image/*" multiple onchange="displayImages(this, 513)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-513"></div>
      <!-- Camera Container -->
<div id="camera-container-513" style="display: none;">
  <video id="camera-513" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(513)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(513)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(513)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-513" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-514">
      <td>5.1.4</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">1. This termination unit shall be wall-mounted near Kavach Unit with insulators.<br>
      2. Power and OFC cables for SMOCIP and RTU shall be terminated as per drawing 5 16 76 0045. OFC splicing as per 5 16 49 0559</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(514)">Add Image</button>
<div class="upload-options" id="upload-options-514" style="display: none;">
  <button class="add-image" onclick="startCamera(514)">Camera</button>
  <label for="file-input-514" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-514" accept="image/*" multiple onchange="displayImages(this, 514)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-514"></div>
      <!-- Camera Container -->
<div id="camera-container-514" style="display: none;">
  <video id="camera-514" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(514)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(514)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(514)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-514" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-521">
      <td>5.2.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">SMOCIP shall be installed in Station Master’s room only and mounted at ergonomic height and easily accessible to SM. 
Panel shall be securely fixed and ensure no vibration or loose mounting (Ref: 5 16 76 0049).</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(521)">Add Image</button>
<div class="upload-options" id="upload-options-521" style="display: none;">
  <button class="add-image" onclick="startCamera(521)">Camera</button>
  <label for="file-input-521" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-521" accept="image/*" multiple onchange="displayImages(this, 521)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-521"></div>
      <!-- Camera Container -->
<div id="camera-container-521" style="display: none;">
  <video id="camera-521" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(521)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(521)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(521)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-521" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-522">
      <td>5.2.2</td>
      <td class="observation_text">Termination Unit</td>
      <td class="requirement_text">Wall-mounted near SMOCIP. Power and OFC cables from Kavach termination unit shall be terminated as per drawings. (Installation Ref drawing:5 16 76 0046)
(OFC Splicing Ref drawing:
5 16 49 0559)</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(522)">Add Image</button>
<div class="upload-options" id="upload-options-522" style="display: none;">
  <button class="add-image" onclick="startCamera(522)">Camera</button>
  <label for="file-input-522" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-522" accept="image/*" multiple onchange="displayImages(this, 522)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-522"></div>
      <!-- Camera Container -->
<div id="camera-container-522" style="display: none;">
  <video id="camera-522" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(522)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(522)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(522)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-522" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-523">
      <td>5.2.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">SMOCIP shall be Connected to earth using a 10 sq.mm green/yellow wire with torque marking.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(523)">Add Image</button>
<div class="upload-options" id="upload-options-523" style="display: none;">
  <button class="add-image" onclick="startCamera(523)">Camera</button>
  <label for="file-input-523" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-523" accept="image/*" multiple onchange="displayImages(this, 523)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-523"></div>
      <!-- Camera Container -->
<div id="camera-container-523" style="display: none;">
  <video id="camera-523" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(523)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(523)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(523)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-523" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-524">
      <td>5.2.4</td>
      <td class="observation_text">Functionality</td>
      <td class="requirement_text">Check the mechanical Counter increments correctly and push buttons function correctly.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(524)">Add Image</button>
<div class="upload-options" id="upload-options-524" style="display: none;">
  <button class="add-image" onclick="startCamera(524)">Camera</button>
  <label for="file-input-524" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-524" accept="image/*" multiple onchange="displayImages(this, 524)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-524"></div>
      <!-- Camera Container -->
<div id="camera-container-524" style="display: none;">
  <video id="camera-524" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(524)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(524)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(524)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-524" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-525">
      <td>5.2.5</td>
      <td class="observation_text">Checksum</td>
      <td class="requirement_text">Verify the checksums as per the FAT certificate.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(525)">Add Image</button>
<div class="upload-options" id="upload-options-525" style="display: none;">
  <button class="add-image" onclick="startCamera(525)">Camera</button>
  <label for="file-input-525" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-525" accept="image/*" multiple onchange="displayImages(this, 525)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-525"></div>
      <!-- Camera Container -->
<div id="camera-container-525" style="display: none;">
  <video id="camera-525" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(525)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(525)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(525)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-525" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-531">
      <td>5.3.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">1. Two antennas shall be installed 5 m apart on the Kavach Room roof-top and grouted firmly (Ref:  5 16 67 0039).<br>
2. No obstruction above antennas like tree branches, sun-shades etc.<br>
3. No water accumulation around antennas or cable conduits.<br>
4. Weather-proofing at connectors</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(531)">Add Image</button>
<div class="upload-options" id="upload-options-531" style="display: none;">
  <button class="add-image" onclick="startCamera(531)">Camera</button>
  <label for="file-input-531" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-531" accept="image/*" multiple onchange="displayImages(this, 531)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-531"></div>
      <!-- Camera Container -->
<div id="camera-container-531" style="display: none;">
  <video id="camera-531" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(531)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(531)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(531)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-531" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-532">
      <td>5.3.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">1. Antenna cables shall be routed via diverse paths.<br>
2. Separate conduits shall be used.<br>
3. Roof conduits shall be sealed against dust, water, and insects.<br>
4. In each antenna, the GSM and GPS cables shall be connected to their respective connectors as per the labels provided on the antenna.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(532)">Add Image</button>
<div class="upload-options" id="upload-options-532" style="display: none;">
  <button class="add-image" onclick="startCamera(532)">Camera</button>
  <label for="file-input-532" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-532" accept="image/*" multiple onchange="displayImages(this, 532)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-532"></div>
      <!-- Camera Container -->
<div id="camera-container-532" style="display: none;">
  <video id="camera-532" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(532)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(532)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(532)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-532" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-541">
      <td>5.4.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">RIU shall be installed as per approved drawing and secured with insulators.
Default & standby OFC paths verified.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(541)">Add Image</button>
<div class="upload-options" id="upload-options-541" style="display: none;">
  <button class="add-image" onclick="startCamera(541)">Camera</button>
  <label for="file-input-541" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-541" accept="image/*" multiple onchange="displayImages(this, 541)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-541"></div>
      <!-- Camera Container -->
<div id="camera-container-541" style="display: none;">
  <video id="camera-541" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(541)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(541)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(541)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-541" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-542">
      <td>5.4.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">1. All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.<br>
2. OFC patch cords shall be properly tagged to identify default and standby links.</td>
       <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(542)">Add Image</button>
<div class="upload-options" id="upload-options-542" style="display: none;">
  <button class="add-image" onclick="startCamera(542)">Camera</button>
  <label for="file-input-542" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-542" accept="image/*" multiple onchange="displayImages(this, 542)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-542"></div>
      <!-- Camera Container -->
<div id="camera-container-542" style="display: none;">
  <video id="camera-542" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(542)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(542)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(542)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-542" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-543">
      <td>5.4.3</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">1. RIU unit shall be Connected to ring earth using 10 sq.mm green/yellow wire.<br>
2. Bolts shall be tightened with appropriate torque, and torque marking shall be visible.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(543)">Add Image</button>
<div class="upload-options" id="upload-options-543" style="display: none;">
  <button class="add-image" onclick="startCamera(543)">Camera</button>
  <label for="file-input-543" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-543" accept="image/*" multiple onchange="displayImages(this, 543)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-543"></div>
      <!-- Camera Container -->
<div id="camera-container-543" style="display: none;">
  <video id="camera-543" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(543)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(543)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(543)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-543" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-544">
      <td>5.4.4</td>
      <td class="observation_text">FDMS Box installation</td>
      <td class="requirement_text">FDMS Box shall be installed on wall with insulators and OFC cables terminated as per network drawing.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(544)">Add Image</button>
<div class="upload-options" id="upload-options-544" style="display: none;">
  <button class="add-image" onclick="startCamera(544)">Camera</button>
  <label for="file-input-544" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-544" accept="image/*" multiple onchange="displayImages(this, 544)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-544"></div>
      <!-- Camera Container -->
<div id="camera-container-544" style="display: none;">
  <video id="camera-544" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(544)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(544)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(544)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-544" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('6_0', activeSubsection)">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('6_0')) { saveObservation('6_0', activeSubsection); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

    // Immediately filter rows if subsection is specified
    if (subsection) {
      console.log(`Section 6.0 rendered, applying filter for subsection: ${subsection}`);
      setTimeout(() => {
        filterTableRows('observations-section-6_0', subsection);
        const heading = document.getElementById('section-heading-6_0');
        if (heading) {
           if (subsection.startsWith("5.1")) heading.textContent = "5.1 Kavach Unit";
           else if (subsection.startsWith("5.2")) heading.textContent = "5.2 SMOCIP";
           else if (subsection.startsWith("5.3")) heading.textContent = "5.3 GPS/GSM Antennas";
           else if (subsection.startsWith("5.4")) heading.textContent = "5.4 RIU";
        }
      }, 100);
    }
  }
    else if (section === "7.0") {
    // Networking Rack - 2 subsections
    // Clear old section content but preserve station info
    clearSectionContent();
    mainContent.innerHTML += `
      <h3 class="section-heading" id="section-heading-7_0"> RTU </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-7_0">
        <thead>
         <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-7_0">
          <tr id="row-611">
      <td>6.1.1</td>
      <td class="observation_text">RTU fixing</td>
      <td class="requirement_text">Both RTUs shall be firmly secured to the tower platform using bolts as per diagram.
Ensure RTU doors shall be fully closed and locked.</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(611)">Add Image</button>
<div class="upload-options" id="upload-options-611" style="display: none;">
  <button class="add-image" onclick="startCamera(611)">Camera</button>
  <label for="file-input-611" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-611" accept="image/*" multiple onchange="displayImages(this, 611)">
</div>
      <!-- Container for multiple images -->
      <div id="image-container-611"></div>
      <!-- Camera Container -->
<div id="camera-container-611" style="display: none;">
  <video id="camera-611" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(611)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(611)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(611)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-611" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-612">
      <td>6.1.2</td>
      <td class="observation_text">RTU earthing</td>
      <td class="requirement_text">1. RTU shall be properly earthed by connecting a 35 sq.mm green/yellow earthing conductor from the RTU earthing bolt to the designated earth pit. 
(Ref. Drawing: 521760043)<br>
2. The earthing conductor shall be routed inside a GI pipe and firmly secured to the tower structure by welding.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(612)">Add Image</button>
<div class="upload-options" id="upload-options-612" style="display: none;">
  <button class="add-image" onclick="startCamera(612)">Camera</button>
  <label for="file-input-612" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-612" accept="image/*" multiple onchange="displayImages(this, 612)">
</div>
<!-- Container for multiple images -->
<div id="image-container-612"></div>
<!-- Camera Container -->
<div id="camera-container-612" style="display: none;">
  <video id="camera-612" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(612)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(612)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(612)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-612" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-613">
      <td>6.1.3</td>
      <td class="observation_text">OFC cable termination</td>
      <td class="requirement_text">OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU. 
(Ref. Drawing: 5 16 49 0559)</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(613)">Add Image</button>
<div class="upload-options" id="upload-options-613" style="display: none;">
  <button class="add-image" onclick="startCamera(613)">Camera</button>
  <label for="file-input-613" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-613" accept="image/*" multiple onchange="displayImages(this, 613)">
</div>
<!-- Container for multiple images -->
<div id="image-container-613"></div>
<!-- Camera Container -->
<div id="camera-container-613" style="display: none;">
  <video id="camera-613" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(613)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(613)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(613)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-613" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-614">
      <td>6.1.4</td>
      <td class="observation_text">110V Power cable termination</td>
      <td class="requirement_text">1. Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.<br>
      2. 110 V DC power cables shall be terminated inside RTU as per approved drawing.<br>
      3. Inter-connection cable between RTUs shall be installed and terminated as per approved drawing.<br>
      4. Check the 110V DC +/-
      </td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(614)">Add Image</button>
<div class="upload-options" id="upload-options-614" style="display: none;">
  <button class="add-image" onclick="startCamera(614)">Camera</button>
  <label for="file-input-614" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-614" accept="image/*" multiple onchange="displayImages(this, 614)">
</div>
<!-- Container for multiple images -->
<div id="image-container-614"></div>
<!-- Camera Container -->
<div id="camera-container-614" style="display: none;">
  <video id="camera-614" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(614)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(614)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(614)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-614" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    
     <tr id="row-615">
      <td>6.1.5</td>
      <td class="observation_text">Cabiling</td>
      <td class="requirement_text">LMR 600 connection with proper routing and clamping shall be done per Tower SOP 5 xx xx xxxx</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(615)">Add Image</button>
<div class="upload-options" id="upload-options-615" style="display: none;">
  <button class="add-image" onclick="startCamera(615)">Camera</button>
  <label for="file-input-615" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-615" accept="image/*" multiple onchange="displayImages(this, 615)">
</div>
<!-- Container for multiple images -->
<div id="image-container-615"></div>
<!-- Camera Container -->
<div id="camera-container-615" style="display: none;">
  <video id="camera-615" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(615)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(615)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(615)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-615" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-621">
      <td>6.2.1</td>
      <td class="observation_text">RF antenna installation and Audit</td>
      <td class="requirement_text">1. RF antenna installation audit report from the installation contractor shall be available in WFMS.<br>
2. There shall be no open points in the audit report</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(621)">Add Image</button>
<div class="upload-options" id="upload-options-621" style="display: none;">
  <button class="add-image" onclick="startCamera(621)">Camera</button>
  <label for="file-input-621" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-621" accept="image/*" multiple onchange="displayImages(this, 614)">
</div>
<!-- Container for multiple images -->
<div id="image-container-621"></div>
<!-- Camera Container -->
<div id="camera-container-621" style="display: none;">
  <video id="camera-621" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(621)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(621)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(621)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-621" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button"
              id="update-btn"
              style="background-color: blue; color: white; display: none;"
              onclick="updateObservation('7_0', activeSubsection)">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('7_0')) { saveObservation('7_0', activeSubsection); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`

    // Immediately filter rows if subsection is specified
    if (subsection) {
      console.log(`Section 7.0 rendered, applying filter for subsection: ${subsection}`);
      setTimeout(() => {
        filterTableRows('observations-section-7_0', subsection);
        const heading = document.getElementById('section-heading-7_0');
        if (heading) {
           if (subsection.startsWith("6.1")) heading.textContent = "6.1 RTU";
           else if (subsection.startsWith("6.2")) heading.textContent = "6.2 RF Antenna Installation";
        }
      }, 100);
    }
  }else if (section === "8.0") {
    // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > IPS </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-8_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-8_0">
          <tr id="row-71">
      <td>7.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">1. Network rack shall be installed as per approved floor plan drawing and ensure rack doors shall be fully closed and locked.<br>
2. Patch cord routing shall be neat & bend radius to be maintained.<br>
3. Network diagram shall be pasted inside the rack</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(71)">Add Image</button>
<div class="upload-options" id="upload-options-71" style="display: none;">
  <button class="add-image" onclick="startCamera(71)">Camera</button>
  <label for="file-input-71" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-71" accept="image/*" multiple onchange="displayImages(this, 71)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-71"></div>
      <!-- Camera Container -->
<div id="camera-container-71" style="display: none;">
  <video id="camera-71" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(71)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(71)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(71)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-71" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-72">
      <td>7.2</td>
      <td class="observation_text">Cabling</td>
      <td class="requirement_text">1. All external cables entering the network rack shall pass through cable glands only.<br>
2. OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
       <td>
       <button class="add-image" onclick="showUploadOptions(813)">Add Image</button>
<div class="upload-options" id="upload-options-813" style="display: none;">
  <button class="add-image" onclick="startCamera(813)">Camera</button>
  <label for="file-input-813" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-813" accept="image/*" multiple onchange="displayImages(this, 813)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-813"></div>
<!-- Camera Container -->
<div id="camera-container-813" style="display: none;">
  <video id="camera-813" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(813)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(813)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(813)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-813" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-73">
      <td>7.3</td>
      <td class="observation_text">Earthing</td>
       <td class="requirement_text">1. All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.<br>
2. Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.<br>
3. Bolts shall be tightened with appropriate torque and torque marking shall be visible.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(73)">Add Image</button>
<div class="upload-options" id="upload-options-73" style="display: none;">
  <button class="add-image" onclick="startCamera(73)">Camera</button>
  <label for="file-input-73" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-73" accept="image/*" multiple onchange="displayImages(this, 73)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-73"></div>
<!-- Camera Container -->
<div id="camera-container-73" style="display: none;">
  <video id="camera-73" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(73)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(73)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(73)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-73" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-74">
      <td>7.4</td>
      <td class="observation_text">FDMS Box Installation in Network Rack</td>
      <td class="requirement_text">1. OFC cables shall be terminated in the FDMS box as per network drawing.<br>
2. All OFC connections shall be properly tightened.<br>
3. FDMS boxes shall be clearly marked to identify default and standby links.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(74)">Add Image</button>
<div class="upload-options" id="upload-options-74" style="display: none;">
  <button class="add-image" onclick="startCamera(74)">Camera</button>
  <label for="file-input-74" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-74" accept="image/*" multiple onchange="displayImages(this, 814)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-74"></div>
<!-- Camera Container -->
<div id="camera-container-74" style="display: none;">
  <video id="camera-74" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(74)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(74)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(74)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-74" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-75">
      <td>7.5</td>
      <td class="observation_text">OFC cable continuity check, after splicing</td>
      <td class="requirement_text">OTDR test reports shall be available.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(814)">Add Image</button>
<div class="upload-options" id="upload-options-814" style="display: none;">
  <button class="add-image" onclick="startCamera(814)">Camera</button>
  <label for="file-input-814" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-814" accept="image/*" multiple onchange="displayImages(this, 814)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-814"></div>
<!-- Camera Container -->
<div id="camera-container-814" style="display: none;">
  <video id="camera-814" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(814)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(814)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(814)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-814" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('8_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('8_0')) { saveObservation('8_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  } else if (section === "9.0") {
 mainContent.innerHTML += `
      <h3 class="section-heading" > DC-DC Convertors </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-9_0">
        <thead>
         <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-9_0">
          <tr id="row-81">
      <td>8.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">1. Relay rack shall be installed as per approved Floor Plan drawing.<br>
2. Relay rack shall be mounted on insulators and secured to the floor by grouting.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(81)">Add Image</button>
<div class="upload-options" id="upload-options-81" style="display: none;">
  <button class="add-image" onclick="startCamera(81)">Camera</button>
  <label for="file-input-81" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-81" accept="image/*" multiple onchange="displayImages(this, 81)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-81"></div>
      <!-- Camera Container -->
<div id="camera-container-81" style="display: none;">
  <video id="camera-81" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(81)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(81)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(81)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-81" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
 <tr id="row-82">
      <td>8.2</td>
      <td class="observation_text">Wiring</td>
      <td class="requirement_text">1. Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & contact type.<br>
2. Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.<br>
3. Inputs shall be connected from the top and outputs from the bottom.<br>
4. Direction of wiring shall be maintained consistently from top to bottom.<br>
5. Black wires shall be used for negative supply.<br>
6. For EI Stations, verify all connections as per the approved EI Interface Diagrams.<br>
7. WAGO terminal details shall be as per interface circuit diagram.
(Ref. Drawing : 521490685)</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(912)">Add Image</button>
<div class="upload-options" id="upload-options-912" style="display: none;">
  <button class="add-image" onclick="startCamera(912)">Camera</button>
  <label for="file-input-912" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-912" accept="image/*" multiple onchange="displayImages(this, 912)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-912"></div>
<!-- Camera Container -->
<div id="camera-container-912" style="display: none;">
  <video id="camera-912" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(912)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(912)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(912)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-912" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>

    <tr id="row-83">
      <td>8.3</td>
      <td class="observation_text">Continuity Test / Bell Test</td>
      <td class="requirement_text">Completed Station Analyser and Bell Test reports shall be available.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(83)">Add Image</button>
<div class="upload-options" id="upload-options-83" style="display: none;">
  <button class="add-image" onclick="startCamera(45362)">Camera</button>
  <label for="file-input-83" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-83" accept="image/*" multiple onchange="displayImages(this, 83)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-83"></div>
<!-- Camera Container -->
<div id="camera-container-83" style="display: none;">
  <video id="camera-83" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(83)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(83)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(83)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-83" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-84">
      <td>8.4</td>
      <td class="observation_text">Earthing</td>
      <td class="requirement_text">Relay rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire with torque marking</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
      <td>
       <button class="add-image" onclick="showUploadOptions(914)">Add Image</button>
<div class="upload-options" id="upload-options-914" style="display: none;">
  <button class="add-image" onclick="startCamera(914)">Camera</button>
  <label for="file-input-914" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-914" accept="image/*" multiple onchange="displayImages(this, 914)">
</div>
<!-- Container for multiple images --> 
<div id="image-container-914"></div>
<!-- Camera Container -->
<div id="camera-container-914" style="display: none;">
  <video id="camera-914" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(914)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(914)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(914)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-914" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr> 
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('9_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('9_0')) { saveObservation('9_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
}
else if(section==="10.0"){
      // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > PDU </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-10_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-10_0">
          <tr id="row-91">
      <td>9.1</td>
      <td class="observation_text">Installation</td>
      <td class="requirement_text">Earth pit shall be constructed as per standard drawing</td>
       <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(91)">Add Image</button>
<div class="upload-options" id="upload-options-91" style="display: none;">
  <button class="add-image" onclick="startCamera(91)">Camera</button>
  <label for="file-input-91" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-91" accept="image/*" multiple onchange="displayImages(this, 91)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-91"></div>
      <!-- Camera Container -->
<div id="camera-container-91" style="display: none;">
  <video id="camera-91" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(91)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(91)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(91)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-91" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-92">
      <td>9.2</td>
      <td class="observation_text">Electrode Installation</td>
      <td class="requirement_text">All joints shall be mechanically and electrically sound. Exothermic welding shall be used where specified for permanent joints.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1012)">Add Image</button>
<div class="upload-options" id="upload-options-1012" style="display: none;">
  <button class="add-image" onclick="startCamera(1012)">Camera</button>
  <label for="file-input-1012" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1012" accept="image/*" multiple onchange="displayImages(this, 1012)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1012"></div>
      <!-- Camera Container -->
<div id="camera-container-1012" style="display: none;">
  <video id="camera-1012" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1012)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1012)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1012)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1012" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-93">
      <td>9.3</td>
      <td class="observation_text">Earth Resistance Measurement</td>
      <td class="requirement_text">Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be less than or equal to 1 Ohm.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(93)">Add Image</button>
<div class="upload-options" id="upload-options-93" style="display: none;">
  <button class="add-image" onclick="startCamera(93)">Camera</button>
  <label for="file-input-93" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-93" accept="image/*" multiple onchange="displayImages(this, 93)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-93"></div>
      <!-- Camera Container -->
<div id="camera-container-93" style="display: none;">
  <video id="camera-93" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(93)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(93)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(93)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-93" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-94">
      <td>9.4</td>
      <td class="observation_text">Test Reports</td>
      <td class="requirement_text">Earth resistance test reports shall be available.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1014)">Add Image</button>
<div class="upload-options" id="upload-options-1014" style="display: none;">
  <button class="add-image" onclick="startCamera(1014)">Camera</button>
  <label for="file-input-1014" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1014" accept="image/*" multiple onchange="displayImages(this, 1014)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1014"></div>
      <!-- Camera Container -->
<div id="camera-container-1014" style="display: none;">
  <video id="camera-1014" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1014)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1014)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1014)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1014" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-95">
      <td>9.5</td>
      <td class="observation_text">Labeling</td>
      <td class="requirement_text">All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(95)">Add Image</button>
<div class="upload-options" id="upload-options-95" style="display: none;">
  <button class="add-image" onclick="startCamera(95)">Camera</button>
  <label for="file-input-95" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-95" accept="image/*" multiple onchange="displayImages(this, 95)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-95"></div>
      <!-- Camera Container -->
<div id="camera-container-95" style="display: none;">
  <video id="camera-95" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(95)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(95)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(95)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-95" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('10_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('10_0')) { saveObservation('10_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if(section==="11.0"){
      // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > SMOCIP </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-11_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-11_0">
          <tr id="row-101">
      <td>10.1</td>
      <td class="observation_text">Workmanship</td>
      <td class="requirement_text">Cables shall be laid in conduits, trays, or cable truffes and properly secured. 
Segregation of power & communication cables</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(101)">Add Image</button>
<div class="upload-options" id="upload-options-101" style="display: none;">
  <button class="add-image" onclick="startCamera(101)">Camera</button>
  <label for="file-input-101" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-101" accept="image/*" multiple onchange="displayImages(this, 101)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-101"></div>
      <!-- Camera Container -->
<div id="camera-container-101" style="display: none;">
  <video id="camera-101" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(101)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(101)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(101)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-101" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-102">
      <td>10.2</td>
      <td class="observation_text">Redundant cabling</td>
      <td class="requirement_text">Cabeling shall be done as per Power Supply diagram and Load Calulation
Segregation of power & communication cables</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1102)">Add Image</button>
<div class="upload-options" id="upload-options-1102" style="display: none;">
  <button class="add-image" onclick="startCamera(1102)">Camera</button>
  <label for="file-input-1102" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1102" accept="image/*" multiple onchange="displayImages(this, 1102)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1102"></div>
      <!-- Camera Container -->
<div id="camera-container-1102" style="display: none;">
  <video id="camera-1102" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1102)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1102)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1102)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1102" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-103">
      <td>10.3</td>
      <td class="observation_text">SMOCIP</td>
      <td class="requirement_text">CAT-6 armoured cable used for communication</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1102)">Add Image</button>
<div class="upload-options" id="upload-options-1102" style="display: none;">
  <button class="add-image" onclick="startCamera(1102)">Camera</button>
  <label for="file-input-1102" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1102" accept="image/*" multiple onchange="displayImages(this, 1102)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1102"></div>
      <!-- Camera Container -->
<div id="camera-container-1102" style="display: none;">
  <video id="camera-1102" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1102)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1102)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1102)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1102" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-104">
      <td>10.4</td>
      <td class="observation_text">No Joints</td>
      <td class="requirement_text">No joints permitted except inside junction boxes or panels.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(104)">Add Image</button>
<div class="upload-options" id="upload-options-104" style="display: none;">
  <button class="add-image" onclick="startCamera(104)">Camera</button>
  <label for="file-input-104" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-104" accept="image/*" multiple onchange="displayImages(this, 104)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-104"></div>
      <!-- Camera Container -->
<div id="camera-container-104" style="display: none;">1103
  <video id="camera-104" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(104)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(104)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(104)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-104" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-105">
      <td>10.5</td>
      <td class="observation_text">Color Coding</td>
      <td class="requirement_text">Colour codes shall be followed for phase, neutral, and earth.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1104)">Add Image</button>
<div class="upload-options" id="upload-options-1104" style="display: none;">
  <button class="add-image" onclick="startCamera(1104)">Camera</button>
  <label for="file-input-1104" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1104" accept="image/*" multiple onchange="displayImages(this, 1104)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1104"></div>
      <!-- Camera Container -->
<div id="camera-container-1104" style="display: none;">1104
  <video id="camera-1104" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1104)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1104)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1104)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1104" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-106">
      <td>10.6</td>
      <td class="observation_text">Support & securing</td>
      <td class="requirement_text">Cables shall be properly fastened with adequate slack for termination.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(106)">Add Image</button>
<div class="upload-options" id="upload-options-106" style="display: none;">
  <button class="add-image" onclick="startCamera(106)">Camera</button>
  <label for="file-input-106" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-106" accept="image/*" multiple onchange="displayImages(this, 106)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-106"></div>
      <!-- Camera Container -->
<div id="camera-container-106" style="display: none;">1105
  <video id="camera-106" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(106)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(106)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(106)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-106" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
     <tr id="row-107">
      <td>10.7</td>
      <td class="observation_text">Tagging/Labeling</td>
      <td class="requirement_text">Cables shall be tagged at both ends.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1106)">Add Image</button>
<div class="upload-options" id="upload-options-1106" style="display: none;">
  <button class="add-image" onclick="startCamera(1106)">Camera</button>
  <label for="file-input-1106" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1106" accept="image/*" multiple onchange="displayImages(this, 1106)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1106"></div>
      <!-- Camera Container -->
<div id="camera-container-1106" style="display: none;">1106
  <video id="camera-1106" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1106)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1106)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1106)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1106" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-108">
      <td>10.8</td>
      <td class="observation_text">Termination & Connection</td>
      <td class="requirement_text">Proper lugs/ferrules shall be used and terminals tightened correctly.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(108)">Add Image</button>
<div class="upload-options" id="upload-options-108" style="display: none;">
  <button class="add-image" onclick="startCamera(108)">Camera</button>
  <label for="file-input-108" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-108" accept="image/*" multiple onchange="displayImages(this, 108)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-108"></div>
      <!-- Camera Container -->
<div id="camera-container-108" style="display: none;">1107
  <video id="camera-108" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(108)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(108)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(108)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-108" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
   
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('11_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('11_0')) { saveObservation('11_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if(section==="12.0"){
      // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > GPS/GSM Antenna </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-12_0">
        <thead>
          <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-12_0">
          <tr id="row-111">
      <td>11.1</td>
      <td class="observation_text">Cable route plan for OFC & Power cable (Relay Room to Tower)</td>
      <td class="requirement_text">Railway-approved outdoor signalling cable route plan shall be available, if applicable.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(111)">Add Image</button>
<div class="upload-options" id="upload-options-111" style="display: none;">
  <button class="add-image" onclick="startCamera(111)">Camera</button>
  <label for="file-input-111" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-111" accept="image/*" multiple onchange="displayImages(this, 111)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-111"></div>
      <!-- Camera Container -->
<div id="camera-container-111" style="display: none;">
  <video id="camera-111" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(111)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(111)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(111)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-111" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-112">
      <td>11.2</td>
      <td class="observation_text">Cable route markers</td>
      <td class="requirement_text">Route markers shall be installed and clearly visible.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1202)">Add Image</button>
<div class="upload-options" id="upload-options-1202" style="display: none;">
  <button class="add-image" onclick="startCamera(1202)">Camera</button>
  <label for="file-input-1202" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1202" accept="image/*" multiple onchange="displayImages(this, 1202)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1202"></div>
      <!-- Camera Container -->
<div id="camera-container-1202" style="display: none;">
  <video id="camera-1202" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1202)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1202)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1202)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1202" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-113">
      <td>11.3</td>
      <td class="observation_text">Cable route markers</td>
      <td class="requirement_text">Where contractually required, underground RFID markers shall be installed and verified.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(113)">Add Image</button>
<div class="upload-options" id="upload-options-113" style="display: none;">
  <button class="add-image" onclick="startCamera(113)">Camera</button>
  <label for="file-input-113" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-113" accept="image/*" multiple onchange="displayImages(this, 113)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-113"></div>
      <!-- Camera Container -->
<div id="camera-container-113" style="display: none;">
  <video id="camera-113" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(113)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(113)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(113)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-113" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('12_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('12_0')) { saveObservation('12_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }
  else if(section==="13.0"){
      // For all other sections, add Save Observation button
    mainContent.innerHTML += `
      <h3 class="section-heading" > RELAY RACK INSTALLATION AND WIRING VERIFICATION </h3>
       <div  class="table-container">
      <table class="observations" id="observations-section-13_0">
        <thead>
         <tr>
            <th>S_No</th>
            <th>Aspect</th>
            <th>Requirement</th>
            <th>Observation</th>
            <th>Conclusion</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody id="observations-tbody-13_0">
          <tr id="row-121">
      <td>12.1</td>
      <td class="observation_text">Visual Inspection</td>
       <td class="requirement_text">Verify visual inspection, No gaps, No play, Tags shall be placing centre of the sleeper and Duplicate tag spacing (3–5 m)</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(121)">Add Image</button>
<div class="upload-options" id="upload-options-121" style="display: none;">
  <button class="add-image" onclick="startCamera(121)">Camera</button>
  <label for="file-input-121" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-121" accept="image/*" multiple onchange="displayImages(this, 121)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-121"></div>
      <!-- Camera Container -->
<div id="camera-container-121" style="display: none;">
  <video id="camera-121" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(121)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(121)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(121)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-121" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
      <tr id="row-122">
      <td>12.2</td>
      <td class="observation_text">RFID Tags installation</td>
       <td class="requirement_text">RFID placement verification report shall be available and confirm placement within ±5 m of design location.</td>
      <td class="select">
       <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(1302)">Add Image</button>
<div class="upload-options" id="upload-options-1302" style="display: none;">
  <button class="add-image" onclick="startCamera(1302)">Camera</button>
  <label for="file-input-1302" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-1302" accept="image/*" multiple onchange="displayImages(this, 1302)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-1302"></div>
      <!-- Camera Container -->
<div id="camera-container-1302" style="display: none;">
  <video id="camera-1302" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(1302)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(1302)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(1302)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-1302" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    <tr id="row-123">
      <td>12.3</td>
      <td class="observation_text">RFID Tag data Validation and Placement verification</td>
      <td class="requirement_text">System-generated RFID data validation report and Placement verification report shall available.</td>
      <td class="select">
      <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();">
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea><br>
      </td>
     <td>
       <button class="add-image" onclick="showUploadOptions(123)">Add Image</button>
<div class="upload-options" id="upload-options-123" style="display: none;">
  <button class="add-image" onclick="startCamera(123)">Camera</button>
  <label for="file-input-123" class="upload-label">Upload from Device</label>
  <input type="file" id="file-input-123" accept="image/*" multiple onchange="displayImages(this, 123)">
</div>
      <!-- Container for multiple images --> 
      <div id="image-container-123"></div>
      <!-- Camera Container -->
<div id="camera-container-123" style="display: none;">
  <video id="camera-123" width="100%" height="auto" autoplay></video>
  <button class="add-image" onclick="captureImage(123)">Capture Image</button>
  <button class="add-image" onclick="stopCamera(123)">Stop Camera</button>
  <button class="reverse-camera" onclick="switchCamera(123)">🔄 Switch Camera</button> <!-- Reverse Camera Icon -->
  <canvas id="canvas-123" style="display: none;"></canvas> <!-- Canvas to capture the image -->
</div>
    </tr>
    </tbody>
      </table>
      </div>
      <div class="action-buttons">
        <!-- New UPDATE button: -->
      <button type="button" 
              id="update-btn" 
              style="background-color: blue; color: white; display: none;" 
              onclick="updateObservation('13_0')">
        Update
      </button>
         <button type="button" id= "save-btn" style = "display: inline-block;" onclick="if(validateMandatoryImages('13_0')) { saveObservation('13_0'); }">Save</button>
         <button id="get-details-btn" onclick="getDetails()">Get Details</button>
      </div>
    ;`
  }

}


// Trigger file chooser, upload DB file, and convert to Excel
// Upload .db file, then call export.php to convert it to Excel
async function chooseAndUploadFile(sectionId) {
  const fileInput = document.getElementById(`supporting-file-${sectionId}`);
  const container = document.getElementById(`uploaded-file-container-${sectionId}`);

  if (!fileInput) {
    console.error("File input not found for section:", sectionId);
    return;
  }
  if (!container) {
    console.error("Uploaded file container not found for section:", sectionId);
    return;
  }

  // open file picker
  fileInput.click();

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return;

    container.innerText = "Uploading DB file...";

    const formData = new FormData();
    formData.append("dbFile", file); // send actual File object

    try {
      // STEP 1: upload the DB file
      const uploadResp = await fetch("Db File Converter/upload.php", {
        method: "POST",
        body: formData
      });
      const uploadResult = await uploadResp.text();
      container.innerText = uploadResult;

      // check success - adjust this check if your PHP returns different text
      if (uploadResp.ok && uploadResult.toLowerCase().includes("uploaded")) {
        // STEP 2: call export.php (many server scripts expect filename string;
        // if export.php expects the filename, pass the name; if it expects the file,
        // pass the file again. Most common: pass filename that was saved on the server.)
        const exportForm = new FormData();
        exportForm.append("dbFile", file.name); // or append the path your server expects

        container.innerText += "\nConverting to Excel...";
        const exportResp = await fetch("Db File Converter/export.php", {
          method: "POST",
          body: exportForm
        });
        const exportResult = await exportResp.text();
        container.innerHTML += "<br>" + exportResult;

        alert("DB converted to Excel. Now you can extract TAG_ID.");
      } else {
        throw new Error("Upload failed: " + uploadResult);
      }
    } catch (err) {
      console.error("Upload/convert error:", err);
      container.innerHTML += `<br><span style="color:red;">Error: ${err.message || err}</span>`;
      alert("Error uploading/converting file — check console/network for details.");
    }
  };
}




async function extractExcelTags(sectionId) {
  const excelUrl = "uploads/files/database.xlsx"; // relative path

  const response = await fetch(excelUrl);
  if (!response.ok) {
    alert("Excel file not found. Please export DB to Excel first.");
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });

  const tbody = document.getElementById(`observations-tbody-${sectionId}`);
  if (!tbody) {
    console.error(`❌ Table body not found: observations-tbody-${sectionId}`);
    alert(`Error: Could not find table body for section ${sectionId}`);
    return;
  }

  tbody.innerHTML = ""; // clear old rows

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length === 0) return;

    const headerRow = rows[0];
    const uidIndex = headerRow.indexOf("UID");
    if (uidIndex === -1) return;

    rows.slice(1).forEach(row => {
      const uid = row[uidIndex];
      if (uid) {
        const displayIndex = tbody.rows.length + 1;
        tbody.innerHTML += `
          <tr id="row-${displayIndex}">
            <td>${displayIndex}</td>
            <td class="observation_text">${uid}</td>
            <td class="select">
              <select onchange="highlightSelect(this)">
                <option value="Select">Select</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
            </td>
            <td class="remarks">
              <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20"></textarea>
            </td>
            <td>
              <button class="add-image" onclick="showUploadOptions(${displayIndex})">Add Image</button>
              <div class="upload-options" id="upload-options-${displayIndex}" style="display: none;">
                <button class="add-image" onclick="startCamera(${displayIndex})">Camera</button>
                <label for="file-input-${displayIndex}" class="upload-label">Upload from Device</label>
                <input type="file" id="file-input-${displayIndex}" accept="image/*" multiple onchange="displayImages(this, ${displayIndex})">
              </div>
              <div id="image-container-${displayIndex}"></div>
              <div id="camera-container-${displayIndex}" style="display: none;">
                <video id="camera-${displayIndex}" width="100%" height="auto" autoplay></video>
                <button class="add-image" onclick="captureImage(${displayIndex})">Capture Image</button>
                <button class="add-image" onclick="stopCamera(${displayIndex})">Stop Camera</button>
                <button class="reverse-camera" onclick="switchCamera(${displayIndex})">🔄 Switch Camera</button>
                <canvas id="canvas-${displayIndex}" style="display: none;"></canvas>
              </div>
            </td>
          </tr>
        `;
      }
    });
  });
}


// Function to handle the logout
function logout() {
  window.location.href = "login.html"; // Replace with your actual login page URL
}

// Event listener for dynamic shed name update

document.addEventListener("DOMContentLoaded", function () {


  function initDivisionLogic() {
    // Attempt to get the newly loaded or dynamically injected selects
    const zoneSelect = document.getElementById("zone");
    const divisionSelect = document.getElementById("division");



    // If they don't exist yet (because the form is injected later), re-check soon
    if (!divisionSelect || !zoneSelect) {

      setTimeout(initDivisionLogic, 100);
      return;
    }

    // Now that we have them, gather the <option data-zone="...">
    const allDivisionOptions = Array.from(
      divisionSelect.querySelectorAll("option[data-zone]")
    );

    // Expose a global function so inline onchange="updateDivisionNames()" works
    window.updateDivisionNames = function () {
      if (!zoneSelect || !divisionSelect) return;

      const selectedZone = zoneSelect.value;


      // Reset to a single 'Select' placeholder
      divisionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

      // Inject only those options whose data-zone matches
      allDivisionOptions.forEach(option => {
        if (option.getAttribute("data-zone") === selectedZone) {
          divisionSelect.appendChild(option.cloneNode(true));
        }
      });

      // Optionally disable if no valid division
      divisionSelect.disabled = !selectedZone;
    };

    // If a division is already selected (e.g. from session), update immediately
    window.updateDivisionNames();

  }

  function initSectionLogic() {
    // Attempt to get the newly loaded or dynamically injected selects
    const zoneSelect = document.getElementById("zone");
    const sectionSelect = document.getElementById("section-name");



    // If they don't exist yet (because the form is injected later), re-check soon
    if (!sectionSelect || !zoneSelect) {

      setTimeout(initSectionLogic, 100);
      return;
    }

    // Now that we have them, gather the <option data-zone="...">
    const allSectionOptions = Array.from(
      sectionSelect.querySelectorAll("option[data-zone]")
    );

    // Expose a global function so inline onchange="updateDivisionNames()" works
    window.updateSectionNames = function () {
      if (!zoneSelect || !sectionSelect) return;

      const selectedZone = zoneSelect.value;


      // Reset to a single 'Select' placeholder
      sectionSelect.innerHTML = '<option value="" disabled selected>Select</option>';

      // Inject only those options whose data-zone matches
      allSectionOptions.forEach(option => {
        if (option.getAttribute("data-zone") === selectedZone) {
          sectionSelect.appendChild(option.cloneNode(true));
        }
      });

      // Optionally disable if no valid division
      sectionSelect.disabled = !selectedZone;
    };

    // If a division is already selected (e.g. from session), update immediately
    window.updateSectionNames();

  }

  // Try to attach logic now; if the elements aren't there, we'll retry
  initDivisionLogic();
  initSectionLogic();
});


async function generateReport() {
  // Remove the beforeunload listener so that it won't trigger when clicking the button.
  window.removeEventListener("beforeunload", beforeUnloadHandler);
  const stationInfo=JSON.parse(sessionStorage.getItem("stationInfo")||"{}");
  const stationId = stationInfo.stationId;
  const division = stationInfo.division;
  const zone = stationInfo.zone;
  const sectionName = stationInfo.sectionName;

  if (!stationId || !division || !zone || !sectionName) {
    alert("Please fill all the fields.");
    return;
  }

  const response = await fetch("generateReport.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "station-id": stationId,
      "zone": zone,
      "division": division,
      "section-name": sectionName,
    }),
  });

  const data = await response.json();

  if (data.success) {
    // Store the fetched data in sessionStorage
    console.log("SOMETHING IS FISHYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    sessionStorage.setItem("stationDetails", JSON.stringify(data.stationDetails));
     sessionStorage.setItem(
      "observationsData",
      JSON.stringify(data.observations)
    );

    // Redirect to the observations page
    window.location.href = "observations.html";
  } else {
    alert(data.message || "Failed to generate the report");
  }

  if (data.success) {
    // Optional: Display Station Details on console
    console.log(data.stationDetails);
    console.log(data.observations);
  } else {
    alert(data.message);
  }
}


function showUploadOptions(rowId) {
  const uploadOptions = document.getElementById(`upload-options-${rowId}`);
  if (!uploadOptions) return;
  uploadOptions.style.display =
    uploadOptions.style.display === "none" ? "block" : "none";
}


// ---------------------------------------------------------------------------
// The "completeData" function
function completeData() {
  sessionStorage.removeItem("stationInfo");
  sessionStorage.removeItem("observations");
  // Observations table removed as per user request
  alert(
    "Data has been saved and cleared. You can now enter information for a new station."
  );
  document.getElementById("main-content").innerHTML = "";
}

function validateBarcode(input) {
  // Get the value from the input
  let value = input.value;

  // Remove any non-numeric characters
  value = value.replace(/\D/g, '');

  // Trim to the last 15 digits
  if (value.length > 15) {
    value = value.slice(-15);
  }

  // Update the input value with the last 15 digits
  input.value = value;
}

// ---------------------------------------------------------------------------
// Save Station Info
async function saveStationInfo(section) {
  const stationId = document.getElementById("station-id").value;
  const stationName = document.getElementById("station-name").value;
  const zone = document.getElementById("zone").value;
  const division = document.getElementById("division").value;
  const sectionName = document.getElementById("section-name").value;
  const initialDate = document.getElementById("initial-date").value;
  const updatedDate = document.getElementById("updated-date").value;

  if (
    !stationId ||
    !stationName ||
    !zone ||
    !division ||
    !sectionName ||
    !initialDate ||
    !updatedDate
  ) {
    alert("Please fill out all fields before saving.");
    return;
  }

  const stationData = {
    stationId: stationId,
    stationName: stationName,
    zone: zone,
    division: division,
    sectionName: sectionName,
    initialDate: initialDate,
    updatedDate: updatedDate,
  };

  // Save to sessionStorage
  sessionStorage.setItem("stationInfo", JSON.stringify(stationData));

  try {
    const response = await fetch("connect.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "station-id": stationId,
        "station-name": stationName,
        "zone": zone,
        "division": division,
        "section-name": sectionName,
        "initial-date": initialDate,
        "updated-date": updatedDate,
      }),
    });

    const data = await response.json();


    if (data.success) {
      showModal("Station info saved successfully!");
      // Once saved, no unsaved changes
      unsavedChanges = false;
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while saving the data.");
  }

  enableButtons();
}
document.addEventListener("click", function (event) {
  // Check if a "Get Details" button was clicked
  if (event.target.id === "get-details-btn") {
    // Remove highlight from all buttons
    document.querySelectorAll("#get-details-btn").forEach(btn => btn.classList.remove("highlight"));

    // Check if the button belongs to section "0.0" (using a data attribute)
    if (event.target.dataset.section === "0.0") {
      event.target.classList.add("highlight");
    }
  }
});


async function checkAndHighlightSections(stationId, zone, division) {
  const sections = [
    { id: '0.0', dbId: 0, btn: 'station-info-button' },
    { id: '2.0', dbId: 2, btn: 'button-2' },
    { id: '3.0', dbId: 3, btn: 'button-3' },
    { id: '4.0', dbId: 4, btn: 'button-4' },
    {
      id: '5.0', dbId: 5, btn: 'button-5',
      subsections: ['4.1', '4.2', '4.3']
    },
    {
      id: '6.0', dbId: 6, btn: 'button-6',
      subsections: ['5.1', '5.2', '5.3', '5.4']
    },
    {
      id: '7.0', dbId: 7, btn: 'button-7',
      subsections: ['6.1', '6.2']
    },
    { id: '8.0', dbId: 8, btn: 'button-8' },
    { id: '9.0', dbId: 9, btn: 'button-9' },
    { id: '10.0', dbId: 10, btn: 'button-10' },
    { id: '11.0', dbId: 11, btn: 'button-11' },
    { id: '12.0', dbId: 12, btn: 'button-12' },
    { id: '13.0', dbId: 13, btn: 'button-13' },
    { id: '14.0', dbId: 14, btn: 'button-14' },
    { id: '15.0', dbId: 15, btn: 'button-15' },
    { id: '16.0', dbId: 16, btn: 'button-16' },
    { id: '17.0', dbId: 17, btn: 'button-17' },
    { id: '18.0', dbId: 18, btn: 'button-18' }
  ];

  for (const section of sections) {
    if (section.subsections) {
      let filledCount = 0;
      for (const sub of section.subsections) {
        const subExists = await checkExistingObservations(stationId, division, zone, section.dbId, sub);
        const subBtn = document.getElementById(`button-${sub}`);
        if (subBtn) {
          subBtn.disabled = false;
          if (subExists) {
            subBtn.style.backgroundColor = "#b2ebf2"; // Light blue/green for filled
            filledCount++;
          } else {
            subBtn.style.backgroundColor = "";
          }
        }
      }

      const mainBtn = document.getElementById(section.btn);
      if (mainBtn) {
        mainBtn.disabled = false;
        if (filledCount === section.subsections.length) {
          mainBtn.style.backgroundColor = "#b2ebf2"; // Fully filled (Light blue)
        } else if (filledCount > 0) {
          mainBtn.style.backgroundColor = "#5a96adff"; // Partially filled (Light yellow)
        } else {
          mainBtn.style.backgroundColor = "";
        }
      }
    } else {
      const exists = await checkExistingObservations(stationId, division, zone, section.dbId);
      const btn = document.getElementById(section.btn);
      if (btn) {
        btn.disabled = false;
        if (exists) {
          btn.style.backgroundColor = "#b2ebf2";
        } else {
          btn.style.backgroundColor = "";
        }
      }
    }
  }
}


async function checkExistingObservations(stationId, division, zone, sectionId, subsection) {
  try {

    const requestData = { stationId, division, zone, sectionId, subsection };


    const response = await fetch("checkObservations.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();


    return data.exists;
  } catch (error) {
    console.error("❌ Error checking existing observations:", error);
    return false;
  }
}

async function saveObservation(section, subsection) {
  const stationInfo=JSON.parse(sessionStorage.getItem("stationInfo")||"{}");

  const stationId=stationInfo.stationId||"";
  const stationName=stationInfo.stationName||"";
  const zone=stationInfo.zone||"";
  const division=stationInfo.division||"";
  const sectionName=stationInfo.sectionName||"";
  const initialDate=stationInfo.initialDate||"";
  const updatedDate=stationInfo.updatedDate||"";

  const saveBtn = document.querySelector(`#save-btn`);
  if (saveBtn) saveBtn.disabled = true;

  // ✅ Validate Station info
  if (!stationId || !zone || !division) {
    alert("⚠️ Please enter Station ID, Zone, and division.");
    if (saveBtn) saveBtn.disabled = false;
    return;
  }



  const formData = new FormData();
  formData.append("station-id", stationId);
  formData.append("station-name", stationName);
  formData.append("initial-date", initialDate);
  formData.append("division", division);
  formData.append("section-name", sectionName);
  formData.append("zone", zone);
  formData.append("updated-date", updatedDate);
  formData.append("section-id", section);

  const rows = document.querySelectorAll(`#observations-section-${section} tbody tr`);
  const observations = [];

  let anyDropdownSelected = false;

  for (const row of rows) {
    // Skip the Add Row placeholder if present
    if (row.classList.contains('add-row-placeholder')) continue;
    const S_no = row.querySelector("td:first-child")?.innerText.trim() || "";

    // If subsection is specified, only collect rows that belong to that subsection
    if (subsection && !S_no.startsWith(subsection)) continue;

    const obsField = row.querySelector(".observation_text");

    if (!obsField && section !== "17_0") {
      alert(`❌ Missing description field for S.No ${S_no}`);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    let descriptionHtml = "";
    if (obsField) {
      const clone = obsField.cloneNode(true);
      clone.querySelectorAll("input").forEach(i => i.remove());
      descriptionHtml = clone.innerHTML.trim();
    } else if (section === "17_0") {
      descriptionHtml = "Tag_No:";
    }

    // Extract requirement text
    const reqField = row.querySelector(".requirement_text");
    const requirementText = reqField ? reqField.innerText.trim() : "";

    if ((!descriptionHtml || descriptionHtml.toUpperCase() === "N/A") && section !== "17_0") {
      alert(`⚠️ Description cannot be empty or "N/A" for S.No ${S_no}`);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    const barcode = row.querySelector("input[type='text']")?.value.trim() || "";
    const text = (descriptionHtml + " " + barcode).trim();
    const remarks = row.querySelector(".remarks textarea")?.value.trim() || "";
    //const status = row.querySelector("select")?.value || "";
     let status = "";



        status = row.querySelector("select")?.value || "";
        if (status && status !== "Select") {
          anyDropdownSelected = true;
        }


    if (status && status !== "Select") {
      anyDropdownSelected = true;
    }

    const rowId = row.id.replace("row-", "");
    let imagePaths = [];

    try {
      imagePaths = await uploadDeviceImages(rowId);
    } catch (e) {
      alert(`❌ Image upload failed for row ${S_no}`);
      console.error("Image upload error:", e);
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    observations.push({
      S_no,
      observation_text: text,
      requirement_text: requirementText,
      barcode_kavach_main_unit: barcode,
      remarks,
      observation_status: status,
      image_paths: imagePaths,
    });
  }

  // ✅ Check if at least one observation status is selected
  if (!anyDropdownSelected) {
    alert("⚠️ Please select at least one observation status before saving.");
    if (saveBtn) saveBtn.disabled = false;
    return;
  }

  formData.append("observations", JSON.stringify(observations));

  if (!confirm("💾 Do you want to save observations?")) {
    if (saveBtn) saveBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch(`section${section}.php`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("❌ Network error while saving observations.");

    const data = await response.json();

    if (data.success) {
      document.getElementById("messageBox").innerText = "🎉 Observations saved successfully!";
      setTimeout(() => {
        document.getElementById("messageBox").innerText = "";
      }, 2000);

      unsavedChanges = false;

      const getDetailsBtn = document.querySelector(`#get-details-btn`);
      const updateBtn = document.querySelector(`#update-btn`);

      if (saveBtn) saveBtn.style.display = 'none';
      if (getDetailsBtn) getDetailsBtn.style.display = 'none';
      if (updateBtn) {
        updateBtn.style.display = 'inline-block';
        updateBtn.disabled = false;
      }

        sessionStorage.setItem("stationInfo", JSON.stringify({
        stationId,
        stationName,
        zone,
        division,
        sectionName,
        initialDate,
        updatedDate
      }));


    } else {
      alert(data.message || "❌ Server returned failure.");
    }
  } catch (error) {
    alert("❌ Error saving observations.");
    console.error(error);
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}


// Function to populate station details
function populateStationDetails(stationDetails) {
  console.log("Station Details Response from DB:",stationDetails);
  sessionStorage.setItem("stationDetails", JSON.stringify(stationDetails));

  const normalizedStationInfo={
    stationId: stationDetails.station_id,
    stationName: stationDetails.station_name,
    zone: stationDetails.railway_zone||stationDetails.zone||"",
    division: stationDetails.division||stationDetails.railway_division||"",
    sectionName: stationDetails.section_name,
    initialDate: stationDetails.initial_date,
    updatedDate: stationDetails.updated_date
  };

  console.log("Normalized station Info to be stored:",normalizedStationInfo);

  sessionStorage.setItem("stationInfo",JSON.stringify(normalizedStationInfo));
  console.log("Stored in sessionStorage under 'stationInfo':",sessionStorage.getItem("stationInfo"));

   // Populate the form fields
  const stationIdInput = document.getElementById("station-id");
  const stationNameInput = document.getElementById("station-name");
  const zoneInput = document.getElementById("zone");
  const divisionInput = document.getElementById("division");
  const sectionNameInput=document.getElementById("section-name");
  const initialDateInput = document.getElementById("initial-date");
  const updateDateInput = document.getElementById("updated-date");

  if (stationIdInput) {
    stationIdInput.value = normalizedStationInfo.stationId || "";
    console.log("🔑 stationId set to:", stationIdInput.value);
  }

  if (stationNameInput) {
    stationNameInput.value = normalizedStationInfo.stationName || "";
    console.log("🏷️ stationName set to:", stationNameInput.value);
  }

  if (zoneInput) {
    zoneInput.value = normalizedStationInfo.zone || "";
    console.log("🌍 zone set to:", zoneInput.value);
  }

  if (divisionInput) {
    divisionInput.value = normalizedStationInfo.division || "";
    console.log("📌 division set to:", divisionInput.value);
  }

  if (sectionNameInput) {
    sectionNameInput.value = normalizedStationInfo.sectionName || "";
    console.log("📌 sectionName set to:", sectionNameInput.value);
  }

  // Dates (fallback to today if empty)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

  if (initialDateInput) {
    initialDateInput.value = normalizedStationInfo.initialDate || today;
    console.log("📅 initialDate set to:", initialDateInput.value);
  }

  if (updateDateInput) {
    // Current date should be the updated date when opening to edit
    updateDateInput.value = today;
    console.log("🕒 updatedDate set to today:", updateDateInput.value);
  }

}



// Observations table removed as per user request
// Global store of everything you've fetched
window.allObservations = [];



// Global object to store edited barcode values keyed by rowId.
window.editedBarcodes = window.editedBarcodes || {};



/**
 * Filter & render a single section's table.
 */
function updateSections(observations, sectionID, sno) {
  const sectionContainer = document.getElementById(`observations-section-${sectionID}`);
  if (!sectionContainer) {
    console.warn(`⚠️ Section container not found for sectionID: ${sectionID}`);
    return;
  }
  enableSectionButtons(sectionID);
  const filtered = observations.filter(o => o.section_id === sectionID);
  if (filtered.length) {
    updateObservationsTable(sectionID, filtered, sno);
  } else {
    console.warn(`⚠️ No observations for section ${sectionID}`);
  }
}

/**
 * Rebuilds the <tbody> for one section.
 */
// Call this on input so the updated value is saved globally.
function updateEditedBarcode(rowId, value) {
  console.log("Updating barcode for row", rowId, "to:", value);
  window.editedBarcodes[rowId] = value;
}

function updateObservationsTable(sectionID, observations, sno) {
  const tbody = document.getElementById(`observations-tbody-${sectionID}`);
  if (!tbody) {
    console.error(`Table body #observations-tbody-${sectionID} not found.`);
    return;
  }

  // Check if the table already has rows (static template or previously rendered)
  const existingRows = tbody.querySelectorAll("tr");
  if (existingRows.length > 0) {
      console.log(`Update existing rows for section ${sectionID} instead of rebuilding.`);

      // Map observations by S_no for easy lookup
      const obsMap = {};
      observations.forEach(obs => { obsMap[obs.S_no] = obs; });

      existingRows.forEach(row => {
          // Identify S_no from the first cell
          const firstCell = row.cells[0];
          if (!firstCell) return;
          const sNo = firstCell.innerText.trim().split(' ')[0]; // Handle cases like "1.1 (button)"

          // If we have saved data for this S_no, update the UI
          if (obsMap[sNo]) {
              const p = obsMap[sNo];

              // Update Dropdown
              const select = row.querySelector("select.status-dropdown");
              if (select) {
                  select.value = p.observation_status || 'Select';
                  select.setAttribute('data-initial', select.value);
                  highlightSelect(select);
              }

              // Update Remarks
              const textarea = row.querySelector("td.remarks textarea");
              if (textarea) {
                  textarea.value = p.remarks || '';
                  textarea.setAttribute('data-initial', textarea.value);
              }

              // Update Images
              // We need to find the image container. In static HTML, IDs might differ (row-411 vs rowId 4.1.1)
              // But the image container is usually inside the last cell.
              // Let's rely on the row structure or find container by ID pattern if possible.
              // Static HTML uses id="image-container-411" (numeric).
              // We can search for div[id^="image-container-"] within the row.
              const imgContainer = row.querySelector('div[id^="image-container-"]');
              if (imgContainer) {
                  // Extract the numeric/string rowId suffix from the container ID
                  const containerId = imgContainer.id;
                  const rowIdPart = containerId.replace('image-container-', '');

                  if (p.images && p.images.length > 0) {
                     imgContainer.innerHTML = p.images.map((imgPath, idx) => `
                        <div class="image-container" style="position: relative; display: inline-block;">
                            <img id="captured-image-${rowIdPart}-${idx}" src="${imgPath}" alt="Uploaded Image" width="100" style="margin:5px;" onerror="console.error('Error loading image')">
                            <span style="position:absolute; top:0; right:0; cursor:pointer; color:red; font-weight:bold;" onclick="deleteImage(event, '${sectionID}', '${sNo}', '${imgPath}')">&times;</span>
                        </div>
                     `).join("");
                  } else {
                      imgContainer.innerHTML = "";
                  }
              }

              // Handle Barcode (Section 2.0 specific)
              if (sectionID === "2_0") {
                  const bcInput = row.querySelector("input[name='barcode_kavach_main_unit']");
                  if (bcInput) {
                       // Custom edited barcode logic
                       let rowId = sNo; // Fallback
                       // Try to guess match rowId used in static HTML? usually sNo
                       if (window.editedBarcodes && window.editedBarcodes[rowId] !== undefined) {
                           p.barcode_kavach_main_unit = window.editedBarcodes[rowId];
                       }
                       bcInput.value = p.barcode_kavach_main_unit || '';
                       bcInput.setAttribute('data-initial', bcInput.value);
                  }
              }
          }
      });
      return; // Done updating, skip rebuild
  }

  // Fallback: Rebuild from scratch (Original Data-Driven Logic)
  tbody.innerHTML = "";

  // Filter observations for the current section.
  const filteredObservations = observations.filter(obs => obs.section_id === sectionID);

  // For each serial number, find an existing observation or create a default one.
  const allRows = sno.map(snoValue => {
    return filteredObservations.find(obs => obs.S_no === snoValue) || { S_no: snoValue, section_id: sectionID };
  });

  allRows.forEach((observation) => {
    const S_no = observation.S_no;
    let rowId = observation.rowId || S_no;

    // Only for section "2_0", override the barcode with any edited value.
    if (sectionID === "2_0" && S_no !== "2.1" && window.editedBarcodes && window.editedBarcodes[rowId] !== undefined) {
      console.log(`Row ${rowId} using edited barcode: ${window.editedBarcodes[rowId]}`);
      observation.barcode_kavach_main_unit = window.editedBarcodes[rowId];
    }

    const dropdownOptions = getDropdownOptions(S_no, observation.observation_status, sectionID);

    let imageHTML = "";
    if (observation.images && observation.images.length > 0) {
      imageHTML = observation.images
        .map((imgPath, idx) => `
          <div class="image-container" style="position: relative; display: inline-block;">
            <img
              id="captured-image-${rowId}-${idx}"
              src="${imgPath}"
              alt="Uploaded Image"
              width="100"
              style="margin:5px;"
              onerror="console.error('Error loading image:', this.src')">
            <span style="position:absolute; top:0; right:0; cursor:pointer; color:red; font-weight:bold;" onclick="deleteImage(event, '${sectionID}', '${S_no}', '${imgPath}')">&times;</span>
          </div>
        `).join("");
    }

    const imageUploadBlock = `
      <div class="image-container" id="image-container-${rowId}">
        ${imageHTML}
      </div>
      <button type="button" class="add-image" onclick="showUploadOptions('${rowId}')">
        Add/Update Image
      </button>
      <div class="upload-options" id="upload-options-${rowId}" style="display: none;">
        <button class="add-image" onclick="startCamera('${rowId}')">Camera</button>
        <label for="file-input-${rowId}" class="upload-label">Upload from Device</label>
        <input
          type="file"
          id="file-input-${rowId}"
          name="images[]"
          accept="image/*"
          multiple
          style="display:none;"
          onchange="displayImages(this, '${rowId}')">
      </div>
      <div id="camera-container-${rowId}" style="display: none;">
        <video id="camera-${rowId}" width="100%" height="auto" autoplay></video>
        <button class="add-image" onclick="captureImage('${rowId}')">Capture Image</button>
        <button class="add-image" onclick="stopCamera('${rowId}')">Stop Camera</button>
        <button class="reverse-camera" onclick="switchCamera('${rowId}')">🔄 Switch Camera</button>
        <canvas id="canvas-${rowId}" style="display: none;"></canvas>
      </div>
    `;

    // For the observation text cell, include the barcode input field only for section "2_0"
    let observationContent = observation.observation_text || "N/A";
    if (sectionID === "2_0" && S_no !== "2.1") {
      observationContent += `<br>
        <input
          type="text"
          id="barcode-input-${rowId}"
          name="barcode_kavach_main_unit"
          pattern="^\\d{10,15}$"
          title="Enter a number between 10 to 15 digits"
          placeholder="Scan Barcode"
          style="width: 180px; padding: 5px; font-size: 14px;"
          value="${observation.barcode_kavach_main_unit || ''}"
oninput="
  // Keep only digits
  let cleaned = this.value.replace(/\D/g, '');
  if (cleaned.length > 15) cleaned = cleaned.slice(-15);
  this.value = cleaned;

  // Only update if barcode is between 10 and 15 digits
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    updateEditedBarcode('${rowId}', cleaned);
  } else {
    delete window.editedBarcodes['${rowId}'];
  }

  toggleNotInstalledOption(this);
  markDataAsUnsaved();
"
/>`;
    }

    const row = document.createElement("tr");
    row.setAttribute("data-sno", S_no);
    row.setAttribute("id", `row-${rowId}`);

    // Detect if this section has a "Requirement" column (usually 6 columns total)
    // Section 2.0 has 5 columns (no Requirement).
    const hasRequirement = (sectionID !== "2_0");

    // Logic to determine if it is a custom row (Section 2.0 and s_no > 1.25)
    let isCustomRow = false;
    if (sectionID === "2_0") {
        const parts = S_no.split('.');
        if (parts.length === 2) {
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num > 25) {
                isCustomRow = true;
            }
        }
    }

    // Prepare S_No cell content
    let sNoContent = S_no;
    if (isCustomRow) {
        sNoContent += ` <button type="button" onclick="deleteRowTemplate(this, '${S_no}', '${sectionID}')" style="background: none; border: none; cursor: pointer; font-size: 14px;" title="Delete Row">🗑️</button>`;
    }

    row.innerHTML = `
      <td>${sNoContent}</td>
      <td class="observation_text">${observationContent}</td>
      ${hasRequirement ? `<td class="requirement_text">${observation.requirement_text || "N/A"}</td>` : ""}
      <td>
        <select name="status-dropdown" class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
          ${dropdownOptions}
        </select>
      </td>
      <td class="remarks">
        <textarea rows="2" cols="20" oninput="console.log('Textarea input'); enableUpdateButton(); markDataAsUnsaved();">${observation.remarks || ""}</textarea>
      </td>
      <td>${imageUploadBlock}</td>
    `;
        // ❌ Skip appending the row if description is empty or "N/A"
    if (!observationContent || observationContent.trim() === "N/A") {
      console.warn(`❌ Skipping row ${S_no} due to invalid description`);
      return;
    }


    tbody.appendChild(row);

    // Initialize values and 'data-initial' tracking immediately
    const statusDropdown = row.querySelector(".status-dropdown");
    if (statusDropdown) {
      let valueToSet = observation.observation_status?.trim() || "Select";
      statusDropdown.value = valueToSet;
      statusDropdown.setAttribute('data-initial', valueToSet);
      highlightSelect(statusDropdown);
    }
    const remarksArea = row.querySelector(".remarks textarea");
    if (remarksArea) {
      const initialRemark = observation.remarks || "";
      remarksArea.value = initialRemark;
      remarksArea.setAttribute('data-initial', initialRemark);
    }
    const bcInput = row.querySelector("input[name='barcode_kavach_main_unit']");
    if (bcInput) {
      const initialBC = observation.barcode_kavach_main_unit || "";
      bcInput.value = initialBC;
      bcInput.setAttribute('data-initial', initialBC);
    }
  });
}

function deleteImage(event, sectionID, s_no, imgPath) {
  event.preventDefault();
  event.stopPropagation();

  if (!confirm("Are you sure you want to delete this image?")) return;

  const stationId = document.getElementById("station-id").value;
  const relativePath = imgPath.replace(/^.*\/uploads\//, 'uploads/');

  fetch('deleteImage.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ station_id: stationId, s_no, imgPath: relativePath })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Image deleted successfully.");
      markDataAsUnsaved();

      // Remove the image element from DOM directly
      const imgContainer = event.target.closest('.image-container');
      if (imgContainer) {
        imgContainer.remove();
      }

      // Also update the observation object to remove this image
      const obs = observations.find(o => o.S_no === s_no && o.section_id === sectionID);
      if (obs && obs.images) {
        obs.images = obs.images.filter(path => path !== imgPath);
      }

    } else {
      alert("Failed to delete image: " + data.message);
    }
  })
  .catch(error => console.error('Error deleting image:', error));
}







// Function to update only the description part (if needed)
function updateObservationText(rowId, barcodeValue) {
  // Look for a span with class "description" within the observation cell.
  const descriptionSpan = document.querySelector(`#row-${rowId} td.observation_text .description`);
  if (descriptionSpan) {
    // For example, if you want to update the description to reflect the barcode:
    // (Adjust the logic as needed—you might simply leave the description unchanged.)
    descriptionSpan.textContent = `Updated Barcode: ${barcodeValue}`;
  }
}

// Function to handle barcode scanning
function handleBarcodeScan(rowId, barcodeValue) {
  // Update the input field's value
  const barcodeInput = document.querySelector(`#row-${rowId} input[name="barcode_kavach_main_unit"]`);
  if (barcodeInput) {
    barcodeInput.value = barcodeValue;
    updateEditedBarcode(rowId, barcodeValue);
  }
  // Optionally update the display of the description
  updateObservationText(rowId, barcodeValue);
}


// Enable update button if any changes occur
function enableUpdateButton() {
  const btn = document.getElementById("update-btn") || document.getElementById("update-button");
  if (btn) btn.disabled = false;
}

// Function to track changes in inputs (used for enabling the update button)
function trackChanges(element, isFile = false) {
  let initialValue = element.getAttribute("data-initial");
  let currentValue = isFile ? element.files.length > 0 : element.value;

  if (initialValue != currentValue) {
    const btn = document.getElementById("update-btn") || document.getElementById("update-button");
    if (btn) btn.disabled = false;
    unsavedChanges = true;
  }
}

// Explicit helper used in inline handlers to flag unsaved state
function markDataAsUnsaved() {
  console.log("markDataAsUnsaved called");
  unsavedChanges = true;
  // Enable all update buttons (handling potential multiple instances or IDs)
  const buttons = document.querySelectorAll("#update-btn, #update-button, .update-btn");
  console.log(`Found ${buttons.length} update buttons to enable.`);
  buttons.forEach(btn => {
    console.log("Enabling button:", btn.id);
    btn.disabled = false;
  });
}

// Function to delete an image





function toggleNotInstalledOption(inputElement) {
  // Find the row containing this input
  const row = inputElement.closest('tr');
  if (!row) return;

  // Grab the dropdown in the same row
  const dropdown = row.querySelector('select');
  if (!dropdown) return;

  // Locate the "Not Installed" <option> in that dropdown
  const notInstalledOption = [...dropdown.options].find(
    option => option.value === 'Not Installed'
  );
  if (!notInstalledOption) return; // fixed typo: using notInstalledOption

  // If there's any text in the barcode input, disable "Not Installed"
  if (inputElement.value.trim() !== '') {
    notInstalledOption.disabled = true;

    // If the dropdown was already set to "Not Installed", reset it
    if (dropdown.value === 'Not Installed') {
      dropdown.value = 'Select';
    }
  } else {
    // If input is empty, re-enable "Not Installed"
    notInstalledOption.disabled = false;
  }
}


// Function to format observation description
function formatDescription(observationText) {
  let normalized = observationText.trim();

  // Match trailing numbers
  const trailingMatch = normalized.match(/(\d+\s*)+$/);
  if (!trailingMatch) return normalized; // No trailing numbers found, return the original text

  const trailingNumbers = trailingMatch[0].trim().split(/\s+/); // Split trailing numbers
  const labelsText = normalized.substring(0, trailingMatch.index).trim(); // Get text before the trailing numbers

  // Match labels that end with a colon
  const labels = labelsText.match(/[^:]+:/g);
  if (!labels) return normalized; // No labels found, return the original text

  // Return formatted string combining labels and numbers
  return labels.slice(0, trailingNumbers.length)
    .map((label, i) => label.trim() + trailingNumbers[i]) // Combine each label with its corresponding number
    .join(" , ");
}

// Function to fetch updated details when clicking "Get Details"
function getDetails() {
  let  stationId= document.getElementById("station-id").value.trim();
  let zone = document.getElementById("zone").value.trim();
  let division = document.getElementById("division").value.trim();
  let sectionName = document.getElementById("section-name").value.trim();


  if (!stationId || !zone || !division || !sectionName) {
    alert("Please fill in all the fields.");
    return;
  }

  console.log("📢 Fetching details for:", { stationId, zone, division, sectionName });

  // Replace jQuery $.ajax with native fetch
  const formData = new FormData();
  formData.append("station-id", stationId);
  formData.append("zone", zone);
  formData.append("division", division);
  formData.append("section-name", sectionName);

  fetch("generateReport.php", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(async function(response) {
      console.log("✅ Server Response:", response);

      if (!response.success) {
        console.warn("⚠️ No details found:", response.message);
        alert(response.message);
        return;
      }


      console.log("🚂 Station Details Found:", response.stationDetails);
      populateStationDetails(response.stationDetails);


      window.allObservations = response.observations;
      let sectionWiseSno = {};

       response.observations.forEach((observation) => {
        let sectionID = observation.section_id;
        if (!sectionWiseSno[sectionID]) {
          sectionWiseSno[sectionID] = [];
        }
        if (!sectionWiseSno[sectionID].includes(observation.S_no)) {
          sectionWiseSno[sectionID].push(observation.S_no);
        }
      });
      window.sectionWiseSno = sectionWiseSno;

      console.log("📌 Section-wise S_no mapping stored:", sectionWiseSno);

      Object.keys(sectionWiseSno).forEach((sectionID) => {
        const container = document.getElementById(`observations-section-${sectionID}`);
        if (container) {
          updateSections(response.observations, sectionID, sectionWiseSno[sectionID]);
        }
      });

      await checkAndHighlightSections(stationId, zone, division);

      // Logic to toggle Save vs Update buttons based on whether data exists for the ACTIVE subsection
      const saveBtn = document.getElementById('save-btn');
      const getDetailsBtn = document.getElementById('get-details-btn');
      const updateBtn = document.getElementById('update-btn');

      // Default state: Show Save, Hide Update
      if (saveBtn) saveBtn.style.display = 'inline-block';
      if (getDetailsBtn) getDetailsBtn.style.display = 'inline-block';
      if (updateBtn) updateBtn.style.display = 'none';

      // Check if we have any observations for the CURRENT section
      // If we are in a subsection context (activeSubsection is global), check if *that* subsection has data.
      let hasDataForCurrentContext = false;

      if (typeof activeSubsection !== 'undefined' && activeSubsection) {
          // Check if any fetched observation belongs to this subsection
          hasDataForCurrentContext = response.observations.some(obs =>
              obs.S_no && String(obs.S_no).startsWith(activeSubsection)
          );
          console.log(`[getDetails] Checking data for subsection ${activeSubsection}: ${hasDataForCurrentContext}`);
      } else {
          // If no subsection active (main view), checking if *any* data returned suggests update mode is available
          // FIX: Check if data exists for the CURRENTLY VISIBLE section specifically.
          const visibleTable = document.querySelector('table[id^="observations-section-"]');
          if (visibleTable) {
              const currentSectionId = visibleTable.id.replace('observations-section-', '');
              hasDataForCurrentContext = response.observations.some(obs => obs.section_id === currentSectionId);
              console.log(`[getDetails] Checking data for section ${currentSectionId}: ${hasDataForCurrentContext}`);
          } else {
              // Fallback if we can't determine section (unlikely)
              if (response.observations && response.observations.length > 0) {
                  hasDataForCurrentContext = true;
              }
          }
      }

      if (hasDataForCurrentContext) {
          if (saveBtn) saveBtn.style.display = 'none';
          if (getDetailsBtn) getDetailsBtn.style.display = 'none';
          if (updateBtn) {
              updateBtn.style.display = 'inline-block';
          }
      }

      unsavedChanges = false;
  })
  .catch(error => {
      console.error("❌ Error fetching data from server:", error);
      alert("There was an error fetching the data.");
  });
}

// Modified displayImages function to include delete icon
function displayImagesWithDelete(images, rowId) {
  const imageContainer = document.getElementById(`image-container-${rowId}`);
  if (imageContainer) {
    images.forEach((imgPath, idx) => {
      const imgHTML = `
        <div class="image-container">
          <img
            id="captured-image-${rowId}-${idx}"
            src="${imgPath}"
            alt="Uploaded Image"
            width="100"
            style="display:block; margin:5px;"
            onerror="console.error('Error loading image:', this.src)">
          <button type="button" onclick="deleteImage('${rowId}', '${imgPath}')">Delete</button>
        </div>
      `;
      imageContainer.innerHTML += imgHTML;
    });
  }
}


/**
 * Update existing observations for a given section.
 * Uses rowFiles map, deletedImagesMap, uploadImages helper,
 * and preserves multi-file uploads from device and camera captures.
 */
async function updateObservation(section, subsection, forceUpdate = false) {
  // 1) Section mapping (optional index)
  const sectionMapping = {
    "2_0": 0,  "3_0": 1,  "4_0": 2,
    "5_0": 3,  "6_0": 4,  "7_0": 5, "8_0": 6,"9_0":7,"10_0":8,"11_0":9,
    "12_0":10,"13_0":11,"14_0":12,"15_0":13,"16_0":14,"17_0":15,"18_0":16,
    };

  // 2) Section‐level fields
  const stationId          = document.getElementById("station-id").value;
  const zone       = document.getElementById("zone").value;
  const division = document.getElementById("division").value;
  const sectionName=document.getElementById("section-name").value;

  if (sectionMapping[section] === undefined) {
    alert("Invalid section provided.");
    return;
  }

  // 3) Mandatory‐images check
  if (!validateMandatoryImages(section)) return;

  // 4) Build base FormData
  const formData = new FormData();
  formData.append("station-id",          stationId);
  formData.append("station-name",        document.getElementById("station-name").value);
  formData.append("initial-date",       document.getElementById("initial-date").value);
  formData.append("zone", zone);
  formData.append("division",        division);
  formData.append("section-name",       sectionName);
  formData.append("updated-date",  document.getElementById("updated-date").value);
  formData.append("section-id",       section);
  formData.append("action",           "update");
  formData.append("section_index",    sectionMapping[section]);

  // 5) Gather per-row observations
  const observations = [];
  let hasChanges = false;
  const rows = document.querySelectorAll(`#observations-section-${section} tbody tr`);

  for (const row of rows) {
    const rowId = row.id.replace("row-", "");
    // Stricter S_no extraction: keep only numbers and dots
    const rawSno = row.querySelector("td:nth-child(1)")?.innerText || "";
    const S_no = rawSno.split(/\s/)[0].trim(); // Take only the first part before any space/icon

    // If subsection is specified, only collect rows that belong to that subsection
    if (subsection && !S_no.startsWith(subsection)) continue;

    // 5a) Text, barcode (for 2_0), remarks, status
    let observationText = row.querySelector(".observation_text")?.textContent.trim() || "";
    const requirementText = row.querySelector(".requirement_text")?.textContent.trim() || "";

    if (section === "17_0") {
      const tagInput = row.querySelector("td:nth-child(2) input[type='text']");
      const tagVal = tagInput ? tagInput.value.trim() : "";
      observationText = tagVal ? `Tag_No: ${tagVal}` : "";
      if (tagVal) hasChanges = true;
    }
    const remarksArea       = row.querySelector(".remarks textarea");
    const remarks           = remarksArea?.value.trim() || "";
    const initialRemarks    = remarksArea?.getAttribute('data-initial') || "";

    const statusDropdown    = row.querySelector(".status-dropdown") || row.querySelector("select");
    const observationStatus = statusDropdown?.value || "";
    const initialStatus     = statusDropdown?.getAttribute('data-initial') || "";

    const bcInput           = row.querySelector("input[name='barcode_kavach_main_unit']");
    const barcodeValue      = bcInput ? bcInput.value.trim().slice(-15) : "";
    const initialBarcode    = bcInput ? bcInput.getAttribute('data-initial') || "" : "";

    // Check if anything changed in this row
    let rowChanged = false;
    if (String(observationStatus).trim() !== String(initialStatus).trim()) rowChanged = true;
    if (String(remarks).trim() !== String(initialRemarks).trim()) rowChanged = true;
    if (String(barcodeValue).trim() !== String(initialBarcode).trim()) rowChanged = true;

    console.log(`Row: ${S_no}`, {
        observationStatus,
        initialStatus,
        remarks,
        initialRemarks,
        barcodeValue,
        initialBarcode,
        rowChanged
    });

    // Set global hasChanges if this row has a modification
    if (rowChanged) hasChanges = true;

    // For backward compatibility/safety, also set hasChanges if status/remarks is non-empty
    // (though real change detection is better)
    // For backward compatibility/safety, also set hasChanges if status/remarks is non-empty
    // (though real change detection is better)
    if ((observationStatus && observationStatus !== "Select") || forceUpdate) {
      // If it's not "Select", we usually want to include it anyway to be safe
      console.log(`Row ${S_no} has valid status ${observationStatus}, forcing hasChanges=true`);
      hasChanges = true;
    }

    // Always include the row in the payload if it HAS some data,
    // but the global hasChanges depends on whether SOMETHING changed.
    // If forceUpdate is true, we should include the row even if status is 'Select' or empty, to ensure completeness if needed.
    // However, usually we skip completely empty rows. Let's keep the basic check but allow 'Select' if needed.
    if (!observationStatus && !remarks && !barcodeValue && !observationText) continue;

    // ... (gathering images) ...
    const existingPaths = [];
    const imgContainer  = document.getElementById(`image-container-${rowId}`);
    if (imgContainer) {
      imgContainer.querySelectorAll("img").forEach(img => {
        const rel = img.src.replace(/^.*\/uploads\//, "uploads/");
        existingPaths.push(rel);
      });
    }

    // 5c) Deleted images
    const deletedPaths = Array.from(deletedImagesMap[rowId] || []);
    if (deletedPaths.length > 0) hasChanges = true;

    // 5d) Upload new Files/Blobs from rowFiles map
    let uploadedPaths = [];
    const newFiles = rowFiles.get(rowId) || [];
    if (newFiles.length) {
      hasChanges = true;
      try {
        uploadedPaths = await uploadImages(newFiles);
        rowFiles.set(rowId, []); // clear queue
      } catch (err) {
        alert(`❌ Failed to upload images for row ${rowId}: ${err}`);
        return;
      }
    }

    // 5e) Consolidate final image list
    const allImages = [
      ...existingPaths.filter(p => !deletedPaths.includes(p)),
      ...uploadedPaths
    ];

    observations.push({
      S_no,
      observation_text:  observationText,
      requirement_text:  requirementText,
      barcode_kavach_main_unit: barcodeValue,
      remarks,
      observation_status: observationStatus,
      image_paths:       allImages,
      deleted_images:    deletedPaths
    });
  }

  // 6) Abort if no modifications
  if (!hasChanges) {
    alert("No changes detected. Modify at least one entry before updating.");
    return;
  }

  // 7) Append JSON payload
  console.log("Observations Payload:", observations);
  console.log("hasChanges:", hasChanges);
  formData.append("observations", JSON.stringify(observations));

  // Log all formData entries for debugging
  for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
  }

  // 8) Submit update
  try {
    const resp = await fetch("updateObservations.php", { method: "POST", body: formData });
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error("Server returned non-JSON response"); }

    if (data.success) {
      alert("✅ Observations updated successfully!");
      // Force reload or UI update if needed
      // getDetails(); // Optional: Reload to reflect server state

      unsavedChanges = false;
      // Disable update button after successful save
      const btn = document.getElementById('update-btn') || document.getElementById('update-button');
      // if (btn) btn.disabled = true; // Keep button enabled to allow updates at any time
      getDetails();
    } else {
      alert(`Error from server: ${data.message}`);
    }
  } catch (err) {
    console.error("Error updating observations:", err);
    alert("An error occurred during update: " + err.message);
  }
}
// Function to enable section buttons dynamically
function enableSectionButtons(sectionID) {
  // Extract only the main section number (before underscore, if present)
  const sectionNumber = sectionID.split("_")[0];

  const button = document.getElementById(`button-${sectionNumber}`);
  if (button) {
    button.disabled = false;
  } else {
    console.warn(`Button not found for section: ${sectionID}`);
  }
}

// Build the dropdown options (your function provided earlier)
// Build the dropdown options
function getDropdownOptions(sno, observationStatus, sectionID = null) {
  let isSelected = !observationStatus || observationStatus.trim() === "" || observationStatus.trim() === "Select";
  let defaultOption = `<option value="Select" ${isSelected ? "selected" : ""}>Select</option>`;

  if (!sno) {
    console.error("Invalid S_no value:", sno);
    return defaultOption;
  }

  const sNoStr = String(sno).trim().toLowerCase();

  // 1. Explicitly defined options for standard rows
  // We check this first to honor specific mappings
  const specificOptions = {
    "1.38,1.40,1.41,1.42,1.43,1.50,1.44,1.45,1.46,1.47,1.48,1.49,1.51" : ["Matching", "Not Matching", "Not Installed"],
    "1.39,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,1.10,1.11,1.12,1.13,1.14,1.15,1.16,1.17,1.18,1.19,1.20,1.21,1.22,1.23,1.24,1.25,1.26,1.27,1.28,1.29,1.30,1.31,1.32,1.33,1.34,1.35,1.36,1.37": ["Matching", "Not Matching", "Not Installed"],
    "2.1,2.2,2.3,2.4,2.5,2.6,2.7,3.1,3.2,3.3,3.4,3.5,3.6,4.1.1,4.1.2,4.1.3,4.1.4,4.2.1,4.2.2,4.2.3,4.2.4,4.3.1,4.3.2,4.3.3,4.3.3.4,5.1.1,5.1.2,5.1.3,5.1.4,5.2.1,5.2.2,5.2.3,5.2.4,5.2.5,5.3.1,5.3.2,5.4.1,5.4.2,5.4.3,5.4.4,6.1.1,6.1.2,6.1.3,6.1.4,6.1.5,6.1.6,6.2.1,7.1,7.2,7.3,7.4,7.5,8.1,8.2,8.3,8.4,9.1,9.2,9.3,9.4,9.5,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,11.1,11.2,11.3,12.1,12.2,12.3": ["Yes", "No"],
  };

  for (const [key, values] of Object.entries(specificOptions)) {
    const keys = key.split(",").map(k => k.trim().toLowerCase());
    if (keys.includes(sNoStr)) {
       const matchedOptions = values.map(value =>
         `<option value="${value}" ${observationStatus?.trim().toLowerCase() === value.toLowerCase() ? "selected" : ""}>${value}</option>`
       ).join("\n");
       return defaultOption + "\n" + matchedOptions;
    }
  }

  // 2. Fallback Logic: Prioritize sectionID if available, else use sno prefix
  let options = ["Yes", "No"]; // Default to Yes/No

  if (sectionID) {
    // Label 1.0 is Section "2_0"
    if (sectionID === "2_0" || sectionID === "2.0") {
      options = ["Matching", "Not Matching", "Not Installed"];
    }
  } else {
    // Fallback to S_no prefix if sectionID is not provided
    const parts = sNoStr.split('.');
    if (parts[0] === "1") {
      options = ["Matching", "Not Matching", "Not Installed"];
    }
  }

  const optionsHTML = options.map(value =>
    `<option value="${value}" ${observationStatus?.trim().toLowerCase() === value.toLowerCase() ? "selected" : ""}>${value}</option>`
  ).join("\n");

  return defaultOption + "\n" + optionsHTML;
}





function formatDescription(description) {
  let normalized = description.trim();
  const trailingMatch = normalized.match(/(\d+\s*)+$/);
  if (!trailingMatch) return normalized;

  const trailingNumbers = trailingMatch[0].trim().split(/\s+/);
  const labelsText = normalized.substring(0, trailingMatch.index).trim();
  const labels = labelsText.match(/[^:]+:/g);
  if (!labels) return normalized;

  return labels.slice(0, trailingNumbers.length)
    .map((label, i) => label.trim() + trailingNumbers[i])
    .join(" , ");
}



function showModal() {
  const modal = document.getElementById("success-modal");
  modal.style.display = "block"; // Show modal
  setTimeout(() => {
    modal.style.display = "none"; // Hide modal after 3 seconds
  }, 3000);
}

// Helper function to handle input selection (only one checked)
function onlyOneChecked(target, name) {
  const checkboxes = document.getElementsByName(name);
  checkboxes.forEach((checkbox) => {
    if (checkbox !== target) checkbox.checked = false;
  });
}



function showUploadOptions(rowId) {
  const uploadBox = document.getElementById(`upload-options-${rowId}`);
  if (!uploadBox) {
    console.warn(`Upload options not found for rowId: ${rowId}`);
    return;
  }
  uploadBox.style.display = uploadBox.style.display === "none" ? "block" : "none";
}


let currentCamera = "environment"; // Default to back camera
let observations = [];

// ✅ Start Camera
async function startCamera(rowId) {
  const cameraContainer = document.getElementById(`camera-container-${rowId}`);
  const video = document.getElementById(`camera-${rowId}`);

  if (!video || !cameraContainer) {
    console.error(`❌ Missing camera elements for row ${rowId}`);
    return;
  }

  try {
    let stream = null;

    // 1. If asking for environment (back), try to force it with 'exact' first
    if (currentCamera === 'environment') {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } },
                audio: false
            });
            console.log("🎥 Camera started with exact environment mode.");
        } catch (e) {
            console.warn("⚠️ Exact environment mode failed, falling back to ideal/default...", e);
        }
    }

    // 2. If 'exact' failed or we want 'user' (front), use standard constraints
    if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentCamera },
            audio: false
        });
        console.log(`🎥 Camera started (Fallback/Normal Mode: ${currentCamera})`);
    }

    video.srcObject = stream;
    cameraContainer.style.display = "block";
  } catch (error) {
    console.error("🚨 Error starting the camera:", error);
    alert("⚠️ Unable to access the camera. Please check permissions.");
  }
}

// ✅ Stop Camera
function stopCamera(rowId) {
  const video = document.getElementById(`camera-${rowId}`);
  if (!video) return;

  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }

  const cameraContainer = document.getElementById(`camera-container-${rowId}`);
  if (cameraContainer) cameraContainer.style.display = "none";

  console.log("🛑 Camera stopped.");
}

function enableButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = false));
}

// ✅ Capture Image
function captureImage(rowId) {
  const canvas = document.getElementById(`canvas-${rowId}`);
  const video = document.getElementById(`camera-${rowId}`);
  const imageContainer = document.getElementById(`image-container-${rowId}`);

  if (!canvas || !video || !imageContainer) {
    console.error(`❌ Missing elements for row ${rowId}`);
    return;
  }

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    alert("⚠️ Camera not active. Please start the camera first.");
    return;
  }

  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  console.log("📸 Capturing image...");

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error("⚠️ Failed to create image blob.");
      return;
    }

    // Log the blob size and type to confirm it was created correctly
    console.log("📝 Image blob created. Size:", blob.size, "Type:", blob.type);

    // Upload the captured image
    uploadCapturedImage(blob, rowId, imageContainer);
  }, "image/png");

  stopCamera(rowId); // Stop the camera only after the image is captured
}


// ✅ Upload Captured Image and Add to rowFiles
function uploadCapturedImage(blob, rowId, imageContainer) {
  const formData = new FormData();
  formData.append("images[]", blob, `capture-${rowId}.png`);

  console.log("📤 Uploading captured image...");

  fetch("upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📜 Upload response:", data);

      if (data.success && data.file_paths && data.file_paths.length > 0) {
        const imageUrl = data.file_paths[0];

        // Add the captured image URL to the image container and rowFiles map
        addImageWithDeleteIcon(imageUrl, imageContainer, rowId); // Use reusable function
        updateObservations(rowId, imageUrl);

        // Add captured image URL to rowFiles (if it's not already in there)
        const files = rowFiles.get(rowId) || [];
        files.push(imageUrl);  // Add imageUrl from captured image
        rowFiles.set(rowId, files);

        console.log(`✅ Image uploaded: ${imageUrl}`);
        markDataAsUnsaved(); // Enable update button
      } else {
        alert(`⚠️ Capture upload failed: ${data.message || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("🚨 Error uploading image:", error);
      alert("⚠️ Image upload failed.");
    });
}


async function uploadDeviceImages(rowId) {
  let imagePaths = [];

  const imageContainer = document.getElementById(`image-container-${rowId}`);
  if (imageContainer) {
    const imgs = imageContainer.querySelectorAll("img");
    for (const img of imgs) {
      const src = img.getAttribute("src");
      if (src.startsWith("data:image")) {
        // Optional: convert base64 to blob + upload here if needed
        console.warn("Base64 image detected. Already uploaded via camera.");
      } else {
        const relative = src.replace(/^.*\/uploads\//, "uploads/");
        imagePaths.push(relative);
      }
    }
  }

  // Then upload files from rowFiles map (device uploads)
  const files = rowFiles.get(rowId) || [];
  if (files.length > 0) {
    const fd = new FormData();
    files.forEach(f => fd.append("images[]", f));

    try {
      const response = await fetch("upload.php", {
        method: "POST",
        body: fd
      });
      const data = await response.json();
      if (data.success && data.file_paths) {
        data.file_paths.forEach(path => {
          imagePaths.push(path);
        });
      } else {
        alert("❌ Upload failed.");
        return [];
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      return [];
    }
  }

  return imagePaths;
}

// ✅ Reusable function to add image with delete icon
function addImageWithDeleteIcon(imageUrl, imageContainer, rowId) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "inline-block";
  wrapper.style.position = "relative";
  wrapper.style.margin = "5px";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.width = "100px";
  img.style.display = "block";
  img.style.border = "1px solid #ccc";

  // Create delete icon
  const deleteIcon = document.createElement("span");
  deleteIcon.innerHTML = "&times;"; // × symbol
  deleteIcon.style.position = "absolute";
  deleteIcon.style.top = "-8px";
  deleteIcon.style.right = "-8px";
  deleteIcon.style.backgroundColor = "#f44336";
  deleteIcon.style.color = "#fff";
  deleteIcon.style.width = "20px";
  deleteIcon.style.height = "20px";
  deleteIcon.style.borderRadius = "50%";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.style.textAlign = "center";
  deleteIcon.style.lineHeight = "20px";
  deleteIcon.style.fontWeight = "bold";
  deleteIcon.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

  deleteIcon.onclick = () => {
    wrapper.remove();
    console.log("✅ Deleted image:", imageUrl);
    removeImageFromObservations(rowId, imageUrl); // optional backend logic
  };

  wrapper.appendChild(img);
  wrapper.appendChild(deleteIcon);
  imageContainer.appendChild(wrapper);
}


// Optional: Function to remove image from backend observations (if needed)
function removeImageFromObservations(rowId, imageUrl) {
  // Implement backend deletion logic here
  fetch("deleteImage.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ rowId, imageUrl })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("🗑️ Image removed from backend.");
      } else {
        console.error("⚠️ Failed to remove image from backend:", data.message);
      }
    })
    .catch(error => {
      console.error("🚨 Error in removing image from backend:", error);
    });
}


// ✅ Update Observations Array
function updateObservations(rowId, imagePath) {
  let observation = observations.find((obs) => obs.S_no === rowId);

  if (observation) {
    observation.image_path = imagePath;
  } else {
    observations.push({
      S_no: rowId,
      observation_text: "",
      remarks: "",
      observation_status: "",
      image_path: imagePath,
    });
  }

  console.log("📜 Updated Observations:", observations);
}

// ✅ Switch Camera (Front/Back)
function switchCamera(rowId) {
  currentCamera = currentCamera === "environment" ? "user" : "environment";
  stopCamera(rowId);
  startCamera(rowId);
}


// Step 1: Function to handle file upload
function handleFileUpload(rowId, imgElementId) {
  const files = rowFiles.get(rowId); // Get the list of files for the specific row
  if (!files || files.length === 0) {
    alert("No files selected for upload.");
    return;
  }

  const formData = new FormData();

  // Step 2: Append each file with a unique name (timestamp to avoid overwriting)
  files.forEach((file) => {
    console.log(`📤 Adding ${file.name} to formData...`);

    // Append file with a unique identifier
    const timestamp = Date.now();
    formData.append("images[]", file, `${file.name.split('.')[0]}_${timestamp}.${file.name.split('.').pop()}`);
  });

  console.log('🔄 Sending images to upload.php...');

  // Step 3: Send the request to upload.php via Fetch API
  fetch("upload.php", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      console.log("Upload Response:", data); // Debugging log
      if (data.success) {
        // Step 4: If upload is successful, update the image elements with the uploaded file paths
        const imgElement = document.getElementById(imgElementId);

        // Check if the file paths are returned as expected
        data.file_paths.forEach((filePath) => {
          // Display uploaded image(s)
          const img = document.createElement("img");
          img.src = filePath; // Use the returned file path
          img.style.display = "block";
          imgElement.appendChild(img); // Append to the imgElement
        });
      } else {
        alert("Upload failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload.");
    });
}


// at top of your script:
const rowFiles = new Map();  // rowId → Array<File>
function displayImages(inputElement, rowId) {
  rowId = String(rowId); // ✅ Always treat rowId as a string
  markDataAsUnsaved();
  console.log(`📥 Triggered displayImages for row ${rowId}`);

  const imageContainer = document.getElementById(`image-container-${rowId}`);
  if (!imageContainer) {
    console.error(`❌ Image container not found for rowId: ${rowId}`);
    return;
  }

  const newFiles = Array.from(inputElement.files);
  if (newFiles.length === 0) {
    console.warn("⚠️ No files selected for upload.");
    return;
  }

  const existing = rowFiles.get(rowId) || [];
  existing.push(...newFiles);
  rowFiles.set(rowId, existing);
  console.log(`📦 After pick, row ${rowId} has ${existing.length} total files`);

  newFiles.forEach(file => {
    console.log(`🔍 Reading file: ${file.name}`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      console.log(`🖼️ Preview ready for: ${file.name}`);

      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        display: "inline-block", position: "relative", margin: "5px"
      });

      const img = document.createElement("img");
      img.src = imageUrl;
      Object.assign(img.style, { width: "100px", border: "1px solid #ccc" });

      const del = document.createElement("span");
      del.innerHTML = "&times;";
      Object.assign(del.style, {
        position: "absolute", top: "-8px", right: "-8px",
        backgroundColor: "#f44336", color: "#fff",
        width: "20px", height: "20px", borderRadius: "50%",
        cursor: "pointer", textAlign: "center", lineHeight: "20px",
        fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      });

      del.onclick = () => {
        markDataAsUnsaved();
        wrapper.remove();
        const arr = rowFiles.get(rowId).filter(f => f !== file);
        rowFiles.set(rowId, arr);
        console.log(`🗑️ Deleted file ${file.name}; ${arr.length} remain for row ${rowId}`);
      };

      wrapper.append(img, del);
      imageContainer.append(wrapper);
    };
    reader.readAsDataURL(file);
  });
}


function uploadImages(files) {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      return resolve([]); // nothing to do
    }

    const formData = new FormData();
    let appended = 0;

    files.forEach((f, idx) => {
      // only append File or Blob instances
      if (f instanceof File || f instanceof Blob) {
        // preserve original name if available, else give a default
        const filename = f.name || `capture_${idx}.png`;
        console.log(`📤 Adding ${filename} to formData…`);
        formData.append('images[]', f, filename);
        appended++;
      } else {
        console.log(`⚠️ Skipping non-file entry at index ${idx}:`, f);
      }
    });

    if (appended === 0) {
      console.log('⚠️ No valid File/Blob objects to upload.');
      return resolve([]);
    }

    console.log('🔄 Sending images to upload.php…');
    fetch('upload.php', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Response from server:', data);
        if (data.success) {
          resolve(data.file_paths);
        } else {
          console.error('❌ Image upload failed:', data.message);
          reject(data.message);
        }
      })
      .catch(err => {
        console.error('🚨 Upload error:', err);
        alert('Upload failed due to a network or server error.');
      });
  });
}


function highlightSelect(selectElement) {
  try {
    console.log("highlightSelect called", selectElement.value);
    if (!selectElement) return;

    if (selectElement.value === "Not Present") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Present") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Matching") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Matching") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Found Ok") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Installed") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Implemented") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Applicable") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Fixed") {
      selectElement.style.backgroundColor = "Green";
    } else if (selectElement.value === "Found Not Ok") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Connected") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Implemeneted") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Routing done") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Fixed") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Voltage found Ok") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Connected") {
      selectElement.style.backgroundColor = "yellow";
    } else if (selectElement.value === "Done") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Voltage found not Ok") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Ok") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Done") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Routing Not done") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "PCCL Done") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Ok") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Earth Connected") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "PCCL Not Done") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Functioning") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Earth not connected") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Identification Done") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Cable ties implemented") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Functioning") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Joined") {
      selectElement.style.backgroundColor = "Green";
    } else if (selectElement.value === "Identification Not Done") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Installed") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Cable ties not implemented") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Not Available") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Not Joined") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "Actual Rating:") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Compliance") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Yes") {
      selectElement.style.backgroundColor = "green";
    } else if (selectElement.value === "Non-Compliance") {
      selectElement.style.backgroundColor = "red";
    } else if (selectElement.value === "No") {
      selectElement.style.backgroundColor = "red";
    } else {
      selectElement.style.backgroundColor = "";
    }
  } catch(e) {
    console.error("highlightSelect error:", e);
  }
}

const deletedImagesMap = {}; // Tracks deleted image URLs for each observationID

// 1) define per‑section lists of S_no that require an image
const mandatoryImageRowsBySection = {
  "3_0": ["3.1","3.5","3.7","3.8","3.11"],
  "4_0": ["4.1","4.2"],
  "5_0": ["5.2","5.3","5.4","5.5"],
  "6_0": ["6.2","6.3","6.6","6.8","6.9","6.10"],
  "7_0": ["7.1","7.3"],

};

function validateMandatoryImages(sectionID) {
  const mandatory = mandatoryImageRowsBySection[sectionID] || [];
  const tbody     = document.querySelector(`#observations-tbody-${sectionID}`);
  const missing   = [];

  if (!tbody) return true;

  tbody.querySelectorAll("tr").forEach(tr => {
    const sno = tr.cells[0]?.textContent.trim();
    if (!mandatory.includes(sno)) return;       // not one of the must‑have rows

    const sel = tr.querySelector("select");
    if (!sel || sel.value === "Select") return; // still default → skip

    // IMAGE IS ALWAYS IN THE LAST CELL
    const imgCell = tr.cells[tr.cells.length - 1];
    const imgs    = imgCell?.querySelectorAll("img") || [];

    if (imgs.length === 0) {
      missing.push(sno);
    }
  });

  if (missing.length) {
    alert(`🚫 Image required for rows: ${missing.join(", ")}`);
    return false;
  }
  return true;
}

// Add new row for section 8.0 (RFID PS Unit Observations)
function addRowSection18() {
  const sectionId = "18_0";
  const tbody = document.getElementById(`observations-tbody-${sectionId}`);
  if (!tbody) return;

  // Determine next S_no: find last numeric s_no in existing rows
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const sNos = rows
    .map(tr => parseFloat(tr.cells?.[0]?.textContent))
    .filter(n => !isNaN(n));
  const base = 7.0; // continue after 7.x as per first row 7.1
  const nextIndex = sNos.length ? Math.max(...sNos) + 0.1 : base + 0.1;
  const nextSno = nextIndex.toFixed(1);

  // Create a unique rowId using sno without dot
  const rowId = nextSno.replace(".", "");

  // Build row HTML
  const tr = document.createElement("tr");
  tr.id = `row-${rowId}`;
  tr.innerHTML = `
      <td>${nextSno}</td>
      <td class="SA_tag_no" style="width: 20%;"><input type="text" id="SA_tag-no-${rowId}" placeholder="enter SA tag no" style="width: 100%; box-sizing: border-box;"></td>
      <td class="SF_tag_no" style="width: 20%;"><input type="text" id="SF_tag-no-${rowId}" placeholder="enter SF tag no" style="width: 100%; box-sizing: border-box;"></td>
      <td class="select">
        <select onchange="highlightSelect(this)">
          <option value="Select">Select</option>
          <option value="Torquing done">Details in annexure -A</option>
        </select>
      </td>
      <td class="remarks" style="width: 40%;">
        <textarea placeholder="Add comments here if Not OK..." rows="2" cols="20" style="width: 100%; box-sizing: border-box;"></textarea><br>
      </td>
      <td>
        <button class="add-image" onclick="showUploadOptions(${rowId})">Add Image</button>
        <div class="upload-options" id="upload-options-${rowId}" style="display: none;">
          <button class="add-image" onclick="startCamera(${rowId})">Camera</button>
          <label for="file-input-${rowId}" class="upload-label">Upload from Device</label>
          <input type="file" id="file-input-${rowId}" accept="image/*" multiple onchange="displayImages(this, ${rowId})">
        </div>
        <div id="image-container-${rowId}"></div>
        <div id="camera-container-${rowId}" style="display: none;">
          <video id="camera-${rowId}" width="100%" height="auto" autoplay></video>
          <button class="add-image" onclick="captureImage(${rowId})">Capture Image</button>
          <button class="add-image" onclick="stopCamera(${rowId})">Stop Camera</button>
          <button class="reverse-camera" onclick="switchCamera(${rowId})">🔄 Switch Camera</button>
          <canvas id="canvas-${rowId}" style="display: none;"></canvas>
        </div>
      </td>
  `;

  // Insert before the add-row placeholder if it exists, else append
  const addRowPlaceholder = document.getElementById(`add-row-${sectionId}`);
  if (addRowPlaceholder) {
    tbody.insertBefore(tr, addRowPlaceholder);
  } else {
    tbody.appendChild(tr);
  }
}



// Function to ensure only one checkbox is selected at a time for a given group
function onlyOneChecked(checkbox, groupClass) {
  const checkboxes = document.querySelectorAll(`.${groupClass}`);
  const checkedCount = Array.from(checkboxes).filter((box) => box.checked).length;
  if (checkedCount > 1) {
    checkboxes.forEach((box) => {
      if (box !== checkbox) box.checked = false;
    });
  }
}

// Render a custom row (used by addRow and loadCustomRows)
function renderCustomRow(sectionId, s_no, description) {
    const tbodyId = `observations-tbody-${sectionId.replace('.', '_')}`;
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.id = `row-${s_no}`; // Keep dots to match updateObservationsTable
    tr.className = "custom-row"; // Marker class

    // Small delete icon in S_No column
    tr.innerHTML = `
      <td>
        ${s_no} <button type="button" onclick="deleteRowTemplate(this, '${s_no}', '${sectionId}')" style="background: none; border: none; cursor: pointer; font-size: 14px;" title="Delete Row">🗑️</button>
      </td>
      <td class="observation_text">${description}<br>
        <input type="text" name="barcode_kavach_main_unit" placeholder="Scan Barcode" 
               style="width: 180px; padding: 5px; font-size: 14px;" 
               oninput="toggleNotInstalledOption(this); markDataAsUnsaved();">
      </td>
      <td>
        <select class="status-dropdown" onchange="highlightSelect(this); markDataAsUnsaved();" style="width: 180px; padding: 5px; font-size: 14px;">
          ${(function() {
              const sId = String(sectionId).replace('_', '.');
              // Label 1.0 is Section 2.0 (but ID passed is often "2_0")
              if (sId.startsWith('1.') || sId === "2_0" || sId === "2.0") {
                  return `
                      <option value="Select">Select</option>
                      <option value="Matching">Matching</option>
                      <option value="Not Matching">Not Matching</option>
                      <option value="Not Installed">Not Installed</option>
                  `;
              } else {
                  return `
                      <option value="Select">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                  `;
              }
          })()}
        </select>
      </td>
      <td class="remarks">
        <textarea placeholder="Verify with IC" rows="2" cols="20" oninput="markDataAsUnsaved();"></textarea>
      </td>
      <td>
        <button class="add-image" onclick="showUploadOptions('${s_no}')">Add Image</button>
        <div class="upload-options" id="upload-options-${s_no}" style="display: none;">
          <button class="add-image" onclick="startCamera('${s_no}')">Camera</button>
          <label for="file-input-${s_no}" class="upload-label">Upload from Device</label>
          <input type="file" id="file-input-${s_no}" accept="image/*" multiple onchange="displayImages(this, '${s_no}')">
        </div>
        <div id="image-container-${s_no}"></div>
        <div id="camera-container-${s_no}" style="display: none;">
          <video id="camera-${s_no}" width="100%" height="auto" autoplay></video>
          <button class="add-image" onclick="captureImage('${s_no}')">Capture Image</button>
          <button class="add-image" onclick="stopCamera('${s_no}')">Stop Camera</button>
          <button class="reverse-camera" onclick="switchCamera('${s_no}')">🔄 Switch Camera</button>
          <canvas id="canvas-${s_no}" style="display: none;"></canvas>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
}

// Add new row for section 2.0 with password protection and PERSISTENCE
async function addRowWithPassword(sectionId) {
  const password = prompt("Please enter password to add a new PERMANENT row:");
  if (password !== "hbl@123") {
    alert("Incorrect password!");
    return;
  }

  const unitName = prompt("Enter Unit Name / Aspect:");
  if (!unitName) return;

  const tbodyId = `observations-tbody-${sectionId.replace('.', '_')}`;
  const tbody = document.getElementById(tbodyId);

  // Calculate next S_No
  let nextSno = "1.26";
  if (tbody) {
      const rows = Array.from(tbody.querySelectorAll("tr"));
      if (rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        const lastSnoStr = lastRow.cells[0].innerText.trim().replace("🗑️", ""); // Remove icon if present
        const lastSnoParts = lastSnoStr.split(".");
        if (lastSnoParts.length === 2) {
          const lastNum = parseInt(lastSnoParts[1]);
          if (!isNaN(lastNum)) {
             nextSno = `${lastSnoParts[0]}.${lastNum + 1}`;
          }
        }
      }
  }

  // Save to backend
  const formData = new FormData();
  formData.append("action", "add");
  formData.append("section_id", sectionId);
  formData.append("s_no", nextSno);
  formData.append("description", unitName);

  try {
      const resp = await fetch("manage_row_templates.php", {method: "POST", body: formData});
      const res = await resp.json();
      if(res.success) {
          renderCustomRow(sectionId, nextSno, unitName);
          alert("Row added permanently.");
      } else {
          alert("Failed to save row: " + res.message);
      }
  } catch(e) {
      console.error(e);
      alert("Error saving row");
  }
}

async function deleteRowTemplate(span, s_no, sectionId) {
    const password = prompt("Enter password to DELETE this permanent row:");
    if(password !== "hbl@123") return;

    if(!confirm("Are you sure? This will remove the row for all future reports.")) return;

    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("section_id", sectionId);
    formData.append("s_no", s_no);

    try {
        const resp = await fetch("manage_row_templates.php", {method: "POST", body: formData});
        const res = await resp.json();
        if(res.success) {
            span.closest("tr").remove();
            alert("Row deleted permanently.");
        } else {
            alert("Failed to delete: " + res.message);
        }
    } catch(e) {
        alert("Error deleting");
    }
}

// Load custom rows for a section
async function loadCustomRows(sectionId) {
    const formData = new FormData();
    formData.append("action", "fetch");
    formData.append("section_id", sectionId);

    try {
        const resp = await fetch("manage_row_templates.php", {method: "POST", body: formData});
        const res = await resp.json();
        if(res.success && res.data) {
            res.data.forEach(row => {
                // Check if row already exists to avoid duplication
                const existingRowId = `row-${row.s_no}`;
                if(!document.getElementById(existingRowId)) {
                    renderCustomRow(sectionId, row.s_no, row.description);
                }
            });
        }
    } catch(e) {
        console.error("Error loading custom rows", e);
    }
}

/* Old delete function removed */

function markDataAsUnsaved() {
    unsavedChanges = true;
}





