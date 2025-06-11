// src/types/redux-persist-integration-react.d.ts
declare module 'redux-persist/integration/react' {
  import * as React from 'react';
  import { Persistor } from 'redux-persist';

  interface PersistGateProps {
    children?: React.ReactNode;
    loading?: React.ReactNode;
    persistor: Persistor;
    onBeforeLift?: () => void | Promise<void>;
  }

  export class PersistGate extends React.Component<PersistGateProps> {}
}
