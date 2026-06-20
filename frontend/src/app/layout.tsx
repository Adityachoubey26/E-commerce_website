import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingParticles } from '../components/FloatingParticles';
import { AIChatBot } from '../components/AIChatBot';
import { CartDrawer } from '../components/CartDrawer';
import { IntroWrapper } from '../components/IntroWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins-custom'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter-custom'
});

export const metadata: Metadata = {
  title: 'ShopEra | Smart Shopping Starts Here.',
  description: 'Experience premium glassmorphic interface designs powered by next-generation Gemini 3.5 shopping recommendations.',
  keywords: ['nextjs', 'ecommerce', 'ai', 'gemini', 'glassmorphism']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative bg-[#F8FAFC] dark:bg-[#090D16] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              
              <IntroWrapper>
                {/* Particle background */}
                <FloatingParticles />

                {/* Header */}
                <Navbar />

                {/* Main Content */}
                <main className="flex-1 relative z-10 w-full">
                  {children}
                </main>

                {/* Global AI Floating Assistant */}
                <AIChatBot />

                {/* Global Cart Slide-out Drawer */}
                <CartDrawer />

                {/* Footer */}
                <Footer />
              </IntroWrapper>

            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
