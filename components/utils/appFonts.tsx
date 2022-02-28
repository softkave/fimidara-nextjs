export default function getAppFonts() {
  return [
    <link rel="preconnect" href="https://fonts.googleapis.com"></link>,
    <link
      // @ts-ignore
      crossOrigin
      rel="preconnect"
      href="https://fonts.gstatic.com"
    ></link>,
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
      rel="stylesheet"
    ></link>,
  ];
}
