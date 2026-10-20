export interface EventItem {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  image: string;
  price: number;
}

export type NewEvent = Omit<EventItem, "id" | "image">;
