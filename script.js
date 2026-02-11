document.addEventListener('DOMContentLoaded', () => {
    // 1. Accordion Logic
    // Default open first section
    // document.getElementById('section-1').classList.add('active'); // set in html now

    // 2. Signature Pad Logic
    setupSignaturePad();

    // 3. Populate Date Dropdowns
    populateDateDropdowns();
    populateCountryDropdown();
    populateCountryCodes();

    // 4. Initialize Time Inputs
    initializeTimeInputs();

    // 5. Guest Logic initialized in HTML onclick
});


// Accordion Toggle
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    // Optional: Close others
    // document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    section.classList.toggle('active');
}

// Guest Functions
function addGuest() {
    const container = document.getElementById('guests-container');
    const guestCount = container.children.length + 1;

    const guestRow = document.createElement('div');
    guestRow.className = 'guest-row';
    guestRow.innerHTML = `
        <div class="guest-header">
            <span>Guest ${guestCount}</span>
            <button type="button" class="remove-btn" onclick="removeGuest(this)">Remove</button>
        </div>
        <div class="form-grid guest-grid">
            <div class="form-group">
                <label>First Name *</label>
                <input type="text" placeholder="First name">
            </div>
            <div class="form-group">
                <label>Last Name *</label>
                <input type="text" placeholder="Last name">
            </div>
            <div class="form-group small">
                <label>Age *</label>
                <input type="number" value="0">
            </div>
        </div>
    `;

    container.appendChild(guestRow);
}

function removeGuest(button) {
    button.closest('.guest-row').remove();
    // Renumber guests if needed, but not strictly required for MVP
}

// Signature Pad Logic
function setupSignaturePad() {
    const canvas = document.getElementById('signature-pad');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Handle resizing
    function resizeCanvas() {
        if (!canvas.offsetParent) return; // Hidden
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);
    }

    window.addEventListener('resize', resizeCanvas);
    // Intersection observer to handle when it becomes visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            resizeCanvas();
        }
    });
    observer.observe(canvas);

    resizeCanvas(); // Initial call

    // Mouse Events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    // Touch Events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    });

    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);
        ctx.moveTo(x, y);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function clearSignature() {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function populateCountryDropdown() {
    const section1 = document.getElementById('section-1');
    if (!section1) return;

    const selects = section1.querySelectorAll('select');
    let targetSelect = null;
    selects.forEach(s => {
        if (s.options[0] && s.options[0].text === 'Select your country') {
            targetSelect = s;
        }
    });

    if (targetSelect) {
        // Reduced list for brevity in this prompt, but in real scenario would be full 190+ list.
        // User requested "all", so I will provide a very comprehensive list.
        const countries = [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
            "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
            "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
            "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
            "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia",
            "Fiji", "Finland", "France",
            "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
            "Haiti", "Holy See", "Honduras", "Hungary",
            "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
            "Jamaica", "Japan", "Jordan",
            "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
            "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
            "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
            "Oman",
            "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
            "Qatar",
            "Romania", "Russia", "Rwanda",
            "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
            "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
            "Vanuatu", "Venezuela", "Vietnam",
            "Yemen",
            "Zambia", "Zimbabwe"
        ];
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            targetSelect.appendChild(option);
        });
    }
}

function populateCountryCodes() {
    const codeSelect = document.querySelector('.country-code');
    if (!codeSelect) return;

    codeSelect.innerHTML = ''; // Clear existing

    // Comprehensive list
    const codes = [
        { code: "+93", country: "AF" }, { code: "+355", country: "AL" }, { code: "+213", country: "DZ" }, { code: "+1-684", country: "AS" }, { code: "+376", country: "AD" },
        { code: "+244", country: "AO" }, { code: "+1-264", country: "AI" }, { code: "+672", country: "AQ" }, { code: "+1-268", country: "AG" }, { code: "+54", country: "AR" },
        { code: "+374", country: "AM" }, { code: "+297", country: "AW" }, { code: "+61", country: "AU" }, { code: "+43", country: "AT" }, { code: "+994", country: "AZ" },
        { code: "+1-242", country: "BS" }, { code: "+973", country: "BH" }, { code: "+880", country: "BD" }, { code: "+1-246", country: "BB" }, { code: "+375", country: "BY" },
        { code: "+32", country: "BE" }, { code: "+501", country: "BZ" }, { code: "+229", country: "BJ" }, { code: "+1-441", country: "BM" }, { code: "+975", country: "BT" },
        { code: "+591", country: "BO" }, { code: "+387", country: "BA" }, { code: "+267", country: "BW" }, { code: "+55", country: "BR" }, { code: "+246", country: "IO" },
        { code: "+1-284", country: "VG" }, { code: "+673", country: "BN" }, { code: "+359", country: "BG" }, { code: "+226", country: "BF" }, { code: "+257", country: "BI" },
        { code: "+855", country: "KH" }, { code: "+237", country: "CM" }, { code: "+1", country: "CA" }, { code: "+238", country: "CV" }, { code: "+1-345", country: "KY" },
        { code: "+236", country: "CF" }, { code: "+235", country: "TD" }, { code: "+56", country: "CL" }, { code: "+86", country: "CN" }, { code: "+61", country: "CX" },
        { code: "+61", country: "CC" }, { code: "+57", country: "CO" }, { code: "+269", country: "KM" }, { code: "+682", country: "CK" }, { code: "+506", country: "CR" },
        { code: "+385", country: "HR" }, { code: "+53", country: "CU" }, { code: "+599", country: "CW" }, { code: "+357", country: "CY" }, { code: "+420", country: "CZ" },
        { code: "+243", country: "CD" }, { code: "+45", country: "DK" }, { code: "+253", country: "DJ" }, { code: "+1-767", country: "DM" }, { code: "+1-809", country: "DO" },
        { code: "+670", country: "TL" }, { code: "+593", country: "EC" }, { code: "+20", country: "EG" }, { code: "+503", country: "SV" }, { code: "+240", country: "GQ" },
        { code: "+291", country: "ER" }, { code: "+372", country: "EE" }, { code: "+251", country: "ET" }, { code: "+500", country: "FK" }, { code: "+298", country: "FO" },
        { code: "+679", country: "FJ" }, { code: "+358", country: "FI" }, { code: "+33", country: "FR" }, { code: "+689", country: "PF" }, { code: "+241", country: "GA" },
        { code: "+220", country: "GM" }, { code: "+995", country: "GE" }, { code: "+49", country: "DE" }, { code: "+233", country: "GH" }, { code: "+350", country: "GI" },
        { code: "+30", country: "GR" }, { code: "+299", country: "GL" }, { code: "+1-473", country: "GD" }, { code: "+1-671", country: "GU" }, { code: "+502", country: "GT" },
        { code: "+44-1481", country: "GG" }, { code: "+224", country: "GN" }, { code: "+245", country: "GW" }, { code: "+592", country: "GY" }, { code: "+509", country: "HT" },
        { code: "+504", country: "HN" }, { code: "+852", country: "HK" }, { code: "+36", country: "HU" }, { code: "+354", country: "IS" }, { code: "+91", country: "IN" },
        { code: "+62", country: "ID" }, { code: "+98", country: "IR" }, { code: "+964", country: "IQ" }, { code: "+353", country: "IE" }, { code: "+44-1624", country: "IM" },
        { code: "+972", country: "IL" }, { code: "+39", country: "IT" }, { code: "+225", country: "CI" }, { code: "+1-876", country: "JM" }, { code: "+81", country: "JP" },
        { code: "+44-1534", country: "JE" }, { code: "+962", country: "JO" }, { code: "+7", country: "KZ" }, { code: "+254", country: "KE" }, { code: "+686", country: "KI" },
        { code: "+383", country: "XK" }, { code: "+965", country: "KW" }, { code: "+996", country: "KG" }, { code: "+856", country: "LA" }, { code: "+371", country: "LV" },
        { code: "+961", country: "LB" }, { code: "+266", country: "LS" }, { code: "+231", country: "LR" }, { code: "+218", country: "LY" }, { code: "+423", country: "LI" },
        { code: "+370", country: "LT" }, { code: "+352", country: "LU" }, { code: "+853", country: "MO" }, { code: "+389", country: "MK" }, { code: "+261", country: "MG" },
        { code: "+265", country: "MW" }, { code: "+60", country: "MY" }, { code: "+960", country: "MV" }, { code: "+223", country: "ML" }, { code: "+356", country: "MT" },
        { code: "+692", country: "MH" }, { code: "+222", country: "MR" }, { code: "+230", country: "MU" }, { code: "+262", country: "YT" }, { code: "+52", country: "MX" },
        { code: "+691", country: "FM" }, { code: "+373", country: "MD" }, { code: "+377", country: "MC" }, { code: "+976", country: "MN" }, { code: "+382", country: "ME" },
        { code: "+1-664", country: "MS" }, { code: "+212", country: "MA" }, { code: "+258", country: "MZ" }, { code: "+95", country: "MM" }, { code: "+264", country: "NA" },
        { code: "+674", country: "NR" }, { code: "+977", country: "NP" }, { code: "+31", country: "NL" }, { code: "+599", country: "AN" }, { code: "+687", country: "NC" },
        { code: "+64", country: "NZ" }, { code: "+505", country: "NI" }, { code: "+227", country: "NE" }, { code: "+234", country: "NG" }, { code: "+683", country: "NU" },
        { code: "+850", country: "KP" }, { code: "+1-670", country: "MP" }, { code: "+47", country: "NO" }, { code: "+968", country: "OM" }, { code: "+92", country: "PK" },
        { code: "+680", country: "PW" }, { code: "+970", country: "PS" }, { code: "+507", country: "PA" }, { code: "+675", country: "PG" }, { code: "+595", country: "PY" },
        { code: "+51", country: "PE" }, { code: "+63", country: "PH" }, { code: "+64", country: "PN" }, { code: "+48", country: "PL" }, { code: "+351", country: "PT" },
        { code: "+1-787", country: "PR" }, { code: "+974", country: "QA" }, { code: "+242", country: "CG" }, { code: "+262", country: "RE" }, { code: "+40", country: "RO" },
        { code: "+7", country: "RU" }, { code: "+250", country: "RW" }, { code: "+590", country: "BL" }, { code: "+290", country: "SH" }, { code: "+1-869", country: "KN" },
        { code: "+1-758", country: "LC" }, { code: "+590", country: "MF" }, { code: "+508", country: "PM" }, { code: "+1-784", country: "VC" }, { code: "+685", country: "WS" },
        { code: "+378", country: "SM" }, { code: "+239", country: "ST" }, { code: "+966", country: "SA" }, { code: "+221", country: "SN" }, { code: "+381", country: "RS" },
        { code: "+248", country: "SC" }, { code: "+232", country: "SL" }, { code: "+65", country: "SG" }, { code: "+1-721", country: "SX" }, { code: "+421", country: "SK" },
        { code: "+386", country: "SI" }, { code: "+677", country: "SB" }, { code: "+252", country: "SO" }, { code: "+27", country: "ZA" }, { code: "+82", country: "KR" },
        { code: "+211", country: "SS" }, { code: "+34", country: "ES" }, { code: "+94", country: "LK" }, { code: "+249", country: "SD" }, { code: "+597", country: "SR" },
        { code: "+47", country: "SJ" }, { code: "+268", country: "SZ" }, { code: "+46", country: "SE" }, { code: "+41", country: "CH" }, { code: "+963", country: "SY" },
        { code: "+886", country: "TW" }, { code: "+992", country: "TJ" }, { code: "+255", country: "TZ" }, { code: "+66", country: "TH" }, { code: "+228", country: "TG" },
        { code: "+690", country: "TK" }, { code: "+676", country: "TO" }, { code: "+1-868", country: "TT" }, { code: "+216", country: "TN" }, { code: "+90", country: "TR" },
        { code: "+993", country: "TM" }, { code: "+1-649", country: "TC" }, { code: "+688", country: "TV" }, { code: "+256", country: "UG" }, { code: "+380", country: "UA" },
        { code: "+971", country: "AE" }, { code: "+44", country: "GB" }, { code: "+1", country: "US" }, { code: "+598", country: "UY" }, { code: "+1-340", country: "VI" },
        { code: "+998", country: "UZ" }, { code: "+678", country: "VU" }, { code: "+39", country: "VA" }, { code: "+58", country: "VE" }, { code: "+84", country: "VN" },
        { code: "+681", country: "WF" }, { code: "+967", country: "YE" }, { code: "+260", country: "ZM" }, { code: "+263", country: "ZW" }
    ];

    // Sort logic could receive here, but let's just use alphabetical or code sort if needed

    codes.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.textContent = `${item.country} ${item.code}`;
        codeSelect.appendChild(option);
    });
}



// Date & Time Helpers
function populateDateDropdowns() {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Populate Months
    document.querySelectorAll('.date-input-group select:nth-child(1)').forEach(select => {
        // Keep placeholder
        const placeholder = select.firstElementChild;
        select.innerHTML = '';
        select.appendChild(placeholder);

        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            select.appendChild(option);
        });
    });

    // Populate Days (1-31) - simplified, doesn't account for specific months yet
    document.querySelectorAll('.date-input-group select:nth-child(3)').forEach(select => {
        const placeholder = select.firstElementChild;
        select.innerHTML = '';
        select.appendChild(placeholder);

        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    });

    // Populate Years
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.date-input-group select:nth-child(5)').forEach(select => {
        const placeholder = select.firstElementChild;
        select.innerHTML = '';
        select.appendChild(placeholder);

        // DOB (Past years) vs Arrival/Departure (Future years)
        // Heuristic: If it's in Section 1 (Guest Details), it's likely DOB -> Past
        // If Section 2 (Arrival), it's Future

        const isDOB = select.closest('#section-1');
        const startYear = isDOB ? currentYear - 100 : currentYear;
        const endYear = isDOB ? currentYear : currentYear + 5;

        // For DOB, descend. For Arrival, ascend.
        if (isDOB) {
            for (let i = endYear; i >= startYear; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                select.appendChild(option);
            }
        } else {
            for (let i = startYear; i <= endYear; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                select.appendChild(option);
            }
        }
    });
}

function initializeTimeInputs() {
    // Convert text inputs with existing values to time inputs or formatted text
    // The user wants a pop-up. HTML5 <input type="time"> gives a pop-up picker.
    // Let's replace the type="text" with type="time" but keep the values formatted

    document.querySelectorAll('.time-input input').forEach(input => {
        input.type = 'time';
        // HTML5 time input expects HH:MM format (24h)
        // Convert "03:00 PM" -> "15:00"
        if (input.value.includes('PM')) {
            let [time, modifier] = input.value.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') hours = '00';
            hours = parseInt(hours, 10) + 12;
            input.value = `${hours}:${minutes}`;
        } else if (input.value.includes('AM')) {
            let [time, modifier] = input.value.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') hours = '00';
            input.value = `${hours.toString().padStart(2, '0')}:${minutes}`;
        }

        // Add click listener to icon to trigger input
        const icon = input.nextElementSibling;
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.style.pointerEvents = 'auto'; // Re-enable pointer events
            icon.onclick = () => {
                input.showPicker ? input.showPicker() : input.focus();
            };
        }
    });
}

