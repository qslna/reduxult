'use client';

import { usePathname } from 'next/navigation';
import { footerNavigation, socialLinks } from '@/data/navigation';
import { LAYOUT_CLASSES, TYPOGRAPHY, layoutUtils } from '@/lib/design-system';
import { Flex } from '@/components/layout/Container';
import NavLink, { ExternalLink } from '@/components/ui/NavLink';

/**
 * ModernFooter component - 모던한 푸터 컴포넌트
 * 디자인 시스템과 네비게이션 데이터를 사용하여 재구축
 */
export default function ModernFooter() {
  const pathname = usePathname();

  // Determine if footer should be shown
  const shouldShowFooter = pathname !== '/about/memory';
  
  // Determine footer type
  const footerType = pathname === '/' ? 'full' : 'simple';

  if (!shouldShowFooter) {
    return null;
  }

  const baseFooterClass = layoutUtils.combineClasses(
    'py-[60px] px-10 bg-black text-white text-center',
    'border-t border-white/10',
    'max-[768px]:py-10 max-[768px]:px-5'
  );

  // Simple footer for most pages
  if (footerType === 'simple') {
    return (
      <footer className={baseFooterClass}>
        <p className={layoutUtils.combineClasses(TYPOGRAPHY.body.small, 'text-white/60')}>
          &copy; {new Date().getFullYear()} REDUX. All rights reserved.
        </p>
      </footer>
    );
  }

  // Full footer for homepage
  return (
    <footer className={baseFooterClass}>
      <div className="footer-content max-w-[1200px] mx-auto">
        <Flex
          direction="col"
          align="center"
          gap="lg"
          className="lg:flex-row lg:justify-between lg:items-center"
        >
          {/* Footer Navigation */}
          <nav className="footer-nav">
            <Flex
              direction="col"
              align="center"
              gap="md"
              className="lg:flex-row lg:gap-[30px]"
            >
              {footerNavigation.map((item, index) => (
                <NavLink
                  key={index}
                  href={item.href}
                  variant="footer"
                >
                  {item.label}
                </NavLink>
              ))}
            </Flex>
          </nav>

          {/* Social Links */}
          <div className="footer-social">
            <Flex
              direction="col"
              align="center"
              gap="sm"
              className="lg:items-end"
            >
              <div className="social-links">
                <Flex gap="lg" className="flex-wrap justify-center lg:justify-end">
                  {socialLinks.map((link, index) => (
                    link.active ? (
                      <ExternalLink
                        key={index}
                        href={link.href}
                        variant="footer"
                      >
                        {link.label}
                      </ExternalLink>
                    ) : (
                      <span
                        key={index}
                        className={layoutUtils.combineClasses(
                          TYPOGRAPHY.body.small,
                          'text-white/30 tracking-[1px]',
                          'max-[480px]:text-[13px]'
                        )}
                      >
                        {link.label}
                      </span>
                    )
                  ))}
                </Flex>
              </div>
              
              {/* Copyright */}
              <div className="footer-copyright">
                <p className={layoutUtils.combineClasses(
                  TYPOGRAPHY.ui.caption,
                  'text-white/60 mt-2'
                )}>
                  &copy; {new Date().getFullYear()} REDUX. All rights reserved.
                </p>
              </div>
            </Flex>
          </div>
        </Flex>
      </div>
    </footer>
  );
}

/**
 * FooterSection component - 푸터 섹션 컴포넌트
 * 재사용 가능한 푸터 섹션
 */
interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FooterSection({ title, children, className }: FooterSectionProps) {
  const sectionClass = layoutUtils.combineClasses(
    'footer-section',
    className
  );

  return (
    <div className={sectionClass}>
      <h3 className={layoutUtils.combineClasses(
        TYPOGRAPHY.ui.label,
        'text-white mb-4'
      )}>
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * FooterLink component - 푸터 링크 컴포넌트
 */
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function FooterLink({ href, children, external = false }: FooterLinkProps) {
  if (external) {
    return (
      <ExternalLink href={href} variant="footer">
        {children}
      </ExternalLink>
    );
  }

  return (
    <NavLink href={href} variant="footer">
      {children}
    </NavLink>
  );
}

/**
 * Legacy Footer component wrapper
 * 기존 Footer 컴포넌트와의 호환성 유지
 */
export { ModernFooter as Footer };

// Footer utilities
export const footerUtils = {
  shouldShowFooter: (pathname: string): boolean => {
    return pathname !== '/about/memory';
  },

  getFooterType: (pathname: string): 'full' | 'simple' => {
    return pathname === '/' ? 'full' : 'simple';
  },

  getCurrentYear: (): number => {
    return new Date().getFullYear();
  }
};