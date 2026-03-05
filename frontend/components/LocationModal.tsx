"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation, CITIES } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { MapPin, CheckCircle2, Navigation } from "lucide-react";

interface LocationModalProps {
    manualOpen?: boolean;
    setManualOpen?: (open: boolean) => void;
}

export function LocationModal({ manualOpen, setManualOpen }: LocationModalProps = {}) {
    const { city, setCity } = useLocation();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Sync internal state with prop
    useEffect(() => {
        if (manualOpen !== undefined) {
            setIsOpen(manualOpen);
        }
    }, [manualOpen]);

    // Handle dialog closure to sync back to parent
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (setManualOpen) {
            setManualOpen(open);
        }
    };

    // Auto-open logic: User is logged in but hasn't selected a city
    useEffect(() => {
        const hasPrompted = sessionStorage.getItem("evenizers-location-prompted");
        if (user && city === "Select City" && !hasPrompted) {
            setIsOpen(true);
            sessionStorage.setItem("evenizers-location-prompted", "true");
        }
    }, [user, city]);

    const handleCitySelect = (selectedCity: string) => {
        setCity(selectedCity);
        setIsOpen(false);
        if (setManualOpen) {
            setManualOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-2">
                        <Navigation className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                    </div>
                    <DialogTitle className="font-serif text-3xl md:text-4xl font-bold text-zinc-900">
                        Select Your City
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 max-w-[300px] text-base font-medium">
                        Choose your location to see personalized packages and event services in your area.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    {CITIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => handleCitySelect(c)}
                            className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 active:scale-95 ${city === c
                                ? "border-black bg-zinc-50"
                                : "border-zinc-100 hover:border-zinc-200 bg-white"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${city === c ? "bg-black text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                                }`}>
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className={`font-bold text-sm uppercase tracking-wider ${city === c ? "text-black" : "text-zinc-500"
                                }`}>
                                {c}
                            </span>

                            {city === c && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle2 className="w-5 h-5 text-black" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <p className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.3em]">Premium Event Services</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
