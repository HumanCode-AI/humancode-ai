import type { ComponentType } from 'react';

import { IndexPage } from '../pages/IndexPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
];
