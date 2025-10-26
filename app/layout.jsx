import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Wallex – Decentralized Financial Solution',
  description: 'Wallex ecosystem — WALXUSD dashboard',
}

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container">
          <main className="py-8">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
