
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Loader2, Car, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RideStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Stage = "booked" | "searching" | "assigned" | "arriving";

export default function RideStatusModal({ isOpen, onClose }: RideStatusModalProps) {
    const [stage, setStage] = useState<Stage>("booked");

    // Reset stage when modal opens
    useEffect(() => {
        if (isOpen) {
            setStage("booked");

            // Timeline
            const timer1 = setTimeout(() => setStage("searching"), 2000);
            const timer2 = setTimeout(() => setStage("assigned"), 4000);
            const timer3 = setTimeout(() => setStage("arriving"), 6000);
            const timer4 = setTimeout(() => {
                onClose();
            }, 8000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        }
    }, [isOpen, onClose]);

    const renderContent = () => {
        switch (stage) {
            case "booked":
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400 animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-center">Ride Booked!</h2>
                        <p className="text-muted-foreground text-center">
                            Your booking has been confirmed successfully.
                        </p>
                    </div>
                );
            case "searching":
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                            <Loader2 className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-center">Searching for Driver</h2>
                        <p className="text-muted-foreground text-center">
                            Matching you with the nearest top-rated driver...
                        </p>
                    </div>
                );
            case "assigned":
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                            <Car className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-center">Driver Assigned</h2>
                        <p className="text-muted-foreground text-center">
                            Driver found! Preparing details...
                        </p>
                    </div>
                );
            case "arriving":
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            <MapPin className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-center">Arriving Soon</h2>
                        <p className="text-muted-foreground text-center">
                            Your driver is on the way to your pickup location.
                        </p>
                    </div>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md border-0 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogTitle className="sr-only">Ride Booking Status</DialogTitle>
                <DialogDescription className="sr-only">
                    Real-time status updates for your ride booking.
                </DialogDescription>
                <div className="py-6 min-h-[300px] flex items-center justify-center">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
