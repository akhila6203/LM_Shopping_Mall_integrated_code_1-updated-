import "./index.css"; 
import Providers from "./Providers"; // Providers file ko import kiya

export const metadata = {
  title: "My Next.js App",
  description: "Next.js project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Saari app ab Providers ke andar wrap ho gayi */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}