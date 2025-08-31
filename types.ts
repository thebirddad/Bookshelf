// types.ts
export type BookStatus = 'Bag' | 'Nightstand' | 'Shelf';

export type Book = {
  id: string;  // unique ID for each book
  title: string;
  author: string;
  status: BookStatus;
  dateAdded?: string;
  dateStarted?: string;
  dateCompleted?: string;
  rating?: number; // optional field to store user rating (1-5)
  totalPages?: number; // optional field to store total pages in the book
  pagesRead?: number; // optional field to store number of pages read
  notes?: string; // optional field to store user notes about the book
  isbn?: string; // optional field to store ISBN number
  keywords?: string[]; // optional field to store keywords/tags associated with the book
  coverImageUrl?: string; // optional field to store URL of the book cover image
  synopsis?: string; // optional field to store a brief synopsis of the book
  releaseDate?: string; // optional field to store the book's release date
  publisher?: string; // optional field to store the book's publisher
  genre?: string; // optional field to store the book's genre
  language?: string; // optional field to store the book's language
};

export type BagSkin = {
  id: string;          // unique identifier for the skin
  name: string;        // display name (e.g., "Starting Bag", "Green Bag", "Branded Bag")
  color?: string;      // hex code or named color
  imageUrl?: string;   // optional image representing the skin
  requiredXP?: number; // optional XP threshold to unlock this skin
  unlocked?: boolean;  // whether the user has unlocked this skin
};

export type Bag = {
  id: string;
  name: string;
  dateCreated: string;
  books: Book[];
  currentSkin: BagSkin;     // the skin currently applied to this bag
  unlockedSkins?: BagSkin[]; // all skins the user has unlocked for this bag
};

export type NightStandSkin = {
  id: string;          // unique identifier for the skin
  name: string;        // display name (e.g., "Starting Nightstand", "Wooden Nightstand", "Modern Nightstand")
  color?: string;      // hex code or named color
  imageUrl?: string;   // optional image representing the skin
  requiredXP?: number; // optional XP threshold to unlock this skin
  unlocked?: boolean;  // whether the user has unlocked this skin
};

export type NightStand = {
    id: string; // unique ID for each nightstand entry
    name: string; // name of the nightstand
    dateCreated: string; // date when the nightstand was created
    books: Book[]; // array of books in the nightstand
}

export type ShelfSkin = {
  id: string;          // unique identifier for the skin
  name: string;        // display name (e.g., "Starting Shelf", "Classic Shelf", "Futuristic Shelf")       
  color?: string;      // hex code or named color
  imageUrl?: string;   // optional image representing the skin
  requiredXP?: number; // optional XP threshold to unlock this skin
  unlocked?: boolean;  // whether the user has unlocked this skin
};

export type Shelf = {
    id: string; // unique ID for each shelf entry
    name: string; // name of the shelf
    dateCreated: string; // date when the shelf was created
    books: Book[]; // array of books in the shelf
}

export type UserProfile = {
  username: string;
  avatarUrl?: string;
  bio?: string;

  // Stats & gamification
  experiencePoints: number;
  level: number;
  badges: string[];
  totalBooksRead: number;
  totalPagesRead: number;
  readingStreak: number;

  // Owned containers
  ownedBags: Bag[];
  ownedNightStands: NightStand[];
  ownedShelves: Shelf[];

  // Favorites
  favoriteBook?: Book;
  favoriteAuthor?: string;
  favoriteBagId?: string;        // reference to one of ownedBags
  favoriteNightStandId?: string; // reference to one of ownedNightStands
  favoriteShelfId?: string;      // reference to one of ownedShelves

  // Preferences
  favoriteGenres: string[];
  preferredLanguages: string[];

  // Skins unlocked globally
  ownedSkins: {
    bagSkins: BagSkin[];
    nightStandSkins: NightStandSkin[];
    shelfSkins: ShelfSkin[];
  };
};


export type genre =
  | 'Fantasy'  
    | 'Science Fiction'
    | 'Mystery'
    | 'Thriller'
    | 'Romance'
    | 'Horror'
    | 'Historical Fiction'
    | 'Non-Fiction'
    | 'Biography'
    | 'Self-Help'
    | 'Health & Wellness'
    | 'Travel'
    | 'Children\'s'
    | 'Young Adult'
    | 'Classics'
    | 'Graphic Novels'
    | 'Poetry'
    | 'Religion & Spirituality'
    | 'Science & Technology'
    | 'Art & Photography'
    | 'Cookbooks'
    | 'Business & Economics'
    | 'Politics & Social Sciences'
    | 'Education'
    | 'Comics & Humor'
    | 'Drama'
    | 'Short Stories'
    | 'Anthologies'
    | 'Dystopian'
    | 'Adventure'
    | 'Western' 
    | 'Memoir'
    | 'True Crime'
    | 'Philosophy'
    | 'Psychology'
    | 'Environment'
    | 'Parenting'
    | 'Crafts & Hobbies'
    | 'Sports & Recreation'
    | 'Music'
    | 'Film & Television'
    | 'LGBTQ+'
    | 'Cultural Studies'
    | 'Mythology'
    | 'Folklore'
    | 'Other';
