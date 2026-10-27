/**
 * Animal detail page (animaldetail.html).
 *
 * Reads the animal's id from the query string (animaldetail.html?id=2, set by
 * the "View Details" links on animals.html), looks it up in ANIMALS and fills
 * in the page: photo gallery, name, tags, price, condition and temperament.
 * An unknown or missing id shows a "not found" message instead.
 *
 * Requires JS/animals-data.js (global `ANIMALS`) to be loaded first.
 */

/**
 * Finds the animal for the raw `id` query-string value.
 *
 * Only plain digits are accepted, so "", "1abc" and "1.5" don't slip through
 * Number() as 0 or a partial match.
 *
 * @param {string|null} rawId The `id` parameter, or null if absent.
 * @returns {object|undefined} The matching animal, or undefined.
 */
function findAnimal(rawId) {
    if (rawId === null || !/^\d+$/.test(rawId)) {
        return undefined;
    }
    return ANIMALS.find((animal) => animal.id === Number(rawId));
}

/**
 * Formats a rand amount the way the site shows prices: "R1 500.00".
 * Done by hand because Intl's South African locale uses a decimal comma.
 *
 * @param {number} price Amount in rand.
 * @returns {string}
 */
function formatPrice(price) {
    return "R" + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Shows the first photo large and builds one thumbnail button per photo.
 * Clicking a thumbnail swaps it into the large view.
 */
function renderGallery(animal) {
    const mainImage = document.getElementById("animal-main-image");
    const thumbnails = document.getElementById("animal-thumbnails");
    const total = animal.images.length;
    const buttons = [];

    function showPhoto(index) {
        mainImage.src = animal.images[index];
        mainImage.alt = `${animal.name}, photo ${index + 1} of ${total}`;
        // aria-pressed is the single source of truth: the CSS highlights the
        // pressed thumbnail and assistive tech announces which one is showing.
        buttons.forEach((button, i) => {
            button.setAttribute("aria-pressed", String(i === index));
        });
    }

    animal.images.forEach((src, index) => {
        // A button, not a bare <img>, so keyboard users can switch photos too.
        const button = document.createElement("button");
        button.type = "button";
        button.className = "curtain-button";
        button.setAttribute("aria-label", `Show photo ${index + 1} of ${total}`);

        const image = document.createElement("img");
        image.className = "curtain-image";
        image.src = src;
        image.alt = "";
        button.append(image);

        button.addEventListener("click", () => showPhoto(index));
        buttons.push(button);
    });

    thumbnails.replaceChildren(...buttons);
    showPhoto(0);
}

function renderTemperament(animal) {
    const bubbles = animal.temperament.map((trait) => {
        const bubble = document.createElement("div");
        bubble.className = "descriptor-bubble";
        bubble.textContent = trait;
        return bubble;
    });
    document.getElementById("animal-temperament").replaceChildren(...bubbles);
}

function initAnimalDetailPage() {
    const detail = document.getElementById("animal-detail");
    const notFound = document.getElementById("animal-not-found");
    if (!detail || !notFound) {
        return;
    }

    const animal = findAnimal(new URLSearchParams(window.location.search).get("id"));
    if (!animal) {
        notFound.hidden = false;
        return;
    }

    document.title = `${animal.name} - Paws and Claws Animal Rescue`;

    // textContent (not innerHTML) throughout, so data is never parsed as markup.
    document.getElementById("animal-name").textContent = animal.name;
    document.getElementById("animal-species").textContent = animal.species;
    document.getElementById("animal-gender").textContent = animal.gender;
    document.getElementById("animal-age").textContent = animal.age;
    document.getElementById("animal-price").textContent = formatPrice(animal.price);
    document.getElementById("animal-condition").textContent = animal.condition;

    renderGallery(animal);
    renderTemperament(animal);

    detail.hidden = false;
}

document.addEventListener("DOMContentLoaded", initAnimalDetailPage);
