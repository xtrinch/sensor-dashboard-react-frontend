// modified from https://github.com/tatethurston/react-use-error-boundary

import React, {
  Component,
  ComponentLifecycle,
  ComponentType,
  createContext,
  FC,
  MutableRefObject,
  useContext,
  useMemo,
  useRef,
} from 'react';

type ComponentDidCatch = ComponentLifecycle<{}, {}>['componentDidCatch'];

interface ErrorBoundaryProps {
  onError: NonNullable<ComponentDidCatch>;
}

// there are no hook possibilities of error boundary, so we use a class component
class ErrorBoundary extends Component<ErrorBoundaryProps> {
  constructor(cProps) {
    super(cProps);
    this.promiseRejectionHandler = this.promiseRejectionHandler.bind(this);
  }

  // handle async errors that will not be caught by the error boundary
  componentDidMount() {
    // window event listener to catch unhandled promise rejections & stash the error in the state
    window.addEventListener('unhandledrejection', this.promiseRejectionHandler);
  }

  componentDidCatch(...args: Parameters<NonNullable<ComponentDidCatch>>) {
    this.props.onError(...args);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.promiseRejectionHandler);
  }

  promiseRejectionHandler(event: PromiseRejectionEvent) {
    this.props.onError(event as unknown as Error, event.reason);
  }

  render() {
    return this.props.children;
  }
}

const errorBoundaryContext = createContext<{
  componentDidCatch: MutableRefObject<ComponentDidCatch>;
}>({
  componentDidCatch: { current: undefined },
});

export const ErrorBoundaryContext: FC = ({ children }) => {
  const componentDidCatch = useRef<ComponentDidCatch>();
  const ctx = useMemo(
    () => ({
      componentDidCatch,
    }),
    [],
  );
  return (
    <errorBoundaryContext.Provider value={ctx}>
      <ErrorBoundary
        onError={(...args) => {
          componentDidCatch.current?.(...args);
        }}
      >
        {children}
      </ErrorBoundary>
    </errorBoundaryContext.Provider>
  );
};
ErrorBoundaryContext.displayName = 'ReactUseErrorBoundaryContext';

export function withErrorBoundary<Props = Record<string, unknown>>(
  WrappedComponent: ComponentType<Props>,
): FC<Props> {
  return (props: Props) => (
    <ErrorBoundaryContext>
      <WrappedComponent {...props} />
    </ErrorBoundaryContext>
  );
}

export function useErrorBoundary(componentDidCatch?: ComponentDidCatch) {
  const ctx = useContext(errorBoundaryContext);
  ctx.componentDidCatch.current = componentDidCatch;
}
