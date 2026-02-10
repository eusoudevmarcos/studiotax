import React from 'react';

const SkeletonBlock: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = 'w-full', height = 'h-5', className = '' }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`}
    style={{}}
  ></div>
);

const SkeletonCircle: React.FC<{ size?: string; className?: string }> = ({
  size = 'w-10 h-10',
  className = '',
}) => (
  <div
    className={`bg-gray-200 rounded-full animate-pulse ${size} ${className}`}
  ></div>
);

const LoadingClienteInfo: React.FC<{ variant?: 'full' | 'mini' }> = ({
  variant = 'full',
}) => {
  const skeletonEmail = (
    <div className="flex items-center gap-2 mb-2">
      <SkeletonCircle size="w-6 h-6" />
      <SkeletonBlock width="w-40" />
    </div>
  );

  const skeletonCnpj = (
    <div className="flex items-center gap-2 mb-1">
      <SkeletonBlock width="w-16" height="h-4" />
      <SkeletonBlock width="w-32" height="h-4" />
    </div>
  );

  const skeletonEmpresa = (
    <div className="flex flex-col gap-2 mt-2">
      <SkeletonBlock width="w-56" />
      <SkeletonBlock width="w-40" />
    </div>
  );

  const skeletonRepresentantes = (
    <div className="border-y border-gray-200 py-2 mt-2">
      <SkeletonBlock width="w-40" height="h-5" className="mb-2" />
      {[1, 2].map(idx => (
        <div className="flex flex-col gap-1 mb-2" key={idx}>
          <div className="flex items-center gap-2">
            <SkeletonCircle size="w-5 h-5" />
            <SkeletonBlock width="w-32" height="h-4" />
          </div>
          <SkeletonBlock width="w-24" height="h-4" />
        </div>
      ))}
    </div>
  );

  // Menu skeleton
  const skeletonMenu = (
    <div className="absolute right-0 top-2 flex items-center z-10">
      <div className="rounded-full bg-gray-300 w-8 h-8 animate-pulse"></div>
    </div>
  );

  if (variant === 'mini') {
    return (
      <div className="p-4">
        <div className="text-2xl font-bold text-center text-primary w-full mb-3">
          <SkeletonBlock width="w-56 mx-auto" height="h-7" />
        </div>
        {skeletonMenu}
        <div className="flex flex-col py-2 gap-2">
          <SkeletonBlock width="w-24" height="h-6" className="mb-1" />{' '}
          {/* status */}
          {skeletonCnpj}
          {skeletonEmpresa}
          {skeletonEmail}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-2xl font-bold text-center text-primary w-full mb-3">
        <SkeletonBlock width="w-48 mx-auto" height="h-7" />
      </div>
      <div className="flex flex-col flex-wrap relative gap-2">
        {skeletonMenu}
        <SkeletonBlock width="w-24" height="h-6" className="mb-1" />{' '}
        {/* status label */}
        {skeletonEmail}
        <div className="mb-2">{skeletonEmpresa}</div>
        <div className="mb-2">{skeletonCnpj}</div>
        {skeletonRepresentantes}
      </div>
    </div>
  );
};

export default LoadingClienteInfo;
