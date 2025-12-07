import { useState, useRef, useCallback } from 'react';

interface RealtimeSession {
    sessionId: string;
    sdpAnswer: string;
}

interface UseGeminiRealtimeReturn {
    connect: () => Promise<void>;
    disconnect: () => void;
    sendText: (text: string) => void;
    isConnected: boolean;
    error: string | null;
}

export const useGeminiRealtime = (
    apiKey: string,
    onLog: (message: string, type?: 'info' | 'error' | 'success') => void
): UseGeminiRealtimeReturn => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const sessionRef = useRef<RealtimeSession | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const SYSTEM_PROMPT = "You are YAVA, the AI voice receptionist. Handle booking, scheduling, quoting, pricing, client info, job updates, and general questions. Speak naturally and conversationally.";

    const connect = useCallback(async () => {
        try {
            onLog('Starting Realtime connection...', 'info');
            setError(null);

            // Step 1: Get microphone access
            onLog('Requesting microphone access...', 'info');
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 16000
                }
            });
            streamRef.current = stream;
            onLog('Microphone access granted', 'success');

            // Step 2: Call realtime:connect endpoint
            onLog('Connecting to Gemini Realtime API...', 'info');
            const connectResponse = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/realtime:connect',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'models/gemini-2.0-flash-exp',
                        system_instruction: SYSTEM_PROMPT
                    })
                }
            );

            if (!connectResponse.ok) {
                const errorText = await connectResponse.text();
                throw new Error(`Connect failed: ${connectResponse.status} - ${errorText}`);
            }

            const connectData = await connectResponse.json();
            const session: RealtimeSession = {
                sessionId: connectData.session.id,
                sdpAnswer: connectData.session.sdpAnswer
            };
            sessionRef.current = session;
            onLog(`Session created: ${session.sessionId}`, 'success');

            // Step 3: Create RTCPeerConnection
            onLog('Creating WebRTC peer connection...', 'info');
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            });
            pcRef.current = pc;

            // Add local audio track
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });
            onLog('Added local audio tracks', 'info');

            // Handle incoming audio
            pc.ontrack = (event) => {
                onLog('Received remote audio track', 'success');
                if (event.streams && event.streams[0]) {
                    if (!audioElementRef.current) {
                        audioElementRef.current = new Audio();
                        audioElementRef.current.autoplay = true;
                    }
                    audioElementRef.current.srcObject = event.streams[0];
                }
            };

            // Handle connection state changes
            pc.onconnectionstatechange = () => {
                onLog(`Connection state: ${pc.connectionState}`, 'info');
                if (pc.connectionState === 'connected') {
                    setIsConnected(true);
                } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                    setIsConnected(false);
                }
            };

            pc.oniceconnectionstatechange = () => {
                onLog(`ICE state: ${pc.iceConnectionState}`, 'info');
            };

            // Step 4: Set remote description (answer from Gemini)
            onLog('Setting remote description...', 'info');
            await pc.setRemoteDescription({
                type: 'answer',
                sdp: session.sdpAnswer
            });
            onLog('Remote description set', 'success');

            // Step 5: Create local offer
            onLog('Creating local offer...', 'info');
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: false
            });
            await pc.setLocalDescription(offer);
            onLog('Local offer created', 'success');

            // Step 6: Send offer to Gemini
            onLog('Sending offer to Gemini...', 'info');
            const streamResponse = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/realtime:stream',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: session.sessionId,
                        sdpOffer: offer.sdp
                    })
                }
            );

            if (!streamResponse.ok) {
                const errorText = await streamResponse.text();
                throw new Error(`Stream failed: ${streamResponse.status} - ${errorText}`);
            }

            onLog('Offer sent successfully', 'success');
            onLog('WebRTC connection established!', 'success');
            setIsConnected(true);

        } catch (err: any) {
            const errorMsg = err.message || 'Unknown error';
            onLog(`ERROR: ${errorMsg}`, 'error');
            setError(errorMsg);
            setIsConnected(false);
            cleanup();
        }
    }, [apiKey, onLog]);

    const disconnect = useCallback(() => {
        onLog('Disconnecting...', 'info');
        cleanup();
        setIsConnected(false);
    }, [onLog]);

    const sendText = useCallback((text: string) => {
        if (!sessionRef.current) {
            onLog('Cannot send text: No active session', 'error');
            return;
        }

        // This would be implemented via data channel or separate API call
        onLog(`Sending text: ${text}`, 'info');
    }, [onLog]);

    const cleanup = () => {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioElementRef.current) {
            audioElementRef.current.srcObject = null;
            audioElementRef.current = null;
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        sessionRef.current = null;
    };

    return {
        connect,
        disconnect,
        sendText,
        isConnected,
        error
    };
};
