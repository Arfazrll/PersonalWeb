// src/hooks/useTypewriter.ts
import { useState, useEffect, useMemo } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseTypewriterOptions {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

/**
 * A custom hook that provides a typewriter effect for a series of phrases
 * 
 * @param options Configuration options for the typewriter effect
 * @returns An object containing the current text and cursor blinking state
 */
export const useTypewriter = ({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500
}: UseTypewriterOptions) => {
  const [currentText, setCurrentText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(typingSpeed);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Memoize the current phrase to avoid recalculating on every render
  const currentPhrase = useMemo(() => phrases[currentPhraseIndex], [phrases, currentPhraseIndex]);

  useEffect(() => {
    // If user prefers reduced motion, just show the full phrase without animation
    if (prefersReducedMotion) {
      setCurrentText(currentPhrase);
      return;
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing effect
        setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        
        // Vary typing speed slightly for more natural effect
        setSpeed(typingSpeed - Math.random() * 30);
        
        // If completed typing the current phrase, pause before deleting
        if (currentText.length === currentPhrase.length) {
          setIsDeleting(true);
          setSpeed(pauseDuration);
        }
      } else {
        // Deleting effect
        setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        setSpeed(deletingSpeed);
        
        // If completed deleting, move to next phrase
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setSpeed(300); // Small pause before starting the next phrase
        }
      }
    }, speed);
    
    // Clean up timeout
    return () => clearTimeout(timeout);
  }, [
    currentText, 
    isDeleting, 
    currentPhraseIndex, 
    speed, 
    phrases, 
    currentPhrase, 
    prefersReducedMotion,
    typingSpeed,
    deletingSpeed,
    pauseDuration
  ]);

  // Return current text along with deleting state for cursor animation control
  return {
    text: currentText,
    isDeleting,
    currentPhraseIndex
  };
};

export default useTypewriter;