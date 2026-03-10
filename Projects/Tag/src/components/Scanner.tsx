"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WebScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // We store the reader ref so we can stop it consistently
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const controlsRef = useRef<any>(null);

    const startScanner = async () => {
        try {
            setError(null);
            setIsScanning(true);
            setScannedResult(null);

            if (!codeReaderRef.current) {
                codeReaderRef.current = new BrowserMultiFormatReader();
            }

            // Obtain user video stream. Usually requires HTTPS/localhost
            const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            if (videoInputDevices.length === 0) {
                throw new Error("No camera found on device.");
            }

            // Pick back camera if available by ID, else the first
            const selectedDeviceId = videoInputDevices[0].deviceId;

            // @zxing/browser exposes decodeFromVideoDevice which returns controls
            if (videoRef.current) {
                controlsRef.current = await codeReaderRef.current.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current,
                    (result, err) => {
                        if (result) {
                            handleSuccessfulScan(result.getText());
                        }
                    }
                );
            }

        } catch (err: any) {
            console.error("Scanner init error:", err);
            setError(err.message || "Failed to access camera.");
            setIsScanning(false);
        }
    };

    const stopScanner = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
        }
        setIsScanning(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopScanner();
    }, []);


    const handleSuccessfulScan = async (upcText: string) => {
        // Prevent double triggers
        if (scannedResult || isProcessing) return;

        stopScanner();
        setScannedResult(upcText);
        setIsProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upc: upcText })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ingestion failed.");
            }

            // Re-route to exactly the new verified page natively
            router.push(`/verify/${data.tagId}`);

        } catch (err: any) {
            setError(err.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">

            {!isScanning && !scannedResult && (
                <button
                    onClick={startScanner}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-blue-500/20 group w-full sm:w-auto"
                >
                    <Camera className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Scan Barcode / QR Code
                </button>
            )}

            {isScanning && (
                <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-black aspect-[4/3] shadow-2xl border-4 border-blue-500/30">
                    <video ref={videoRef} className="w-full h-full object-cover" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-white/50 border-dashed rounded-xl relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                        </div>
                    </div>

                    <button
                        onClick={stopScanner}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 font-mono text-sm uppercase tracking-widest animate-pulse">
                        Align Barcode in frame
                    </div>
                </div>
            )}

            {scannedResult && isProcessing && (
                <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-sm flex flex-col items-center text-center shadow-xl">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Code: <span className="text-blue-400 font-mono">{scannedResult}</span></h3>
                    <p className="text-slate-400 text-sm font-medium">Resolving UPC & Minting Trust Framework...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl text-center max-w-sm font-medium">
                    {error}
                </div>
            )}

        </div>
    );
}
