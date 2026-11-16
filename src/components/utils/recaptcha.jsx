const RECAPTCHA_SITE_KEY = '6LfOMZ8qAAAAAHyV-HhPMD9HfuUKVBcYSKCl3Xh0';

export const loadRecaptchaScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('Window is not defined');
      return;
    }

    if (window.grecaptcha && window.grecaptcha.ready) {
      resolve(window.grecaptcha);
      return;
    }

    const existingScript = document.querySelector(`script[src*="recaptcha"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.grecaptcha) {
          resolve(window.grecaptcha);
        } else {
          reject('reCAPTCHA not loaded');
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          resolve(window.grecaptcha);
        });
      } else {
        reject('reCAPTCHA not available');
      }
    };
    
    script.onerror = () => reject('Failed to load reCAPTCHA script');
    
    document.head.appendChild(script);
  });
};

export const verifyRecaptcha = async (action = 'submit') => {
  try {
    await loadRecaptchaScript();
    
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || !window.grecaptcha.ready) {
        reject('reCAPTCHA not ready');
        return;
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch (error) {
          console.error('reCAPTCHA execution error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    throw error;
  }
};

export const hideRecaptchaBadge = () => {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';
  document.head.appendChild(style);
};

export const executeRecaptcha = async (action = 'submit') => {
  return verifyRecaptcha(action);
};