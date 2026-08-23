import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms of Service | Prestige Properties</title>
        <meta name="description" content="Read the terms of service and conditions for using the Prestige Properties website and services." />
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
              <span className="text-foreground">Terms of Service</span>
            </nav>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">Effective Date: April 20, 2026</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  These Terms of Service ("Terms") govern your access to and use of the Prestige Properties website, services, 
                  and applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by 
                  these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">2. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>As a user of our Services, you agree to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Provide accurate, current, and complete information when creating an account or submitting inquiries.</li>
                  <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                  <li>Be at least 18 years of age and have the legal capacity to enter into binding contracts.</li>
                  <li>Promptly update any information you provide to us to keep it accurate and complete.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">3. Property Listing Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  The property information provided on this website is for informational purposes only. While we strive to present 
                  accurate and up-to-date information, property listings (including pricing, availability, dimensions, and features) 
                  are subject to change without notice. All information should be independently verified. Prestige Properties assumes 
                  no liability for inaccuracies or typographical errors in property listings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">4. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  To the maximum extent permitted by applicable law, Prestige Properties and its agents shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                  directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access 
                  to or use of or inability to access or use the Services; or (b) any conduct or content of any third party on the Services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">5. Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  All content, design, graphics, compilation, magnetic translation, digital conversion, and other matters related to the 
                  Site are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, 
                  use, or publication by you of any such matters or any part of the Site is strictly prohibited.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">6. User Conduct and Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>You agree not to engage in any of the following prohibited activities:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Using automated systems (such as bots, spiders, or scrapers) to access or extract data from the Services.</li>
                  <li>Submitting false, fraudulent, or misleading property inquiries.</li>
                  <li>Interfering with, disrupting, or creating an undue burden on the Services or the networks connected to the Services.</li>
                  <li>Attempting to bypass any measures of the Site designed to prevent or restrict access to the Site.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">7. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>
                  Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, 
                  interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, 
                  shall be determined by arbitration in Los Angeles, California before one arbitrator. Judgment on the Award may be entered 
                  in any court having jurisdiction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-muted/30">
              <CardHeader>
                <CardTitle className="text-2xl">8. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg text-muted-foreground">
                <p>If you have any questions about these Terms, please contact our legal team:</p>
                <div className="mt-4 space-y-1">
                  <p className="font-medium text-foreground">Prestige Properties Legal Department</p>
                  <p>Email: <a href="mailto:legal@prestigeproperties.com" className="text-primary hover:underline">legal@prestigeproperties.com</a></p>
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

export default TermsOfServicePage;