// app/layout.js
import "./globals.css";

export const metadata = {
  title: "LPU Food Guide – Campus Food Assistant",
  description: "AI chatbot to find and compare food places at LPU campus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
