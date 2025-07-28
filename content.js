(function() {
    'use strict';
    
    let hasPrompted = false;
    let overlay = null;
    let observer = null;
    
    // Function to create the blur overlay and dialog
    function createTimerPrompt() {
        if (hasPrompted || overlay) return;
        
        console.log('Creating timer prompt...');
        
        // Create blur overlay
        overlay = document.createElement('div');
        overlay.id = 'leetcode-timer-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // Create dialog box
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: black;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            #leetcode-timer-overlay button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
        
        dialog.innerHTML = `
            <div style="margin-bottom: 16px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 16px auto; display: block;">
                    <circle cx="12" cy="12" r="10" stroke="#f89f1b" stroke-width="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="#f89f1b" stroke-width="2"/>
                </svg>
                <h3 style="margin: 0; color: white; font-style: bold; font-size: 20px; font-weight: 600;">Start Timing!</h3>
            </div>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.5; font-size: 14px;">
                Reminder to start timing this problem :)
            </p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button id="skipTimer" style="
                    background: #e6e6e6ff;
                    color: rgba(14, 14, 14, 1);
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    min-width: 100px;
                ">Dismiss</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Add button event listeners
        
        document.getElementById('skipTimer').addEventListener('click', () => {
            removeOverlay();
        });
        
        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                removeOverlay();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        hasPrompted = true;
    }
    
    function removeOverlay() {
        if (overlay) {
            overlay.style.animation = 'slideOut 0.2s ease-in';
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                overlay = null;
            }, 200);
        }
    }

    // Function to check if we're on a problem page
    function isProblemPage() {
        const path = window.location.pathname;
        return path.includes('/problems/') && path.split('/').length >= 3;
    }
    
    // Main function to check and show prompt
    async function checkAndPrompt() {
        if (!isProblemPage() || hasPrompted) return;
        
        if (isProblemPage() && !hasPrompted) {
            createTimerPrompt();
        }
        
    }
    
    // Handle navigation in SPA
    let currentPath = window.location.pathname;
    function handleNavigation() {
        const newPath = window.location.pathname;
        if (newPath !== currentPath) {
            console.log('Navigation detected:', currentPath, '->', newPath);
            currentPath = newPath;
            hasPrompted = false;
            
            if (overlay) {
                removeOverlay();
            }
            
            setTimeout(checkAndPrompt, 1000);
        }
    }
    
    // Initial check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndPrompt);
    } else {
        checkAndPrompt();
    }
    
    // Monitor for navigation changes
    setInterval(handleNavigation, 1000);
    
    // Listen for browser navigation
    window.addEventListener('popstate', () => {
        hasPrompted = false;
        if (overlay) {
            removeOverlay();
        }
        setTimeout(checkAndPrompt, 1000);
    });
    
    // Monitor for pushstate/replacestate (SPA navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        hasPrompted = false;
        if (overlay) {
            removeOverlay();
        }
        setTimeout(checkAndPrompt, 1000);
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        hasPrompted = false;
        if (overlay) {
            removeOverlay();
        }
        setTimeout(checkAndPrompt, 1000);
    };
})();