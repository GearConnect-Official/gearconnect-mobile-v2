import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { getEventById, joinEvent } from '@/services/api/eventService';
import type { Event } from '@/types/event.types';
import { getCurrentUser } from '@/services/api/postService';


export function useEventDetail(id: string) {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const { getToken } = useAuth();
    const isAlreadyJoined = currentUserId !== null
    ? (event?.participantIds.includes(currentUserId) ?? false)
    : false;

    useEffect(() => {
        async function fetchEvent(){
            const token = await getToken();
            if (token){
                const me = await getCurrentUser(token);
                setCurrentUserId(me.id);
            }
            const data = await getEventById(id);
            setEvent(data);
            setIsLoading(false)
        }
        fetchEvent();

    }, [id]);

    async function join(){
        const token = await getToken();
        if (!token) return;
        setIsJoining(true);
        await joinEvent(id, token);
        setEvent((prev) =>
        prev && currentUserId
        ? { ...prev, participantIds: [...prev.participantIds, currentUserId]} : prev
        );
        setIsJoining(false);
    }


    return { event, isLoading, join, isJoining, isAlreadyJoined }
}