var LOW_STOCK_THRESHOLD = 20;
var NEAR_EXPIRY_DAYS = 30;

function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
}

var DEFAULT_MEDICINES = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        batch: "BAT-2024-001",
        quantity: 250,
        expiry: "2027-12-31",
        supplier: "MedCorp Ltd",
        contact: "+91-98457-61230",
        email: "orders@medcorp.com",
        unitPrice: 0.90,
        orderDate: daysAgo(54)
    },
    {
        id: 2,
        name: "Amoxicillin 250mg",
        batch: "BAT-2024-002",
        quantity: 15,
        expiry: "2026-03-25",
        supplier: "PharmaPlus",
        contact: "+91-70123-84567",
        email: "supply@pharmaplus.com",
        unitPrice: 1.87,
        orderDate: daysAgo(49)
    },
    {
        id: 3,
        name: "Ibuprofen 400mg",
        batch: "BAT-2024-003",
        quantity: 8,
        expiry: "2026-01-15",
        supplier: "MedCorp Ltd",
        contact: "+91-98457-61230",
        email: "orders@medcorp.com",
        unitPrice: 1.60,
        orderDate: daysAgo(29)
    },
    {
        id: 4,
        name: "Metformin 500mg",
        batch: "BAT-2024-004",
        quantity: 180,
        expiry: "2027-06-30",
        supplier: "HealthDist Co",
        contact: "+91-63789-20145",
        email: "info@healthdist.com",
        unitPrice: 1.25,
        orderDate: daysAgo(61)
    },
    {
        id: 5,
        name: "Atorvastatin 10mg",
        batch: "BAT-2024-005",
        quantity: 5,
        expiry: "2025-11-10",
        supplier: "PharmaPlus",
        contact: "+91-70123-84567",
        email: "supply@pharmaplus.com",
        unitPrice: 4.20,
        orderDate: daysAgo(116)
    },
    {
        id: 6,
        name: "Omeprazole 20mg",
        batch: "BAT-2024-006",
        quantity: 120,
        expiry: "2027-09-15",
        supplier: "HealthDist Co",
        contact: "+91-63789-20145",
        email: "info@healthdist.com",
        unitPrice: 1.56,
        orderDate: daysAgo(8)
    },
    {
        id: 7,
        name: "Cetirizine 10mg",
        batch: "BAT-2024-007",
        quantity: 3,
        expiry: "2025-08-30",
        supplier: "MedCorp Ltd",
        contact: "+91-98457-61230",
        email: "orders@medcorp.com",
        unitPrice: 1.20,
        orderDate: daysAgo(96)
    },
    {
        id: 8,
        name: "Aspirin 75mg",
        batch: "BAT-2024-008",
        quantity: 200,
        expiry: "2027-12-31",
        supplier: "PharmaPlus",
        contact: "+91-70123-84567",
        email: "supply@pharmaplus.com",
        unitPrice: 0.70,
        orderDate: daysAgo(13)
    },
    {
        id: 9,
        name: "Lisinopril 5mg",
        batch: "BAT-2024-009",
        quantity: 12,
        expiry: "2026-04-05",
        supplier: "MedCorp Ltd",
        contact: "+91-98457-61230",
        email: "orders@medcorp.com",
        unitPrice: 2.60,
        orderDate: daysAgo(8)
    },
    {
        id: 10,
        name: "Amlodipine 5mg",
        batch: "BAT-2024-010",
        quantity: 95,
        expiry: "2027-03-20",
        supplier: "HealthDist Co",
        contact: "+91-63789-20145",
        email: "info@healthdist.com",
        unitPrice: 1.55,
        orderDate: daysAgo(141)
    }
];

var DEFAULT_SUPPLIERS = [
    {
        name: "MedCorp Ltd",
        contact: "+91-98457-61230",
        email: "orders@medcorp.com"
    },
    {
        name: "PharmaPlus",
        contact: "+91-70123-84567",
        email: "supply@pharmaplus.com"
    },
    {
        name: "HealthDist Co",
        contact: "+91-63789-20145",
        email: "info@healthdist.com"
    }
];

function getTodayStr() {
    return new Date().toISOString().split("T")[0];
}

function getMedicines() {
    var stored = localStorage.getItem("medistock_medicines");
    if (stored) {
        var parsed = JSON.parse(stored);
        var needsMigration = false;
        for (var i = 0; i < parsed.length; i++) {
            if (parsed[i].unitPrice === undefined || parsed[i].unitPrice === null) {
                needsMigration = true;
                break;
            }
        }
        if (needsMigration) {
            var today = getTodayStr();
            for (var j = 0; j < parsed.length; j++) {
                var matched = null;
                for (var k = 0; k < DEFAULT_MEDICINES.length; k++) {
                    if (DEFAULT_MEDICINES[k].id === parsed[j].id) {
                        matched = DEFAULT_MEDICINES[k];
                        break;
                    }
                }
                if (matched) {
                    parsed[j].unitPrice = matched.unitPrice;
                    parsed[j].orderDate = matched.orderDate || today;
                    if (!parsed[j].email) parsed[j].email = matched.email || "";
                } else {
                    if (!parsed[j].unitPrice) parsed[j].unitPrice = 0;
                    if (!parsed[j].orderDate) parsed[j].orderDate = today;
                    if (!parsed[j].email) parsed[j].email = "";
                }
            }
            saveMedicines(parsed);
        }
        return parsed;
    }
    return DEFAULT_MEDICINES;
}

function saveMedicines(data) {
    localStorage.setItem("medistock_medicines", JSON.stringify(data));
}

function deleteMedicine(id) {
    var medicines = getMedicines();
    var updated = [];
    for (var i = 0; i < medicines.length; i++) {
        if (medicines[i].id !== id) {
            updated.push(medicines[i]);
        }
    }
    saveMedicines(updated);
}

function openConfirmModal(medicineId, medicineName, onConfirm) {
    var overlay = document.getElementById("confirmModal");
    var nameEl = document.getElementById("modalMedicineName");
    var confirmBtn = document.getElementById("modalConfirmBtn");
    var cancelBtn = document.getElementById("modalCancelBtn");
    if (!overlay) return;

    nameEl.textContent = medicineName;
    overlay.classList.add("modal-open");

    var newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    var newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    newConfirm.addEventListener("click", function () {
        overlay.classList.remove("modal-open");
        onConfirm(medicineId);
    });

    newCancel.addEventListener("click", function () {
        overlay.classList.remove("modal-open");
    });

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            overlay.classList.remove("modal-open");
        }
    });
}

function getSuppliers() {
    var stored = localStorage.getItem("medistock_suppliers");
    if (stored) {
        return JSON.parse(stored);
    }
    return DEFAULT_SUPPLIERS;
}

function getExpiryStatus(expiryDateStr) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var expiry = new Date(expiryDateStr);
    var diffMs = expiry - today;
    var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
        return "expired";
    }
    if (diffDays <= NEAR_EXPIRY_DAYS) {
        return "near-expiry";
    }
    return "safe";
}

function getDaysUntilExpiry(expiryDateStr) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var expiry = new Date(expiryDateStr);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
    var date = new Date(dateStr + "T00:00:00");
    var options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
}

function setActiveNavLink() {
    var path = window.location.pathname;
    var parts = path.split("/");
    var filename = parts[parts.length - 1];
    if (filename === "" || filename === null) {
        filename = "index.html";
    }
    var links = document.querySelectorAll(".nav-link");
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");
        if (href === filename) {
            links[i].classList.add("active");
        } else {
            links[i].classList.remove("active");
        }
    }
}

function initNavToggle() {
    var toggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");
    if (toggle && navLinks) {
        toggle.addEventListener("click", function () {
            navLinks.classList.toggle("open");
        });
    }
}

function initDashboard() {
    var medicines = getMedicines();
    renderSummaryCards(medicines);
    renderRecentTable(medicines);
    renderLowStockAlerts(medicines);
}

function renderSummaryCards(medicines) {
    var container = document.getElementById("summaryCards");
    if (!container) return;

    var total = medicines.length;
    var lowStock = 0;
    var expiryAlerts = 0;

    for (var i = 0; i < medicines.length; i++) {
        if (medicines[i].quantity <= LOW_STOCK_THRESHOLD) {
            lowStock++;
        }
        var status = getExpiryStatus(medicines[i].expiry);
        if (status === "expired" || status === "near-expiry") {
            expiryAlerts++;
        }
    }

    container.innerHTML =
        '<div class="stat-card">' +
        '<div class="stat-label">Total Medicines</div>' +
        '<div class="stat-value">' + total + '</div>' +
        '<div class="stat-detail">Items in inventory</div>' +
        '</div>' +
        '<div class="stat-card stat-card--warning">' +
        '<div class="stat-label">Low Stock</div>' +
        '<div class="stat-value">' + lowStock + '</div>' +
        '<div class="stat-detail">Below ' + LOW_STOCK_THRESHOLD + ' units</div>' +
        '</div>' +
        '<div class="stat-card stat-card--danger">' +
        '<div class="stat-label">Expiry Alerts</div>' +
        '<div class="stat-value">' + expiryAlerts + '</div>' +
        '<div class="stat-detail">Expired or expiring soon</div>' +
        '</div>';
}

function renderRecentTable(medicines) {
    var tbody = document.getElementById("recentTableBody");
    if (!tbody) return;

    var recent = medicines.slice(-6).reverse();
    var html = "";

    for (var i = 0; i < recent.length; i++) {
        var med = recent[i];
        var status = getExpiryStatus(med.expiry);
        var isLow = med.quantity <= LOW_STOCK_THRESHOLD;
        var stockBadge = isLow
            ? '<span class="badge badge--danger">Low</span>'
            : '<span class="badge badge--success">OK</span>';
        html +=
            '<tr class="row-' + status + '">' +
            '<td>' + med.name + '</td>' +
            '<td><span class="mono">' + med.batch + '</span></td>' +
            '<td class="' + (isLow ? "qty-low" : "") + '">' + med.quantity + '</td>' +
            '<td>' + formatDate(med.expiry) + '</td>' +
            '<td>' + stockBadge + '</td>' +
            '</tr>';
    }

    tbody.innerHTML = html || '<tr><td colspan="5" class="empty-state">No medicines found.</td></tr>';
}

function renderLowStockAlerts(medicines) {
    var container = document.getElementById("lowStockAlerts");
    if (!container) return;

    var lowStock = [];
    for (var i = 0; i < medicines.length; i++) {
        if (medicines[i].quantity <= LOW_STOCK_THRESHOLD) {
            lowStock.push(medicines[i]);
        }
    }

    lowStock.sort(function (a, b) { return a.quantity - b.quantity; });

    if (lowStock.length === 0) {
        container.innerHTML = '<p class="no-alerts">All medicines are adequately stocked.</p>';
        return;
    }

    var html = "";
    for (var j = 0; j < lowStock.length; j++) {
        var med = lowStock[j];
        var level = med.quantity <= 5 ? "danger" : "warning";
        html +=
            '<div class="alert-item alert-item--' + level + '">' +
            '<div class="alert-name">' + med.name + '</div>' +
            '<div class="alert-meta">' + med.quantity + ' units remaining &ndash; Batch: ' + med.batch + '</div>' +
            '</div>';
    }

    container.innerHTML = html;
}

function initInventory() {
    var medicines = getMedicines();
    renderInventoryTable(medicines);
    var countEl = document.getElementById("inventoryCount");
    if (countEl) {
        countEl.textContent = medicines.length + " items";
    }
    initDispenseModal();
}

function initDispenseModal() {
    var overlay = document.getElementById("dispenseModal");
    var cancelBtn = document.getElementById("dispenseCancelBtn");
    if (!overlay || !cancelBtn) return;

    cancelBtn.addEventListener("click", function () {
        overlay.classList.remove("modal-open");
        document.getElementById("dispenseQty").value = "";
        document.getElementById("dispenseQtyError").textContent = "";
    });

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            overlay.classList.remove("modal-open");
            document.getElementById("dispenseQty").value = "";
            document.getElementById("dispenseQtyError").textContent = "";
        }
    });
}

function openDispenseModal(medicineId, medicineName, available) {
    var overlay = document.getElementById("dispenseModal");
    var nameEl = document.getElementById("dispenseMedicineName");
    var availEl = document.getElementById("dispenseAvailable");
    var confirmBtn = document.getElementById("dispenseConfirmBtn");
    var qtyInput = document.getElementById("dispenseQty");
    var qtyError = document.getElementById("dispenseQtyError");
    if (!overlay) return;

    nameEl.textContent = medicineName;
    availEl.textContent = available;
    qtyInput.value = "";
    qtyError.textContent = "";
    qtyInput.setAttribute("max", available);
    overlay.classList.add("modal-open");

    var newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);

    newConfirm.addEventListener("click", function () {
        var qtyStr = document.getElementById("dispenseQty").value.trim();
        var errEl = document.getElementById("dispenseQtyError");
        var qty = parseInt(qtyStr, 10);

        if (!qtyStr || isNaN(qty) || qty <= 0) {
            errEl.textContent = "Enter a valid quantity greater than 0.";
            return;
        }
        if (qty > available) {
            errEl.textContent = "Cannot dispense more than available stock (" + available + " units).";
            return;
        }

        var medicines = getMedicines();
        for (var i = 0; i < medicines.length; i++) {
            if (medicines[i].id === medicineId) {
                medicines[i].quantity = medicines[i].quantity - qty;
                break;
            }
        }
        saveMedicines(medicines);
        overlay.classList.remove("modal-open");
        document.getElementById("dispenseQty").value = "";
        errEl.textContent = "";
        initInventory();
    });
}

function renderInventoryTable(medicines) {
    var tbody = document.getElementById("inventoryTableBody");
    if (!tbody) return;

    if (medicines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No medicines in inventory. <a href="add.html">Add one now.</a></td></tr>';
        return;
    }

    var html = "";
    for (var i = 0; i < medicines.length; i++) {
        var med = medicines[i];
        var status = getExpiryStatus(med.expiry);
        var isLow = med.quantity <= LOW_STOCK_THRESHOLD;
        var stockBadge = isLow
            ? '<span class="badge badge--danger">Low Stock</span>'
            : '<span class="badge badge--success">Adequate</span>';
        var rowClass = "row-" + status + (isLow ? " row-low-stock" : "");
        var unitPrice = (med.unitPrice !== undefined && med.unitPrice !== null) ? med.unitPrice : 0;
        var totalValue = unitPrice * med.quantity;
        html +=
            '<tr class="' + rowClass + '" data-id="' + med.id + '">' +
            '<td>' + med.name + '</td>' +
            '<td><span class="mono">' + med.batch + '</span></td>' +
            '<td class="' + (isLow ? "qty-low" : "") + '">' + med.quantity + '</td>' +
            '<td>' + formatDate(med.expiry) + '</td>' +
            '<td>' + med.supplier + '</td>' +
            '<td class="price-cell">&#8377;' + unitPrice.toFixed(2) + '</td>' +
            '<td class="price-cell price-total">&#8377;' + totalValue.toFixed(2) + '</td>' +
            '<td>' + stockBadge + '</td>' +
            '<td class="action-cell">' +
            '<button class="btn-use" data-id="' + med.id + '" data-name="' + med.name + '" data-qty="' + med.quantity + '">Use</button>' +
            '<button class="btn-remove" data-id="' + med.id + '" data-name="' + med.name + '">Remove</button>' +
            '</td>' +
            '</tr>';
    }

    tbody.innerHTML = html;

    var useButtons = tbody.querySelectorAll(".btn-use");
    for (var j = 0; j < useButtons.length; j++) {
        useButtons[j].addEventListener("click", function () {
            var id = parseInt(this.getAttribute("data-id"), 10);
            var name = this.getAttribute("data-name");
            var qty = parseInt(this.getAttribute("data-qty"), 10);
            openDispenseModal(id, name, qty);
        });
    }

    var removeButtons = tbody.querySelectorAll(".btn-remove");
    for (var k = 0; k < removeButtons.length; k++) {
        removeButtons[k].addEventListener("click", function () {
            var id = parseInt(this.getAttribute("data-id"), 10);
            var name = this.getAttribute("data-name");
            openConfirmModal(id, name, function (confirmedId) {
                deleteMedicine(confirmedId);
                initInventory();
            });
        });
    }
}

function initAddMedicine() {
    var form = document.getElementById("addMedicineForm");
    var resetBtn = document.getElementById("resetFormBtn");
    var orderDateInput = document.getElementById("medOrderDate");

    if (orderDateInput) {
        orderDateInput.value = getTodayStr();
    }

    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            var form = document.getElementById("addMedicineForm");
            if (form) form.reset();
            var orderDateInput = document.getElementById("medOrderDate");
            if (orderDateInput) orderDateInput.value = getTodayStr();
            clearErrors();
            updateCostPreview();
        });
    }

    var qtyInput = document.getElementById("medQuantity");
    var priceInput = document.getElementById("medUnitPrice");
    if (qtyInput) qtyInput.addEventListener("input", updateCostPreview);
    if (priceInput) priceInput.addEventListener("input", updateCostPreview);

    renderSidebarSummary();
}

function updateCostPreview() {
    var qtyVal = document.getElementById("medQuantity").value.trim();
    var priceVal = document.getElementById("medUnitPrice").value.trim();
    var valueEl = document.getElementById("costPreviewValue");
    var detailEl = document.getElementById("costPreviewDetail");
    var previewBox = document.getElementById("costPreview");
    if (!valueEl || !detailEl) return;

    var qty = parseFloat(qtyVal);
    var price = parseFloat(priceVal);

    if (!isNaN(qty) && !isNaN(price) && qty >= 0 && price >= 0) {
        var total = qty * price;
        valueEl.textContent = "₹" + total.toFixed(2);
        detailEl.textContent = qty + " units x ₹" + price.toFixed(2) + " per unit";
        if (previewBox) previewBox.classList.add("cost-preview--active");
    } else {
        valueEl.textContent = "₹0.00";
        detailEl.textContent = "Enter quantity and unit price to calculate";
        if (previewBox) previewBox.classList.remove("cost-preview--active");
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    var name = document.getElementById("medName").value.trim();
    var batch = document.getElementById("medBatch").value.trim();
    var quantityStr = document.getElementById("medQuantity").value.trim();
    var expiry = document.getElementById("medExpiry").value.trim();
    var unitPriceStr = document.getElementById("medUnitPrice").value.trim();
    var orderDate = document.getElementById("medOrderDate").value.trim();
    var supplier = document.getElementById("medSupplier").value.trim();
    var contact = document.getElementById("medContact").value.trim();
    var email = document.getElementById("medEmail").value.trim();

    clearErrors();
    var valid = true;

    if (!name) {
        showError("medName", "Medicine name is required.");
        valid = false;
    }

    if (!batch) {
        showError("medBatch", "Batch number is required.");
        valid = false;
    }

    if (!quantityStr || isNaN(quantityStr) || parseInt(quantityStr, 10) < 0) {
        showError("medQuantity", "Enter a valid non-negative quantity.");
        valid = false;
    }

    if (!expiry) {
        showError("medExpiry", "Expiry date is required.");
        valid = false;
    }

    if (!unitPriceStr || isNaN(unitPriceStr) || parseFloat(unitPriceStr) < 0) {
        showError("medUnitPrice", "Enter a valid unit price (0 or more).");
        valid = false;
    }

    if (!orderDate) {
        showError("medOrderDate", "Order date is required.");
        valid = false;
    }

    if (!supplier) {
        showError("medSupplier", "Supplier name is required.");
        valid = false;
    }

    if (!contact) {
        showError("medContact", "Supplier contact is required.");
        valid = false;
    }

    if (!email) {
        showError("medEmail", "Supplier email is required.");
        valid = false;
    }

    if (!valid) return;

    var qty = parseInt(quantityStr, 10);
    var unitPrice = parseFloat(parseFloat(unitPriceStr).toFixed(2));

    var medicines = getMedicines();
    var newMedicine = {
        id: Date.now(),
        name: name,
        batch: batch,
        quantity: qty,
        expiry: expiry,
        unitPrice: unitPrice,
        orderDate: orderDate,
        supplier: supplier,
        contact: contact,
        email: email
    };

    medicines.push(newMedicine);
    saveMedicines(medicines);

    var form = document.getElementById("addMedicineForm");
    if (form) form.reset();
    clearErrors();
    updateCostPreview();
    showSuccessBanner();
    renderSidebarSummary();
}

function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    if (field) {
        field.classList.add("input-error");
    }
    var errorEl = document.getElementById(fieldId + "Error");
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearErrors() {
    var errorInputs = document.querySelectorAll(".input-error");
    for (var i = 0; i < errorInputs.length; i++) {
        errorInputs[i].classList.remove("input-error");
    }
    var errorMsgs = document.querySelectorAll(".error-msg");
    for (var j = 0; j < errorMsgs.length; j++) {
        errorMsgs[j].textContent = "";
    }
}

function showSuccessBanner() {
    var msg = document.getElementById("successMessage");
    if (msg) {
        msg.classList.add("visible");
        setTimeout(function () {
            msg.classList.remove("visible");
        }, 4000);
    }
}

function renderSidebarSummary() {
    var container = document.getElementById("sidebarSummary");
    if (!container) return;

    var medicines = getMedicines();
    var total = medicines.length;
    var lowStock = 0;
    var expired = 0;

    for (var i = 0; i < medicines.length; i++) {
        if (medicines[i].quantity <= LOW_STOCK_THRESHOLD) lowStock++;
        if (getExpiryStatus(medicines[i].expiry) === "expired") expired++;
    }

    container.innerHTML =
        '<div class="sidebar-stat">' +
        '<span class="sidebar-stat-label">Total Medicines</span>' +
        '<span class="sidebar-stat-value">' + total + '</span>' +
        '</div>' +
        '<div class="sidebar-stat">' +
        '<span class="sidebar-stat-label">Low Stock Items</span>' +
        '<span class="sidebar-stat-value">' + lowStock + '</span>' +
        '</div>' +
        '<div class="sidebar-stat">' +
        '<span class="sidebar-stat-label">Expired Items</span>' +
        '<span class="sidebar-stat-value">' + expired + '</span>' +
        '</div>';
}

function initAlerts() {
    var medicines = getMedicines();
    renderAlertsSummary(medicines);
    renderAlertsTable(medicines);
}

function renderAlertsSummary(medicines) {
    var container = document.getElementById("alertsSummary");
    if (!container) return;

    var expired = 0;
    var nearExpiry = 0;
    var safe = 0;

    for (var i = 0; i < medicines.length; i++) {
        var status = getExpiryStatus(medicines[i].expiry);
        if (status === "expired") expired++;
        else if (status === "near-expiry") nearExpiry++;
        else safe++;
    }

    container.innerHTML =
        '<div class="stat-card stat-card--danger">' +
        '<div class="stat-label">Expired</div>' +
        '<div class="stat-value">' + expired + '</div>' +
        '<div class="stat-detail">Remove from stock</div>' +
        '</div>' +
        '<div class="stat-card stat-card--warning">' +
        '<div class="stat-label">Near Expiry</div>' +
        '<div class="stat-value">' + nearExpiry + '</div>' +
        '<div class="stat-detail">Within ' + NEAR_EXPIRY_DAYS + ' days</div>' +
        '</div>' +
        '<div class="stat-card stat-card--success">' +
        '<div class="stat-label">Safe</div>' +
        '<div class="stat-value">' + safe + '</div>' +
        '<div class="stat-detail">More than 30 days</div>' +
        '</div>';
}

function renderAlertsTable(medicines) {
    var tbody = document.getElementById("alertsTableBody");
    if (!tbody) return;

    var sorted = medicines.slice();
    sorted.sort(function (a, b) {
        return new Date(a.expiry) - new Date(b.expiry);
    });

    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No medicines found.</td></tr>';
        return;
    }

    var html = "";
    for (var i = 0; i < sorted.length; i++) {
        var med = sorted[i];
        var status = getExpiryStatus(med.expiry);
        var days = getDaysUntilExpiry(med.expiry);
        var daysText;

        if (days < 0) {
            daysText = "Expired " + Math.abs(days) + " day" + (Math.abs(days) === 1 ? "" : "s") + " ago";
        } else if (days === 0) {
            daysText = "Expires today";
        } else {
            daysText = days + " day" + (days === 1 ? "" : "s") + " remaining";
        }

        var badgeClass = status === "expired" ? "badge--danger" : status === "near-expiry" ? "badge--warning" : "badge--success";
        var statusLabel = status === "expired" ? "Expired" : status === "near-expiry" ? "Near Expiry" : "Safe";

        html +=
            '<tr class="row-' + status + '" data-id="' + med.id + '">' +
            '<td>' + med.name + '</td>' +
            '<td><span class="mono">' + med.batch + '</span></td>' +
            '<td>' + med.quantity + '</td>' +
            '<td>' + formatDate(med.expiry) + '</td>' +
            '<td>' + daysText + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + statusLabel + '</span></td>' +
            '<td><button class="btn-remove" data-id="' + med.id + '" data-name="' + med.name + '">Remove</button></td>' +
            '</tr>';
    }

    tbody.innerHTML = html;

    var removeButtons = tbody.querySelectorAll(".btn-remove");
    for (var j = 0; j < removeButtons.length; j++) {
        removeButtons[j].addEventListener("click", function () {
            var id = parseInt(this.getAttribute("data-id"), 10);
            var name = this.getAttribute("data-name");
            openConfirmModal(id, name, function (confirmedId) {
                deleteMedicine(confirmedId);
                initAlerts();
            });
        });
    }
}

function initSuppliers() {
    var medicines = getMedicines();
    var contactDir = getSuppliers();
    var supplierMap = buildSupplierMap(medicines, contactDir);
    renderSupplierStats(supplierMap);
    renderSuppliersTable(supplierMap);
    renderPurchaseHistory(medicines);
}

function buildSupplierMap(medicines, contactDir) {
    var map = {};

    for (var i = 0; i < contactDir.length; i++) {
        var s = contactDir[i];
        map[s.name] = {
            name: s.name,
            contact: s.contact,
            email: s.email,
            medicines: [],
            totalSpend: 0,
            orderCount: 0
        };
    }

    for (var j = 0; j < medicines.length; j++) {
        var med = medicines[j];
        var sName = med.supplier;
        if (!map[sName]) {
            map[sName] = {
                name: sName,
                contact: med.contact || "N/A",
                email: med.email || "N/A",
                medicines: [],
                totalSpend: 0,
                orderCount: 0
            };
        } else {
            if (map[sName].email === "N/A" && med.email) {
                map[sName].email = med.email;
            }
            if (map[sName].contact === "N/A" && med.contact) {
                map[sName].contact = med.contact;
            }
        }
        if (map[sName].medicines.indexOf(med.name) === -1) {
            map[sName].medicines.push(med.name);
        }
        var unitPrice = med.unitPrice || 0;
        map[sName].totalSpend += unitPrice * med.quantity;
        map[sName].orderCount += 1;
    }

    return map;
}

function renderSupplierStats(supplierMap) {
    var container = document.getElementById("supplierStats");
    if (!container) return;

    var totalSuppliers = Object.keys(supplierMap).length;
    var totalOrders = 0;
    var totalSpend = 0;

    for (var name in supplierMap) {
        totalOrders += supplierMap[name].orderCount;
        totalSpend += supplierMap[name].totalSpend;
    }

    container.innerHTML =
        '<div class="stat-card">' +
        '<div class="stat-label">Total Suppliers</div>' +
        '<div class="stat-value">' + totalSuppliers + '</div>' +
        '<div class="stat-detail">Active suppliers</div>' +
        '</div>' +
        '<div class="stat-card stat-card--warning">' +
        '<div class="stat-label">Medicine Lines</div>' +
        '<div class="stat-value">' + totalOrders + '</div>' +
        '<div class="stat-detail">Procurement records</div>' +
        '</div>' +
        '<div class="stat-card stat-card--success">' +
        '<div class="stat-label">Total Inventory Value</div>' +
        '<div class="stat-value">&#8377;' + totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>' +
        '<div class="stat-detail">Based on unit price x qty</div>' +
        '</div>';
}

function renderSuppliersTable(supplierMap) {
    var tbody = document.getElementById("suppliersTableBody");
    if (!tbody) return;

    var html = "";
    for (var name in supplierMap) {
        var s = supplierMap[name];
        var emailCell = s.email !== "N/A"
            ? '<a href="mailto:' + s.email + '" class="email-link">' + s.email + '</a>'
            : '<span class="text-muted">N/A</span>';
        var spendCell = '&#8377;' + s.totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        html +=
            '<tr>' +
            '<td><strong>' + s.name + '</strong></td>' +
            '<td><span class="mono">' + s.contact + '</span></td>' +
            '<td>' + emailCell + '</td>' +
            '<td>' + (s.medicines.length > 0 ? s.medicines.join(", ") : "None on record") + '</td>' +
            '<td class="price-total">' + spendCell + '</td>' +
            '</tr>';
    }

    tbody.innerHTML = html || '<tr><td colspan="5" class="empty-state">No suppliers found.</td></tr>';
}

function renderPurchaseHistory(medicines) {
    var tbody = document.getElementById("purchaseTableBody");
    if (!tbody) return;

    var rows = medicines.slice();
    rows.sort(function (a, b) {
        var dateA = a.orderDate ? new Date(a.orderDate) : new Date(0);
        var dateB = b.orderDate ? new Date(b.orderDate) : new Date(0);
        return dateB - dateA;
    });

    if (rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No purchase history found.</td></tr>';
        return;
    }

    var html = "";
    for (var i = 0; i < rows.length; i++) {
        var med = rows[i];
        var unitPrice = med.unitPrice || 0;
        var totalCost = unitPrice * med.quantity;
        var dateStr = med.orderDate ? formatDate(med.orderDate) : "N/A";
        html +=
            '<tr>' +
            '<td>' + dateStr + '</td>' +
            '<td>' + med.supplier + '</td>' +
            '<td>' + med.name + '</td>' +
            '<td>' + med.quantity + ' units</td>' +
            '<td class="price-cell">&#8377;' + unitPrice.toFixed(2) + '</td>' +
            '<td class="price-cell price-total">&#8377;' + totalCost.toFixed(2) + '</td>' +
            '</tr>';
    }

    tbody.innerHTML = html;
}

function getCurrentPage() {
    var path = window.location.pathname;
    var parts = path.split("/");
    var filename = parts[parts.length - 1];
    if (!filename || filename === "") {
        return "index.html";
    }
    return filename;
}

document.addEventListener("DOMContentLoaded", function () {
    setActiveNavLink();
    initNavToggle();

    var page = getCurrentPage();

    if (page === "index.html" || page === "") {
        initDashboard();
    } else if (page === "inventory.html") {
        initInventory();
    } else if (page === "add.html") {
        initAddMedicine();
    } else if (page === "alerts.html") {
        initAlerts();
    } else if (page === "suppliers.html") {
        initSuppliers();
    }
});
