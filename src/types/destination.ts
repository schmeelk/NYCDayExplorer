export type Category = 'Nature' | 'Beach' | 'History' | 'Family' | 'Small Town';
export type Destination = {
  id: string;
  name: string;
  description: string;
  category: Category;
  travelTimeMinutes: number;
  estimatedCost: number;
  familyFriendlyScore: number;
  bestSeason: string;
  address: string;
  imageUrl: string;
};
