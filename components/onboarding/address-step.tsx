"use client";

import { Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const mapContainerStyle = {
    width: "100%",
    height: "200px",
    marginTop: "1rem",
    borderRadius: "0.5rem",
    overflow: "hidden",
};

const defaultCenter = {
    lat: 52.3676,  // Amsterdam
    lng: 4.9041,
};

type AddressStepProps = {
    formData: {
        address: string;
        city: string;
        postalCode: string;
    };
    onChange: (key: string, value: string) => void;
    isLoading: boolean;
};

export function AddressStep({ formData, onChange, isLoading }: AddressStepProps) {
    const [coordinates, setCoordinates] = useState(defaultCenter);
    const [searchValue, setSearchValue] = useState(formData.address);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [coordinates.lng, coordinates.lat],
            zoom: 15
        });

        marker.current = new maplibregl.Marker()
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map.current);

        map.current.addControl(new maplibregl.NavigationControl());

        return () => {
            map.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (map.current && marker.current) {
            map.current.setCenter([coordinates.lng, coordinates.lat]);
            marker.current.setLngLat([coordinates.lng, coordinates.lat]);
        }
    }, [coordinates]);

    useEffect(() => {
        if (formData.address) {
            setSearchValue(formData.address);
            geocodeAddress(formData.address);
        }
    }, []);

    const geocodeAddress = async (address: string) => {
        try {
            const query = encodeURIComponent(`${address}, ${formData.city || ''}, ${formData.postalCode || ''}`);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
            const data = await response.json();

            if (data && data[0]) {
                setCoordinates({
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                });

                // Update form data with the found address details
                onChange("address", data[0].display_name.split(",")[0]);

                // Try to extract city and postal code from the address
                const addressParts = data[0].display_name.split(", ");
                const cityMatch = addressParts.find((part: string) => part.match(/[A-Z][a-z]+/));
                const postalMatch = addressParts.find((part: string) => part.match(/\d{4}\s?[A-Z]{2}/));

                if (cityMatch && !formData.city) onChange("city", cityMatch);
                if (postalMatch && !formData.postalCode) onChange("postalCode", postalMatch);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    const handleAddressChange = (value: string) => {
        setSearchValue(value);
        onChange("address", value);
    };

    const handleAddressBlur = () => {
        if (searchValue) {
            geocodeAddress(searchValue);
        }
    };

    return (
        <div className="space-y-4">
            <Input
                isRequired
                label="Street Address"
                value={searchValue}
                onChange={(e) => handleAddressChange(e.target.value)}
                onBlur={handleAddressBlur}
                placeholder="Enter your address"
                variant="bordered"
                isDisabled={isLoading}
            />

            <div className="flex gap-4">
                <Input
                    isRequired
                    label="City"
                    value={formData.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Enter your city"
                    variant="bordered"
                    isDisabled={isLoading}
                />
                <Input
                    isRequired
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => onChange("postalCode", e.target.value)}
                    placeholder="Enter postal code"
                    variant="bordered"
                    isDisabled={isLoading}
                />
            </div>

            <div ref={mapContainer} style={mapContainerStyle} />
        </div>
    );
} 