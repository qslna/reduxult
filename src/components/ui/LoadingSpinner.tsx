// HTML redux6 버전과 동일한 미니멀 로딩 스피너
export default function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const borderClasses = {
    small: 'border-[1px]',
    medium: 'border-[2px]',
    large: 'border-[3px]'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        {/* 배경 원 */}
        <div className={`absolute inset-0 ${borderClasses[size]} border-gray-300 rounded-full opacity-20`} />
        
        {/* 애니메이션 원 */}
        <div 
          className={`absolute inset-0 ${borderClasses[size]} border-black border-t-transparent rounded-full`}
          style={{
            animation: 'spinMinimal 1s linear infinite'
          }}
        />
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes spinMinimal {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}