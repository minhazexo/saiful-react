import * as rtl from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import en from '../../public/locales/en.json';

function Wrapper({ children }) {
  return (
    <LanguageProvider initialLanguage="en" initialTranslations={en}>
      {children}
    </LanguageProvider>
  );
}

function renderWithProviders(ui, options = {}) {
  return rtl.render(ui, { wrapper: Wrapper, ...options });
}

export const render = renderWithProviders;
export const screen = rtl.screen;
export const fireEvent = rtl.fireEvent;
export const waitFor = rtl.waitFor;
export const cleanup = rtl.cleanup;
export const act = rtl.act;
export { renderWithProviders };
