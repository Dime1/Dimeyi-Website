import '@testing-library/jest-dom'

// Framer Motion's whileInView uses IntersectionObserver; mock it for jsdom
class MockIntersectionObserver {
  observe()    {}
  unobserve()  {}
  disconnect() {}
}
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable:     true,
  configurable: true,
  value:        MockIntersectionObserver,
})

// useReducedMotion (and other hooks) call window.matchMedia; mock it for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches:         false,
    media:           query,
    onchange:        null,
    addListener:     () => {},
    removeListener:  () => {},
    addEventListener:    () => {},
    removeEventListener: () => {},
    dispatchEvent:   () => false,
  }),
})
