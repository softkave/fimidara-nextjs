export default function getAppFonts() {
  return [
    <link rel="preconnect" href="https://fonts.googleapis.com" />,
    // @ts-ignore
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />,
    <link
      href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
      rel="stylesheet"
    />,
  ];
}
