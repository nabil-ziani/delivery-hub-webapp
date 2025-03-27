'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Delivery {
    id: string;
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';
    address: string;
    lat: number;
    lng: number;
}

interface DeliveryMapProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    deliveries?: Delivery[];
    restaurantLocation?: [number, number];
    onMarkerClick?: (delivery: Delivery) => void;
}

export function DeliveryMap({
    center = [51.1956911106278, 4.4442623485511], // Default to Nacho's Antwerp location
    zoom = 12,
    className = 'w-full h-[600px]',
    deliveries = [],
    restaurantLocation = center,
    onMarkerClick
}: DeliveryMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markers = useRef<maplibregl.Marker[]>([]);
    const routeSource = useRef<string | null>(null);

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

        // Add restaurant marker
        new maplibregl.Marker({ color: '#F31260' })
            .setLngLat(restaurantLocation)
            .setPopup(new maplibregl.Popup().setHTML('<h3 class="font-bold">Restaurant</h3>'))
            .addTo(map.current);

        // Add source for routes
        map.current.on('load', () => {
            map.current?.addSource('routes', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            map.current?.addLayer({
                id: 'routes',
                type: 'line',
                source: 'routes',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#4338CA',
                    'line-width': 2,
                    'line-opacity': 0.8
                }
            });
        });

        // Cleanup on unmount
        return () => {
            map.current?.remove();
        };
    }, []);

    // Update markers and routes when deliveries change
    useEffect(() => {
        if (!map.current) return;

        // Remove existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Add new markers
        deliveries.forEach(delivery => {
            const markerColor = getMarkerColor(delivery.status);
            const marker = new maplibregl.Marker({ color: markerColor })
                .setLngLat([delivery.lng, delivery.lat])
                .setPopup(
                    new maplibregl.Popup().setHTML(`
                        <div class="p-2">
                            <h3 class="font-bold">Order #${delivery.id}</h3>
                            <p class="text-sm">${delivery.address}</p>
                            <p class="text-sm font-medium mt-1">${delivery.status}</p>
                        </div>
                    `)
                )
                .addTo(map.current!);

            if (onMarkerClick) {
                marker.getElement().addEventListener('click', () => onMarkerClick(delivery));
            }

            markers.current.push(marker);
        });

        // Update routes
        if (map.current.getSource('routes')) {
            const features = deliveries.map(delivery => ({
                type: 'Feature' as const,
                properties: {},
                geometry: {
                    type: 'LineString' as const,
                    coordinates: [
                        restaurantLocation,
                        [delivery.lng, delivery.lat]
                    ]
                }
            }));

            (map.current.getSource('routes') as maplibregl.GeoJSONSource).setData({
                type: 'FeatureCollection',
                features
            });
        }

        // Fit bounds to include all markers
        if (deliveries.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            bounds.extend(restaurantLocation as [number, number]);
            deliveries.forEach(delivery => {
                bounds.extend([delivery.lng, delivery.lat]);
            });
            map.current.fitBounds(bounds, { padding: 50 });
        }
    }, [deliveries, onMarkerClick]);

    const getMarkerColor = (status: Delivery['status']) => {
        const colors = {
            PENDING: '#F5A524',    // warning
            ASSIGNED: '#006FEE',   // primary
            PICKED_UP: '#7828C8',  // secondary
            DELIVERED: '#17C964'    // success
        };
        return colors[status];
    };

    return (
        <div ref={mapContainer} className={className} />
    );
} 