import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Prestige Properties</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md opacity-80">
              Your trusted partner in finding the perfect property. We specialize in residential and commercial real estate across the metro area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-sm font-semibold tracking-wide uppercase mb-4 block">Quick Links</span>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                Home
              </Link>
              <Link to="/services" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                Services
              </Link>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                About
              </Link>
              <Link to="/listings" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                Listings
              </Link>
              <Link to="/consultation" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                Consultation
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <span className="text-sm font-semibold tracking-wide uppercase mb-4 block">Contact</span>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-80">+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-80">info@prestigeproperties.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-80">123 Market Street, Suite 500</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80">
            © 2026 Prestige Properties. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
              <span className="text-sm">Privacy Policy</span>
            </Link>
            <Link to="/terms" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
              <span className="text-sm">Terms of Service</span>
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-4 mt-6">
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-105" aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-105" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-105" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-105" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;