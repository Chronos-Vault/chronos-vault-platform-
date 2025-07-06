import React from 'react';

type MotionProps = {
  children?: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  variants?: any;
  [key: string]: any;
};

// Simplified motion component that applies animations using CSS transitions
// This component mimics the Framer Motion API but uses CSS transitions for simplicity
const MotionComponent: React.FC<MotionProps> = ({
  children,
  className = '',
  initial,
  animate,
  transition,
  whileHover,
  whileTap,
  variants,
  ...props
}) => {
  const getTransitionStyle = () => {
    const duration = transition?.duration || 0.3;
    const delay = transition?.delay || 0;
    const ease = transition?.ease || 'cubic-bezier(0.25, 0.1, 0.25, 1.0)';
    
    return {
      transition: `all ${duration}s ${ease} ${delay}s`,
    };
  };
  
  const getInitialStyle = () => {
    if (!initial) return {};
    
    return {
      opacity: initial.opacity !== undefined ? initial.opacity : 1,
      transform: `
        ${initial.x ? `translateX(${initial.x}px)` : ''}
        ${initial.y ? `translateY(${initial.y}px)` : ''}
        ${initial.scale ? `scale(${initial.scale})` : ''}
        ${initial.rotate ? `rotate(${initial.rotate}deg)` : ''}
      `,
    };
  };
  
  const getAnimateStyle = () => {
    if (!animate) return {};
    
    return {
      opacity: animate.opacity,
      transform: `
        ${animate.x ? `translateX(${animate.x}px)` : ''}
        ${animate.y ? `translateY(${animate.y}px)` : ''}
        ${animate.scale ? `scale(${animate.scale})` : ''}
        ${animate.rotate ? `rotate(${animate.rotate}deg)` : ''}
      `,
    };
  };
  
  // Combine all styles
  const style = {
    ...getInitialStyle(),
    ...getAnimateStyle(),
    ...getTransitionStyle(),
    ...props.style,
  };
  
  return (
    <div
      className={className}
      style={style}
      onMouseEnter={(e) => {
        if (whileHover && props.onMouseEnter) {
          props.onMouseEnter(e);
        }
      }}
      onMouseLeave={(e) => {
        if (whileHover && props.onMouseLeave) {
          props.onMouseLeave(e);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Create component variants for different HTML elements
const MotionDiv = MotionComponent;

const MotionSection = (props: MotionProps) => (
  <MotionComponent as="section" {...props} />
);

const MotionHeader = (props: MotionProps) => (
  <MotionComponent as="header" {...props} />
);

const MotionFooter = (props: MotionProps) => (
  <MotionComponent as="footer" {...props} />
);

const MotionSpan = (props: MotionProps) => (
  <MotionComponent as="span" {...props} />
);

const MotionMain = (props: MotionProps) => (
  <MotionComponent as="main" {...props} />
);

export const Motion = {
  div: MotionDiv,
  section: MotionSection,
  header: MotionHeader,
  footer: MotionFooter,
  span: MotionSpan,
  main: MotionMain,
};