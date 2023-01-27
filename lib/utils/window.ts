export function getWindowWidth() {
  return (
    window.innerWidth ||
    document.body.clientWidth ||
    document.documentElement.clientWidth
  );
}

export function getWindowHeight() {
  return (
    window.innerHeight ||
    document.body.clientHeight ||
    document.documentElement.clientHeight
  );
}
