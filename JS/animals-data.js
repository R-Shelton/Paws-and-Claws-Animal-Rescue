/**
 * Animal data for the shelter (shared by the pages that show animals).
 *
 * A plain script that defines the global `ANIMALS` array, rather than a JSON
 * file loaded with fetch(), so the site also works when opened straight from
 * disk (file://), where fetch() of a local file is blocked by CORS.
 *
 * Each animal:
 *   id          Unique number. animals.html links to animaldetail.html?id=<id>.
 *   name        Display name.
 *   species     "Dog" or "Cat".
 *   gender      "Male" or "Female".
 *   age         Display text, e.g. "2 years".
 *   price       Adoption fee in rand, as a number.
 *   condition   Health note shown beside the price.
 *   images      Image paths; the first is shown large, the rest are thumbnails.
 *   temperament Short tags describing the animal's personality.
 */
const ANIMALS = [
    {
        id: 1,
        name: "Milo",
        species: "Dog",
        gender: "Male",
        age: "2 years",
        price: 1500,
        condition: "Vaccinated & Neutered.",
        images: ["images/milo_1.jpg", "images/milo_2.jpg", "images/milo_3.jpg"],
        temperament: ["Playful", "Loving", "Good w/ Kids"],
    },
    {
        id: 2,
        name: "Nova",
        species: "Cat",
        gender: "Female",
        age: "1 year",
        price: 1200,
        condition: "Vaccinated & Spayed.",
        images: ["images/nova_1.jpg", "images/nova_2.jpg", "images/nova_3.jpg"],
        temperament: ["Friendly", "Cuddly", "Playful"],
    },
    {
        id: 3,
        name: "Rex",
        species: "Cat",
        gender: "Male",
        age: "5 years",
        price: 800,
        condition: "Vaccinated & Neutered.",
        images: ["images/rex_1.jpg", "images/rex_2.jpg", "images/rex_3.jpg"],
        temperament: ["Calm", "Gentle", "Loves Naps"],
    },
];
