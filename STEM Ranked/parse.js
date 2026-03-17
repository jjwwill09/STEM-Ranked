const CATEGORY_MAP = {
  Overall: "overall",
  Math: "math",
  Science: "science",
  "Computer Science": "cs",
  "Weighted GPA": "gpa",
  Certificates: "certificates",
  "Extra Curricular's": "extra",
};

let students = [];

async function loadData() {
  const response = await fetch("data/Category_History.html");
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const rows = doc.querySelectorAll("tbody tr");

  rows.forEach((row, index) => {
    if (index === 0) return;

    const cells = row.querySelectorAll("td");
    if (cells.length === 0) return;

    students.push({
      id: cells[0].innerText.trim(),
      grade: parseFloat(cells[1].innerText),
      last: cells[2].innerText.trim(),
      first: cells[3].innerText.trim(),
      math: parseFloat(cells[4].innerText),
      science: parseFloat(cells[5].innerText),
      cs: parseFloat(cells[6].innerText),
      gpa: parseFloat(cells[7].innerText),
      certificates: parseFloat(cells[8].innerText),
      extra: parseFloat(cells[9].innerText),
      profile: cells[13].querySelector("img")?.getAttribute("src") || null,
    });
  });

  renderCategory("Overall");
}

function calculateOverall(student) {
  return (
    (student.math +
      student.science +
      student.cs +
      student.gpa +
      student.certificates +
      student.extra) /
    6
  );
}

function formatTier(value) {
  if (Number.isInteger(value)) {
    return `High Tier ${value}`;
  } else {
    return `Low Tier ${Math.floor(value)}`;
  }
}

function renderCategory(categoryName) {
  const key = CATEGORY_MAP[categoryName];
  const container = document.getElementById("rankingContainer");
  container.innerHTML = "";

  let sorted = [...students];

  sorted.sort((a, b) => {
    const valA = key === "overall" ? calculateOverall(a) : a[key];
    const valB = key === "overall" ? calculateOverall(b) : b[key];
    return valA - valB;
  });

  sorted.forEach((student, index) => {
    const value = key === "overall" ? calculateOverall(student) : student[key];

    const rankDiv = document.createElement("div");
    rankDiv.className = "rank";

    const card = document.createElement("div");
    card.className = "card";

    const rankNumber = document.createElement("span");
    rankNumber.className = "rank_number";
    rankNumber.innerText = `${index + 1}.`;

    const profileImg = document.createElement("img");
    profileImg.className = "profile_picture";
    profileImg.src = student.profile || "assets/default_profile.png";

    const name = document.createElement("span");
    name.className = "student_name";
    name.innerText = `${student.first} ${student.last}`;

    const tierBox = document.createElement("div");
    tierBox.className = "tier_box";
    tierBox.innerText = formatTier(value);

    const icon = document.createElement("img");
    icon.className = "assets/category_icons/category_icon";
    icon.src = `assets/category_icons/${key}_icon.png`;
    
    icon.style.width = '20px';
    icon.style.height = '20px';

    rankDiv.appendChild(card);
    card.appendChild(rankNumber);
    card.appendChild(profileImg);
    rankDiv.appendChild(name);
    rankDiv.appendChild(tierBox);
    tierBox.appendChild(icon);

    container.appendChild(rankDiv);
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    renderCategory(tab.innerText.trim());
  });
});

loadData();
