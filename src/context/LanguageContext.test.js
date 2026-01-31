import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Mock component to test the useLanguage hook
function TestComponent() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <div data-testid="current-language">{language}</div>
      <div data-testid="translated-text">{t('home_title')}</div>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('te')}>Telugu</button>
      <button onClick={() => setLanguage('hi')}>Hindi</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const currentLanguage = screen.getByTestId('current-language');
    expect(currentLanguage.textContent).toMatch(/en|te|hi/);
  });

  it('should switch language when setLanguage is called', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const teluguButton = screen.getByText('Telugu');
    teluguButton.click();

    const currentLanguage = screen.getByTestId('current-language');
    expect(currentLanguage.textContent).toBe('te');
  });

  it('should persist language preference to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const hindiButton = screen.getByText('Hindi');
    hindiButton.click();

    expect(localStorage.getItem('language')).toBe('hi');
  });

  it('should provide translation function', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const translatedText = screen.getByTestId('translated-text');
    expect(translatedText.textContent).toBeTruthy();
  });
});
