import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import HomePage from '@/pages/HomePage.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ListingsPage from '@/pages/ListingsPage.jsx';
import ConsultationPage from '@/pages/ConsultationPage.jsx';
import PropertyDetailsPage from '@/pages/PropertyDetailsPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;