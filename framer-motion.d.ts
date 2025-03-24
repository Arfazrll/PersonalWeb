// framer-motion.d.ts
declare module 'framer-motion' {
  import * as React from 'react';

  // Common types
  export type VariantValue = string | number | boolean | Record<string, string | number | boolean>;
  
  export type Variant = Record<string, VariantValue>;
  
  export type Variants = Record<string, Variant>;
  
  export interface Transition {
    type?: string;
    delay?: number;
    duration?: number;
    ease?: string | number[];
    mass?: number;
    damping?: number;
    stiffness?: number;
    velocity?: number;
    restSpeed?: number;
    restDelta?: number;
    when?: "beforeChildren" | "afterChildren" | string;
    delayChildren?: number;
    staggerChildren?: number;
    staggerDirection?: number;
  }
  
  export interface AnimationProps {
    initial?: boolean | string | Record<string, VariantValue>;
    animate?: string | Record<string, VariantValue>;
    exit?: string | Record<string, VariantValue>;
    variants?: Variants;
    transition?: Transition;
    layout?: boolean | string;
    layoutId?: string;
    drag?: boolean | "x" | "y";
    dragConstraints?: Record<string, number> | React.RefObject<Element>;
    dragElastic?: number | boolean;
    dragMomentum?: boolean;
    dragTransition?: Transition;
    whileHover?: string | Record<string, VariantValue>;
    whileTap?: string | Record<string, VariantValue>;
    whileDrag?: string | Record<string, VariantValue>;
    whileFocus?: string | Record<string, VariantValue>;
    whileInView?: string | Record<string, VariantValue>;
    onDragStart?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    onDrag?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    onAnimationStart?: () => void;
    onAnimationComplete?: () => void;
    onLayoutAnimationStart?: () => void;
    onLayoutAnimationComplete?: () => void;
  }
  
  export interface PanInfo {
    point: {
      x: number;
      y: number;
    };
    delta: {
      x: number;
      y: number;
    };
    offset: {
      x: number;
      y: number;
    };
    velocity: {
      x: number;
      y: number;
    };
  }
  
  export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>;
  
  // Define the motion components
  type HTMLMotionComponents = {
    [K in keyof JSX.IntrinsicElements]: ForwardRefComponent<HTMLElement, JSX.IntrinsicElements[K] & AnimationProps>;
  };
  
  export type SVGMotionComponents = {
    [K in keyof React.SVGProps<SVGElement>]: ForwardRefComponent<SVGElement, React.SVGProps<SVGElement> & AnimationProps>;
  };
  
  export type MotionComponents = HTMLMotionComponents & SVGMotionComponents;
  
  // Export motion object
  export const motion: MotionComponents;
  
  // Alternative export as used in newer versions
  export const m: MotionComponents;
  
  // Animation controls
  export interface AnimationControls {
    start: (variant?: string, options?: StartOptions) => Promise<void>;
    stop: () => void;
    set: (values: Record<string, VariantValue>) => void;
  }
  
  export interface StartOptions {
    delay?: number;
    transitionOverride?: Transition;
    type?: string;
  }
  
  export function useAnimation(): AnimationControls;
  
  // Other hooks and components
  export function useMotionValue<T>(initial: T): MotionValue<T>;
  
  export interface MotionValue<T> {
    get: () => T;
    set: (v: T) => void;
    onChange: (callback: (v: T) => void) => () => void;
  }
  
  export function useTransform<T, U>(value: MotionValue<T>, inputRange: T[], outputRange: U[]): MotionValue<U>;
  export function useViewportScroll(): {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
  };
  
  export interface SpringOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    restSpeed?: number;
    restDelta?: number;
  }
  
  export function useSpring<T>(value: T | MotionValue<T>, config?: SpringOptions): MotionValue<T>;
  
  export interface InViewOptions {
    once?: boolean;
    margin?: string;
    amount?: "some" | "all" | number;
  }
  
  export function useInView(options?: InViewOptions): [React.RefObject<Element>, boolean];
  
  export const AnimatePresence: React.FC<{
    exitBeforeEnter?: boolean;
    initial?: boolean;
    onExitComplete?: () => void;
    children?: React.ReactNode;
  }>;
  
  export interface LazyMotionProps {
    features?: FeatureBundle;
    strict?: boolean;
    children?: React.ReactNode;
  }
  
  export interface FeatureBundle {
    renderer: FeatureDefinition;
    transformPagePoint?: (point: { x: number; y: number }) => { x: number; y: number };
  }
  
  export interface FeatureDefinition {
    createElement: (type: string, props: Record<string, unknown>, children: React.ReactNode) => React.ReactElement;
    render: (element: React.ReactElement, container: Element) => void;
  }
  
  export const LazyMotion: React.FC<LazyMotionProps>;
  
  export function domAnimation(props: Record<string, unknown>): FeatureBundle;
  export function domMax(props: Record<string, unknown>): FeatureBundle;
  
  // Utility functions
  export function isValidMotionProp(prop: string): boolean;
  export function transform<T, U>(inputRange: T[], outputRange: U[], options?: TransformOptions<T>): (value: T) => U;
  
  export interface TransformOptions<T> {
    clamp?: boolean;
    ease?: EasingFunction;
    mixer?: (from: T, to: T) => (v: number) => T | string;
  }
  
  export type EasingFunction = (v: number) => number;
}