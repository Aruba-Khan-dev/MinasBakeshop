import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#F0E8DF] to-[#FAC1B5]/20 pt-16 pb-8 border-t border-[#FAC1B5]/30">
      <div className="px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Grid */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-serif mb-4 text-[#2C2C2C]">Minas Bakeshop</h3>
              <p className="text-[#98898D] text-sm leading-relaxed">
                A small, sweet part of your homes and your happiest moments. From everyday cravings to your biggest celebrations.
              </p>
            </div>

            {/* Quick Links - Exact from requirements */}
            <div>
              <h4 className="font-semibold mb-4 text-[#2C2C2C]">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/customize" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    Custom Order
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact - Exact details from requirements */}
            <div>
              <h4 className="font-semibold mb-4 text-[#2C2C2C]">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[#F283AE] mt-1 flex-shrink-0" />
                  <a href="tel:03270203490" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    03270203490
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#F283AE] mt-1 flex-shrink-0" />
                  <a href="mailto:minasbakeshopp@gmail.com" className="text-[#98898D] hover:text-[#F283AE] transition-colors">
                    minasbakeshopp@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#F283AE] mt-1 flex-shrink-0" />
                  <span className="text-[#98898D]">Nawab Town, Lahore, Pakistan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#FAC1B5]/30 pt-8 mb-8">
            {/* Social Links - Exact from requirements */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <span className="text-[#98898D] text-sm font-semibold">Follow Us:</span>
              <a
                href="https://www.instagram.com/minasbakeshopp?igsh=MXZueGVnMzh0MjNmbA=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#98898D] hover:text-[#F283AE] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://wa.me/923270203490"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#98898D] hover:text-[#F283AE] transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bottom - Exact copyright from requirements */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#98898D]">
            <p>&copy; 2024 Minas Bakeshop. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-[#F283AE] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/contact" className="hover:text-[#F283AE] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
