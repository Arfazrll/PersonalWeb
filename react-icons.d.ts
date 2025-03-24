import { SVGAttributes } from 'react';

declare module 'react-icons/fi' {
  import { ComponentType } from 'react';

  interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }

  type IconType = ComponentType<IconBaseProps>;

  export const FiLinkedin: IconType;
  export const FiGithub: IconType;
  export const FiMail: IconType;
  export const FiChevronUp: IconType;
  // Add any other icons you're using
}