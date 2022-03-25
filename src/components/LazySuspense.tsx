import React, { Suspense } from 'react';

export function LazySuspense(Component) {
  return function RouteComponent(props) {
    return (
      <Suspense fallback={<div />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
