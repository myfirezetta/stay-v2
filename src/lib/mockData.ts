export interface Cat {
  id: string;
  name: string;
  behavior: string;
  pros: string[];
  cons: string[];
  history: string;
  imageUrl: string;
}

export interface Expo {
  id: string;
  name: string;
  date: string;
  venue: string;
  shelters: string[];
}

export const mockCats: Cat[] = [
  {
    id: "1",
    name: "Luna",
    behavior: "Playful and energetic",
    pros: ["Great with kids", "Loves to cuddle"],
    cons: ["Needs lots of playtime", "Can be vocal at night"],
    history: "Rescued from a local park as a kitten. She has been fostering for 3 months.",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Oliver",
    behavior: "Calm and observant",
    pros: ["Very low maintenance", "Litter box trained perfectly"],
    cons: ["Shy around strangers initially"],
    history: "Surrendered by previous owner who moved abroad.",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Milo",
    behavior: "Affectionate lap cat",
    pros: ["Incredibly sweet", "Gets along with dogs"],
    cons: ["Prone to overeating if free-fed"],
    history: "Found wandering near a supermarket. Now fully vaccinated and ready for a home.",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    name: "Bella",
    behavior: "Curious and adventurous",
    pros: ["Entertains herself", "Very intelligent"],
    cons: ["Might try to escape through open doors"],
    history: "A former stray who learned to trust humans after weeks of patience.",
    imageUrl: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    name: "Shadow",
    behavior: "Independent and stealthy",
    pros: ["Very quiet", "Self-sufficient"],
    cons: ["Not a lap cat", "Hides when visitors arrive"],
    history: "Found hiding in a garage during a storm.",
    imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    name: "Ginger",
    behavior: "Extremely vocal and friendly",
    pros: ["Loves everyone", "Greets you at the door"],
    cons: ["Very loud meow", "Demands attention"],
    history: "Owner could no longer care for her due to allergies.",
    imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "7",
    name: "Simba",
    behavior: "Confident and majestic",
    pros: ["Great mouser", "Beautiful coat"],
    cons: ["Doesn't like being picked up"],
    history: "Rescued from an abandoned building.",
    imageUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "8",
    name: "Cleo",
    behavior: "Elegant and slightly aloof",
    pros: ["Very clean", "Gentle with toys"],
    cons: ["Picky eater", "Needs slow introductions"],
    history: "Lived with an elderly person who recently passed away.",
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "9",
    name: "Jasper",
    behavior: "Goofy and playful",
    pros: ["Loves chasing laser pointers", "Gets along with other cats"],
    cons: ["High energy at night"],
    history: "Brought to the shelter as a stray kitten.",
    imageUrl: "https://images.unsplash.com/photo-1501820488136-72669149e0d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "10",
    name: "Lily",
    behavior: "Sweet and timid",
    pros: ["Perfect lap cat", "Gentle purr"],
    cons: ["Easily startled by loud noises"],
    history: "Found in a cardboard box near a highway.",
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "11",
    name: "Max",
    behavior: "Laid back and lazy",
    pros: ["Sleeps all day", "Easy to handle"],
    cons: ["Prone to weight gain", "Sheds a lot"],
    history: "Surrendered because the previous family was moving.",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "12",
    name: "Chloe",
    behavior: "Sassy and bossy",
    pros: ["Very expressive", "Entertaining personality"],
    cons: ["Can be moody", "Swats if overstimulated"],
    history: "Found wandering the streets, very vocal about wanting food.",
    imageUrl: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "13",
    name: "Leo",
    behavior: "Adventurous explorer",
    pros: ["Curious about everything", "Loves harness walking"],
    cons: ["Will climb your curtains", "High prey drive"],
    history: "Rescued from a farm.",
    imageUrl: "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "14",
    name: "Mia",
    behavior: "Cuddly and attached",
    pros: ["Will follow you everywhere", "Loves belly rubs"],
    cons: ["Gets separation anxiety", "Very vocal when left alone"],
    history: "Returned to the shelter twice because she is 'too needy'. She just wants love!",
    imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80",
  }
];

export const mockExpos: Expo[] = [
  {
    id: "e1",
    name: "Spring Feline Festival",
    date: "May 15, 2026",
    venue: "Downtown Community Center",
    shelters: ["Happy Paws Rescue", "City Animal Shelter", "Whiskers Haven"]
  },
  {
    id: "e2",
    name: "Paws in the Park Expo",
    date: "June 22, 2026",
    venue: "Riverside Park Pavilion",
    shelters: ["Feline Friends", "Second Chance Pets"]
  }
];
