import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Event Booking Platform",
  description: "Full-stack event booking and ticketing web application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}