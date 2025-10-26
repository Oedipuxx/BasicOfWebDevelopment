// index.js
// Author: Jude Ojeabulu
// Date: 2025-10-26
// Handles adding new course rows with day marks (✅/❌)

document.addEventListener("DOMContentLoaded", () => {
  const CHECK = "✅";
  const CROSS = "❌";

  // Automatically detect which days exist from the form checkboxes
  const dayOrder = Array.from(
    document.querySelectorAll('#addCourseForm input[name="day"]')
  ).map((cb) => cb.value);

  const form = document.getElementById("addCourseForm");
  const tableBody = document.querySelector("#timetable tbody");
  const courseInput = document.getElementById("courseName");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const courseName = courseInput.value.trim();
    if (!courseName) return;

    // Get checked days
    const checkedDays = new Set(
      Array.from(form.querySelectorAll('input[name="day"]:checked')).map(
        (cb) => cb.value
      )
    );

    // Create a new table row
    const row = document.createElement("tr");

    // Course name cell
    const nameCell = document.createElement("td");
    nameCell.textContent = courseName;
    row.appendChild(nameCell);

    // Loop through all days detected and create columns
    dayOrder.forEach((day) => {
      const cell = document.createElement("td");
      cell.textContent = checkedDays.has(day) ? CHECK : CROSS;
      cell.dataset.day = day;
      cell.className = "day-cell";
      row.appendChild(cell);
    });

    // Append row to the table
    tableBody.appendChild(row);

    // Reset form and refocus input
    form.reset();
    courseInput.focus();
  });
});
