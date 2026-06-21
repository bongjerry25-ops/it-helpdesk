// 🌐 ទីតាំង API របស់ម៉ាស៊ីន Server (សូមប្តូរ IP នេះទៅជា IP ពិតនៃម៉ាស៊ីន CentOS VM របស់បង)
const BACKEND_API_URL = "http://192.168.31.129/api.php"; 

// 📋 បញ្ជីរាយនាមបញ្ហាលម្អិតតាមប្រភេទនីមួយៗ
const issueList = {
    Software: ["O365", "Email", "Software Installation", "Application Support", "Access & Permission", "PDF & Printing", "Other"],
    Hardware: ["Computer / Laptop", "Printer", "Monitor & Display", "Peripheral Devices (Keyboard,Mouse..)", "Network cable issue"]
};

// ទាញយកប្រអប់ទិន្នន័យពី HTML
const mainIssueSelect = document.getElementById("issue_type");
const subCategoryArea = document.getElementById("sub_category_area");
const subIssueSelect = document.getElementById("sub_issue");
const slaSelect = document.getElementById("sla_priority");

// 🎨 Logic សម្រាប់ប្តូរពណ៌ប្រអប់ SLA ដោយស្វ័យប្រវត្តិ
slaSelect.addEventListener("change", function() {
    this.style.color = ""; 
    this.style.borderColor = ""; 
    this.style.boxShadow = "";
    
    if (this.value === "High") {
        this.style.color = "#ef4444"; // ពណ៌ក្រហម
        this.style.borderColor = "#ef4444";
        this.style.boxShadow = "0 0 0 4px rgba(239, 68, 68, 0.2)";
    } else if (this.value === "Medium") {
        this.style.color = "#eab308"; // ពណ៌លឿង
        this.style.borderColor = "#eab308";
        this.style.boxShadow = "0 0 0 4px rgba(234, 179, 8, 0.2)";
    } else if (this.value === "Low") {
        this.style.color = "#94a3b8"; // ពណ៌ប្រផេះងងឹត
        this.style.borderColor = "#334155";
        this.style.boxShadow = "0 0 0 4px rgba(51, 65, 85, 0.4)";
    }
});

// 🔄 Logic ផ្លាស់ប្តូរការបង្ហាញបញ្ហាលម្អិត (Dynamic Dropdown)
mainIssueSelect.addEventListener("change", function() {
    const selected = this.value;
    if (selected && issueList[selected]) {
        subIssueSelect.innerHTML = `<option value="" class="bg-[#0f172a]">-- សូមជ្រើសរើសបញ្ហាលម្អិត --</option>`;
        issueList[selected].forEach(item => {
            subIssueSelect.innerHTML += `<option value="${item}" class="bg-[#0f172a]">${item}</option>`;
        });
        subCategoryArea.classList.remove("hidden");
        subIssueSelect.required = true;
    } else {
        subCategoryArea.classList.add("hidden");
        subIssueSelect.required = false;
    }
});

// 🚀 Logic ស្នូល៖ រុញទិន្នន័យទៅកាន់ PHP Proxy (CentOS Server)
document.getElementById("ticketForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // ឃាត់កុំឱ្យ Page លោត Refresh
    
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerText = "កំពុងបញ្ជូនទិន្នន័យសម្ងាត់...";

    // ប្រមូលទិន្នន័យពី Form ខ្ចប់ជាកញ្ចប់ JSON
    const payload = {
        staffId: document.getElementById("staff_id").value,
        name: document.getElementById("name").value,
        dept: document.getElementById("department").value,
        phone: document.getElementById("phone").value,
        mainIssue: mainIssueSelect.value,
        subIssue: subIssueSelect.value,
        sla: slaSelect.value,
        desc: document.getElementById("description").value
    };

    try {
        // បាញ់ទិន្នន័យទៅកាន់ Server (api.php)
        const response = await fetch(BACKEND_API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // ពិនិត្យមើលលទ្ធផលត្រឡប់មកវិញពី Server
        if(result.status === "success") {
            alert("🎉 ជោគជ័យ! សំបុត្រកិច្ចការ (Ticket) របស់អ្នកត្រូវបានផ្ញើជូនក្រុមការងារ IT និងកត់ត្រាចូលប្រព័ន្ធដោយសុវត្ថិភាពរួចរាល់ហើយ!");
            
            // សម្អាត Form វិញក្រោយពេលផ្ញើជោគជ័យ
            document.getElementById("ticketForm").reset();
            subCategoryArea.classList.add("hidden");
            slaSelect.style.color = ""; 
            slaSelect.style.borderColor = "";
            slaSelect.style.boxShadow = "";
        } else {
            alert("ការផ្ញើបរាជ័យ៖ " + result.message);
        }
    } catch (error) {
        console.error("Error connecting to backend:", error);
        alert("មានបញ្ហាតភ្ជាប់ទៅកាន់ Server កណ្តាល! សូមពិនិត្យមើល IP ឬ Network របស់អ្នក។");
    } finally {
        // បើកប៊ូតុងឱ្យដំណើរការវិញ
        btn.disabled = false;
        btn.innerText = "បញ្ជូនទិន្នន័យសិល្ប៍ (Secure Submit)";
    }
});