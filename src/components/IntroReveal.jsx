import React, { useState, useEffect } from 'react';
import './IntroReveal.css';

const IntroReveal = ({ children }) => {
    // We can disable the animation wrapper after it's done to prevent 
    // any fixed 3D contexts from messing up fixed elements like Modals later.
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationDone(true);
        }, 2100); // slightly longer than the 2s animation

        return () => clearTimeout(timer);
    }, []);

    if (animationDone) {
        return <>{children}</>;
    }

    return (
        <div className="intro-stage">
            <div className="intro-content">
                {children}
            </div>
        </div>
    );
};

export default IntroReveal;
