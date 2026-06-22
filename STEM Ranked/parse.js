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
    return `HT${value}`;
  } else {
    return `LT${Math.floor(value)}`;
  }
}

function calculatePoints(student) {
  return Math.round(100/student.math +
         100/student.science +
         100/student.cs +
         100/student.gpa +
         100/student.certificates +
         100/student.extra)
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
    profileImg.src =
      student.profile !== null
        ? `data/${student.profile}`
        : "assets/default_profile.jpg";

    const identifier = document.createElement("identifier");
    identifier.className = "identifier";

    const name = document.createElement("span");
    name.className = "student_name";
    name.innerText = `${student.first} ${student.last}`;

    const score = document.createElement("span");
    score.className = "student_score";
    score.innerText = `Score: ${calculatePoints(student)}`;

    const iconsWrapper = document.createElement("div");
    iconsWrapper.className = "icons_wrapper";
    iconsWrapper.style.gap = "10px";
    iconsWrapper.style.marginLeft = "auto";

    let categoriesToShow = [];
    if (key === "overall") {
      categoriesToShow = Object.keys(CATEGORY_MAP).filter(
        (cat) => CATEGORY_MAP[cat] !== "overall"
      );
    } else {
      categoriesToShow = [categoryName];
    }

    categoriesToShow.forEach((catName) => {
      const catKey = CATEGORY_MAP[catName];
      const catVal = student[catKey];

      const tierBox = document.createElement("div");
      tierBox.className = "tier_box";

      const tierLabel = document.createElement("div");
      tierLabel.className = "tier_label";
      tierLabel.innerText = formatTier(student[catKey]);

      const tierIcon = document.createElement("div");
      tierIcon.className = "tier_icon";

      const icon = document.createElement("img");
      icon.className = "category_icon";
      icon.src = `assets/category_icons/${catKey}_icon.png`;

      icon.style.width = "2vw";
      icon.style.height = "2vw";

      tierIcon.appendChild(icon);
      tierBox.appendChild(tierIcon);
      tierBox.appendChild(tierLabel);

      iconsWrapper.appendChild(tierBox);
    });

    rankDiv.appendChild(card);
    card.appendChild(rankNumber);
    card.appendChild(profileImg);

    rankDiv.appendChild(identifier);
    identifier.appendChild(name);
    identifier.appendChild(score);

    rankDiv.appendChild(iconsWrapper);
    container.appendChild(rankDiv);
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    renderCategory(tab.innerText.trim());
  });
});

loadData();
