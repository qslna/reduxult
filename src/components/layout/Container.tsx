import { LAYOUT_CLASSES, layoutUtils, type ContainerProps } from '@/lib/design-system';

/**
 * Container component - 반응형 컨테이너 래퍼
 * 다양한 크기 옵션과 일관된 패딩 제공
 */
export default function Container({ 
  children, 
  size = 'constrained', 
  className 
}: ContainerProps) {
  const containerClass = layoutUtils.combineClasses(
    LAYOUT_CLASSES.container[size],
    className
  );

  return (
    <div className={containerClass}>
      {children}
    </div>
  );
}

/**
 * Section component - 섹션 래퍼 컴포넌트
 * 일관된 수직 간격 제공
 */
export function Section({ 
  children, 
  spacing = 'base', 
  className 
}: ContainerProps & { spacing?: 'compact' | 'base' | 'spacious' }) {
  const sectionClass = layoutUtils.combineClasses(
    LAYOUT_CLASSES.section[spacing],
    className
  );

  return (
    <section className={sectionClass}>
      {children}
    </section>
  );
}

/**
 * Grid component - 반응형 그리드 래퍼
 */
interface GridProps extends ContainerProps {
  cols?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export function Grid({ 
  children, 
  cols = 2, 
  gap = 'md', 
  className 
}: GridProps) {
  const gridClass = layoutUtils.combineClasses(
    LAYOUT_CLASSES.grid.base,
    cols === 2 ? LAYOUT_CLASSES.grid.cols2 :
    cols === 3 ? LAYOUT_CLASSES.grid.cols3 :
    LAYOUT_CLASSES.grid.cols4,
    gap === 'sm' ? 'gap-4' :
    gap === 'lg' ? 'gap-8 lg:gap-12' : 'gap-6 lg:gap-8',
    className
  );

  return (
    <div className={gridClass}>
      {children}
    </div>
  );
}

/**
 * Flex component - 플렉스박스 래퍼
 */
interface FlexProps extends ContainerProps {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'between' | 'around';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Flex({ 
  children, 
  direction = 'row',
  align = 'center',
  justify = 'start',
  wrap = false,
  gap = 'md',
  className 
}: FlexProps) {
  const flexClass = layoutUtils.combineClasses(
    'flex',
    direction === 'col' ? 'flex-col' : 'flex-row',
    align === 'start' ? 'items-start' :
    align === 'end' ? 'items-end' :
    align === 'between' ? 'items-center justify-between' :
    align === 'around' ? 'items-center justify-around' : 'items-center',
    justify === 'start' ? 'justify-start' :
    justify === 'end' ? 'justify-end' :
    justify === 'between' ? 'justify-between' :
    justify === 'around' ? 'justify-around' : 'justify-center',
    wrap ? 'flex-wrap' : '',
    gap === 'sm' ? 'gap-2' :
    gap === 'lg' ? 'gap-6' :
    gap === 'xl' ? 'gap-8' : 'gap-4',
    className
  );

  return (
    <div className={flexClass}>
      {children}
    </div>
  );
}