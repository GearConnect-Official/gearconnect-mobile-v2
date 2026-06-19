export type Event = {
  id: number;
  name: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  organizerId: string;
  participantIds: number[];
};
