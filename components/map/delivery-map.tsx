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
    center = [4.4442623485511, 51.1956911106278], // Default to Antwerp
    zoom = 12,
    className = 'w-full h-[600px]',
    deliveries = [],
    restaurantLocation = center,
    onMarkerClick
}: DeliveryMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markers = useRef<maplibregl.Marker[]>([]);

    const getMarkerClass = (status: Delivery['status']) => {
        const classes = {
            PENDING: 'bg-warning/90',
            ASSIGNED: 'bg-primary/90',
            PICKED_UP: 'bg-secondary/90',
            DELIVERED: 'bg-success/90'
        };
        return classes[status];
    };

    const getStatusClass = (status: Delivery['status']) => {
        const classes = {
            PENDING: 'bg-warning/10 text-warning-600',
            ASSIGNED: 'bg-primary/10 text-primary-600',
            PICKED_UP: 'bg-secondary/10 text-secondary-600',
            DELIVERED: 'bg-success/10 text-success-600'
        };
        return classes[status];
    };

    // Reusable marker creation functions
    const createRestaurantMarker = () => {
        const el = document.createElement('div');
        el.className = 'w-10 h-10 bg-foreground rounded-full border-2 border-danger shadow-lg flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-all duration-300';
        el.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-danger">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
        `;
        return el;
    };

    const createDeliveryMarker = (status: Delivery['status']) => {
        const el = document.createElement('div');
        const baseClass = 'w-8 h-8 rounded-xl border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300';
        const statusClass = getMarkerClass(status);
        el.className = `${baseClass} ${statusClass}`;

        // Different icons based on status
        const icons = {
            PENDING: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            `,
            ASSIGNED: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            `,
            PICKED_UP: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            `,
            DELIVERED: `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            `
        };

        el.innerHTML = icons[status];

        // Add pulse animation for PICKED_UP status
        if (status === 'PICKED_UP') {
            const pulse = document.createElement('div');
            pulse.className = 'absolute w-full h-full rounded-xl animate-ping opacity-75 bg-secondary/50';
            el.insertBefore(pulse, el.firstChild);
            el.style.position = 'relative';
        }

        return el;
    };

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://api.maptiler.com/maps/dataviz/style.json?key=PuQofF7Z4jJVLwlObNlG',
            center: center,
            zoom: zoom,
            attributionControl: false
        });

        // Add custom controls
        const controls = new maplibregl.NavigationControl({
            showCompass: false,
            showZoom: false,
            visualizePitch: false
        });
        map.current.addControl(controls, 'bottom-right');

        // Add restaurant marker
        new maplibregl.Marker({ element: createRestaurantMarker(), anchor: 'center' }).setLngLat(restaurantLocation).addTo(map.current);

        // Add source for routes
        map.current.on('load', () => {
            map.current?.addSource('routes', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            // Add route layer with modern style
            map.current?.addLayer({
                id: 'routes',
                type: 'line',
                source: 'routes',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': ['match',
                        ['get', 'status'],
                        'PENDING', '#F5A524',
                        'ASSIGNED', '#006FEE',
                        'PICKED_UP', '#7828C8',
                        'DELIVERED', '#17C964',
                        '#006FEE'
                    ],
                    'line-width': 3,
                    'line-opacity': 0.6,
                    'line-dasharray': [0, 2]
                }
            });
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!map.current) return;

        // Remove existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Add new markers
        deliveries.forEach(delivery => {
            const marker = new maplibregl.Marker({
                element: createDeliveryMarker(delivery.status),
                anchor: 'bottom'
            })
                .setLngLat([delivery.lng, delivery.lat])
                .setPopup(
                    new maplibregl.Popup({
                        offset: 25,
                        className: 'rounded-lg shadow-lg bg-white/90 backdrop-blur-sm'
                    }).setHTML(`
                    <div class="p-3">
                        <h3 class="font-bold text-primary">Order #${delivery.id}</h3>
                        <p class="text-sm mt-1 text-default-600">${delivery.address}</p>
                        <div class="mt-2">
                            <span class="text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(delivery.status)}">
                                ${delivery.status}
                            </span>
                        </div>
                    </div>
                `)
                )
                .addTo(map.current!);

            if (onMarkerClick) {
                marker.getElement().addEventListener('click', () => onMarkerClick(delivery));
            }

            markers.current.push(marker);
        });

        // Update routes with status colors
        if (map.current.getSource('routes')) {
            const features = deliveries.map(delivery => ({
                type: 'Feature' as const,
                properties: {
                    status: delivery.status
                },
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
            map.current.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                duration: 1000
            });
        }
    }, [deliveries, onMarkerClick]);

    return (
        <div ref={mapContainer} className={className} />
    );
} 