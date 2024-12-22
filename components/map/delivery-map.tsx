'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface DeliveryMapProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
}

export function DeliveryMap({
    center = [4.8945, 52.3667], // Default to Amsterdam
    zoom = 12,
    className = 'w-full h-[600px]'
}: DeliveryMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: center,
            zoom: zoom
        });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl());

        // Cleanup on unmount
        return () => {
            map.current?.remove();
        };
    }, []);

    return (
        <div ref={mapContainer} className={className} />
    );
} 