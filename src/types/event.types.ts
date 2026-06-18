export type Event = {
    id: string;
    title: string;
    description: string;
    location: {
        name: string;
        latitude: number;
        longitude: number;
    };
    date: string;
    organizerId: string;
    participantIds: number[];
}