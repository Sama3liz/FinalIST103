/* Array for store and sort data */
const packages = [];

/* Form handler */
document.getElementById("submitPackage").addEventListener("click", function () {
  const recipientName = document.getElementById("recipientName").value.trim();
  const packageId = document.getElementById("packageId").value.trim();
  const deliveryAddress = document
    .getElementById("deliveryAddress")
    .value.trim();
  const weight = document.getElementById("weight").value.trim();

  /* Clear previous alerts */
  clearAlerts();

  /* Form Validation */
  if (!/^[A-Za-z\s]+$/.test(recipientName)) {
    return showAlert("Recipient Name must contain only letters.", "danger");
  }
  if (!/^\d+$/.test(packageId)) {
    return showAlert("Package ID must be numeric.", "danger");
  }
  if (deliveryAddress === "" || !/^[a-zA-Z0-9]+$/.test(deliveryAddress)) {
    return showAlert(
      "Delivery Address must be non-empty and must contain only letters and numbers.",
      "danger"
    );
  }
  if (isNaN(weight) || weight <= 0) {
    return showAlert("Weight must be a positive number.", "danger");
  }

  /* Tracking Code Generator */
  const trackingCode = generateTrackingCode(
    parseInt(packageId),
    parseFloat(weight)
  );

  /* Create the new object and add to the array */
  const packageData = {
    recipientName,
    packageId,
    deliveryAddress,
    weight,
    trackingCode,
  };
  packages.push(packageData);
  showAlert("Package created successfully!", "success");

  /* Update Table and clean fields after submission */
  updatePackagesTable();
  document.getElementById("recipientName").value = "";
  document.getElementById("packageId").value = "";
  document.getElementById("deliveryAddress").value = "";
  document.getElementById("weight").value = "";
});

/* Function to generate binary tracking code using bitwise */
function generateTrackingCode(packageId, weight) {
  const weightInt = Math.floor(weight * 100);
  const trackingCode = (packageId << 4) | weightInt;
  return "0b" + trackingCode.toString(2);
}

/* Event listener for sort button */
document.getElementById("sortPackages").addEventListener("click", function () {
  packages.sort((a, b) => a.weight - b.weight);
  updatePackagesTable();
});

/* Function to update table */
function updatePackagesTable() {
  const tableBody = document.getElementById("packagesTableBody");
  tableBody.innerHTML = "";
  packages.forEach((pkg) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pkg.recipientName}</td>
      <td>${pkg.packageId}</td>
      <td>${pkg.deliveryAddress}</td>
      <td>${pkg.weight}</td>
      <td>${pkg.trackingCode}</td>
    `;
    tableBody.appendChild(row);
  });
}

/* Function to display an alert */
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");
  const alertDiv = document.createElement("div");
  alertDiv.classList.add(
    "alert",
    `alert-${type}`,
    "alert-dismissible",
    "fade",
    "show"
  );
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    <strong>${type === "success" ? "Success!" : "Error!"}</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alertDiv);
}

/* Function to clear alerts */
function clearAlerts() {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = "";
}
