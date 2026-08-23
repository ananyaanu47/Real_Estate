import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy | Prestige Properties</title>
        <meta name="description" content="Learn how Prestige Properties collects, uses, and protects your personal information and data." />
      </Helmet>

      <Header />

      <main className="flex-grow py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Navigation */}
          <div className="mb-8 space-y-4">
            <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground hover:text-foreground">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <nav className="flex items-center text-sm font-medium text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <span className="text-foreground">Privacy Policy</span>
            </nav>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Last updated: April 20, 2026</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  Welcome to Prestige Properties. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you as to how we look after your personal data when you visit our website 
                  and tell you about your privacy rights and how the law protects you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">2. Data Collection</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground space-y-4">
                <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, marital status, title, and date of birth.</li>
                  <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
                  <li><strong>Financial Data:</strong> includes bank account and payment card details, as well as pre-qualification statuses for mortgages.</li>
                  <li><strong>Property Preference Data:</strong> includes criteria for homes you are seeking, saved listings, and neighborhoods of interest.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">3. How We Use Your Data</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>To register you as a new client or website user.</li>
                  <li>To process and deliver services, including facilitating property viewings and real estate transactions.</li>
                  <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
                  <li>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">4. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Request access to your personal data.</li>
                  <li>Request correction of the personal data that we hold about you.</li>
                  <li>Request erasure of your personal data.</li>
                  <li>Object to processing of your personal data.</li>
                  <li>Request the restriction of processing of your personal data.</li>
                  <li>Request the transfer of your personal data to you or to a third party.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">5. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. 
                  If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. 
                  We use cookies strictly for essential site functionality and anonymized traffic analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">6. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  We may share your data with selected third parties to facilitate real estate transactions. This includes Multiple Listing Services (MLS), 
                  escrow companies, title companies, and trusted mortgage brokers. We require all third parties to respect the security of your personal 
                  data and to treat it in accordance with the law.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">7. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an 
                  unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and 
                  other third parties who have a business need to know.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-muted/30">
              <CardHeader>
                <CardTitle className="text-2xl">8. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                <div className="mt-4 space-y-1">
                  <p className="font-medium text-foreground">Prestige Properties Legal Department</p>
                  <p>Email: <a href="mailto:privacy@prestigeproperties.com" className="text-primary hover:underline">privacy@prestigeproperties.com</a></p>
                  <p>Address: 123 Market Street, Suite 500, Beverly Hills, CA 90210</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;