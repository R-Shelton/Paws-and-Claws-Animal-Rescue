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
 *   images      Photos as { src, alt }: the image path and alt text describing
 *               what the photo shows. The first is shown large, the rest are
 *               thumbnails. Name files <animal>-<description>-<n>.jpg.
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
        images: [
            { src: "images/milo-jack-russell-terrier-1.jpg", alt: "Milo, a brown and white Jack Russell terrier, bounding across a grassy field" },
            { src: "images/milo-jack-russell-terrier-2.jpg", alt: "Milo, a brown and white Jack Russell terrier, trotting through long grass" },
            { src: "images/milo-jack-russell-terrier-3.jpg", alt: "Milo, a brown and white Jack Russell terrier, leaping through the air above short grass" },
        ],
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
        images: [
            { src: "images/nova-tabby-and-white-cat-1.jpg", alt: "Nova, a tabby and white cat, perched on a tree stump in autumn woodland" },
            { src: "images/nova-tabby-and-white-cat-2.jpg", alt: "Nova, a tabby and white cat, crouching on a fallen log among yellow autumn leaves" },
            { src: "images/nova-tabby-and-white-cat-3.jpg", alt: "Nova, a tabby and white cat, climbing along a pine branch with one white paw raised" },
        ],
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
        images: [
            { src: "images/rex-grey-scottish-fold-cat-1.jpg", alt: "Rex, a grey Scottish Fold cat, relaxing upside down in a cardboard box" },
            { src: "images/rex-grey-scottish-fold-cat-2.jpg", alt: "Rex, a grey Scottish Fold cat, peering over the edge of a dark blue cardboard box" },
            { src: "images/rex-grey-scottish-fold-cat-3.jpg", alt: "Rex, a grey Scottish Fold cat, lying in a cardboard box with a paw raised by its face" },
        ],
        temperament: ["Calm", "Gentle", "Loves Naps"],
    },
];
