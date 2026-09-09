import { useState, useEffect } from 'react';

function Landing({ onFinish }) {
    const [visible, setVisible] = useState(true);
    const [blinkCount, setBlinkCount] = useState(0);

    useEffect(() => {
        if (blinkCount >= 6) {
            // 6 toggles = 3 full blinks (on-off-on-off-on-off)
            const timer = setTimeout(onFinish, 400);
            return () => clearTimeout(timer);
        }

        const interval = setTimeout(() => {
            setVisible((v) => !v);
            setBlinkCount((c) => c + 1);
        }, 400);

        return () => clearTimeout(interval);
    }, [blinkCount, onFinish]);

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
            }}
        >
            <div
                style={{
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                }}
            >
                {/* Simple bar graph illustration using SVG - no external image needed */}
                <svg width="180" height="140" viewBox="0 0 180 140">
                    <rect x="10" y="80" width="30" height="60" fill="#22c55e" />
                    <rect x="55" y="50" width="30" height="90" fill="#3b82f6" />
                    <rect x="100" y="20" width="30" height="120" fill="#eab308" />
                    <rect x="145" y="60" width="30" height="80" fill="#ef4444" />
                </svg>
            </div>
            <h2 style={{ color: 'white', marginTop: 20, fontFamily: 'sans-serif' }}>
                InvestorApp
            </h2>
        </div>
    );
}

export default Landing;