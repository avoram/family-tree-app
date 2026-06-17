import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FAMILY_TREE_SERVICE } from './core/services/family-tree.service';
import { JsonFamilyTreeService } from './core/services/json-family-tree.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: FAMILY_TREE_SERVICE, useClass: JsonFamilyTreeService },
  ],
};
