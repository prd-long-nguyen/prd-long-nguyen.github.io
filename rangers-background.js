/**
 * Rangers Scrolling Background Component
 * This script injects the necessary HTML, CSS, and GSAP logic 
 * to create a scrolling "Rangers" background.
 */

(function() {
    // 1. Main Initialization Logic

    function init() {
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Create HTML Elements
        const bgContainer = document.createElement('div');
        bgContainer.className = 'scrolling-bg';
        bgContainer.id = 'scrollingBg';
        
        const decoration = document.createElement('div');
        decoration.className = 'bg-decoration';

        // Insert as first children of body to keep them behind
        document.body.prepend(decoration);
        document.body.prepend(bgContainer);

        // 3. GSAP Logic
        function createScrollingBackground() {
            const text = 'Rangers'; 
            
            // Calculate diagonal to ensure full coverage
            const diagonalLength = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.5;
            const rowHeight = 180;
            const rowCount = Math.ceil(diagonalLength / rowHeight) + 2;
            const repeatCount = 20;

            for (let i = 0; i < rowCount; i++) {
                const row = document.createElement('div');
                row.className = 'scroll-row';
                
                let textContent = '';
                for (let j = 0; j < repeatCount; j++) {
                    textContent += `<span class="scroll-text">${text}</span>`;
                }
                row.innerHTML = textContent + textContent;
                bgContainer.appendChild(row);

                const yPos = (i * rowHeight) - ((rowCount * rowHeight) / 2);
                gsap.set(row, { y: yPos });
                
                const singleSetWidth = row.scrollWidth / 2;
                const direction = i % 2 === 0 ? -1 : 1;
                const startX = direction === -1 ? 0 : -singleSetWidth;
                const endX = direction === -1 ? -singleSetWidth : 0;

                gsap.set(row, { x: startX });
                gsap.to(row, {
                    x: endX,
                    duration: 200,
                    ease: 'none',
                    repeat: -1
                });
            }
        }

        // Check for GSAP availability
        if (typeof gsap !== 'undefined') {
            createScrollingBackground();
        } else {
            // Wait for load if gsap isn't immediately available (though it should be)
            window.addEventListener('load', () => {
                if (typeof gsap !== 'undefined') createScrollingBackground();
            });
        }
    }

    // Start the process
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
