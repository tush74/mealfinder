const search = document.querySelector(".search");
const workplace = document.querySelector(".workplace");
const favButton = document.querySelector(".fav");
let favorites = [];

async function sbn(name) {
  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

function clearWorkplace() {
  while (workplace.firstChild) {
    workplace.removeChild(workplace.firstChild);
  }
}

function addDetails(meal, structure) {
  const details = document.createElement("div");
  details.classList.add("details");

  details.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <p><strong>Ingredients:</strong></p>
        <ul>
            ${getIngredients(meal).join("")}
        </ul>
        <p><strong>Instructions:</strong></p>
        <p>${meal.strInstructions}</p>
        <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
    `;

  structure.appendChild(details);
}

function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`<li>${measure} ${ingredient}</li>`);
    }
  }
  return ingredients;
}

function toggleDetails(structure) {
  structure.classList.toggle("open");
}

function printondom(data) {
  clearWorkplace();
  for (let d of data.meals) {
    const structure = document.createElement("div");
    structure.classList.add("insideworkplace");
    workplace.appendChild(structure);

    const image = document.createElement("img");
    image.classList.add("image");
    image.src = d.strMealThumb;
    structure.appendChild(image);

    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = d.strMeal;
    structure.appendChild(name);

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("fav-button");
    favoriteButton.innerText = "Add to Favorites";
    structure.appendChild(favoriteButton);

    favoriteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      addFavorite(d);
    });

    structure.addEventListener("click", () => {
      toggleDetails(structure);
      addDetails(d, structure);
    });
  }
}

function addFavorite(meal) {
  favorites.push(meal);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function displayFavorites() {
  clearWorkplace();
  for (let favorite of favorites) {
    const structure = document.createElement("div");
    structure.classList.add("insideworkplace");
    workplace.appendChild(structure);

    const image = document.createElement("img");
    image.classList.add("image");
    image.src = favorite.strMealThumb;
    structure.appendChild(image);

    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = favorite.strMeal;
    structure.appendChild(name);

    structure.addEventListener("click", () => {
      toggleDetails(structure);
      addDetails(favorite, structure);
    });
  }
}

favButton.addEventListener("click", () => {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  displayFavorites();
});

search.addEventListener("input", async (e) => {
  const text = e.target.value.trim();
  if (text === "") {
    clearWorkplace();
    return;
  }

  const data = await sbn(text);
  printondom(data);
});
function toggleFavorite(meal, btn) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const mealIndex = favorites.findIndex((fav) => fav.idMeal === meal.idMeal);

  if (mealIndex === -1) {
    favorites.push(meal);
    btn.classList.add("favorited");
  } else {
    favorites.splice(mealIndex, 1);
    btn.classList.remove("favorited");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function printondom(data) {
  clearWorkplace();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  for (let d of data.meals) {
    const structure = document.createElement("div");
    structure.classList.add("insideworkplace");
    workplace.appendChild(structure);

    const image = document.createElement("img");
    image.classList.add("image");
    image.src = d.strMealThumb;
    structure.appendChild(image);

    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = d.strMeal;
    structure.appendChild(name);

    const favoriteBtn = document.createElement("button");
    favoriteBtn.classList.add("favorite-btn");
    favoriteBtn.innerHTML = "&#10084;";
    if (favorites.some((fav) => fav.idMeal === d.idMeal)) {
      favoriteBtn.classList.add("favorited");
    }
    structure.appendChild(favoriteBtn);

    favoriteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(d, favoriteBtn);
    });

    structure.addEventListener("click", () => {
      toggleDetails(structure);
      addDetails(d, structure);
    });
  }
}

document.querySelector(".fav").addEventListener("click", () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  printondom({ meals: favorites });
});
