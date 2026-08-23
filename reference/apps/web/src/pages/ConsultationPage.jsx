import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ConsultationForm from '@/components/ConsultationForm.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
const ConsultationPage = () => {
  const contactInfo = [{
    icon: MapPin,
    title: 'Office Address',
    details: <>
          123 Market Street, Suite 500<br />
          San Francisco, CA 94105
        </>
  }, {
    icon: Phone,
    title: 'Phone Number',
    details: '+1 (555) 234-5678'
  }, {
    icon: Mail,
    title: 'Email Address',
    details: 'info@prestigeproperties.com'
  }, {
    icon: Clock,
    title: 'Business Hours',
    details: <>
          Monday - Friday: 9:00 AM - 6:00 PM<br />
          Saturday: 10:00 AM - 4:00 PM
        </>
  }];
  return <>
      <Helmet>
        <title>Schedule Consultation - Prestige Properties</title>
        <meta name="description" content="Schedule a free consultation with our real estate experts. Get personalized guidance for buying, selling, or renting properties." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" style={{
                letterSpacing: '-0.02em'
              }}>
                  Ready to stop searching and start living?
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Reach out for a focused discussion about your real estate goals. We'll help you navigate the market with confidence.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Content Section - Updated with bg-primary and text-primary-foreground */}
          <section className="py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Left Column: Contact Information */}
                <div className="lg:col-span-4 space-y-6">
                  <motion.div initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.6,
                  delay: 0.2
                }}>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                        Get in Touch
                      </h2>
                      <p className="text-primary-foreground/80 leading-relaxed">
                        Prefer to reach out directly? Use our contact details below or fill out the form to schedule a dedicated consultation time.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {contactInfo.map((item, index) => {
                      const Icon = item.icon;
                      return <motion.div key={index} initial={{
                        opacity: 0,
                        y: 10
                      }} animate={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.1
                      }}>
                            <Card className="border-primary-foreground/20 shadow-sm bg-primary-foreground/10 backdrop-blur-sm">
                              <CardContent className="p-5 flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
                                  <Icon className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-primary-foreground text-lg mb-1">
                                    {item.title}
                                  </h3>
                                  <p className="text-primary-foreground/80 leading-relaxed">
                                    {item.details}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>;
                    })}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column: Consultation Form */}
                <div className="lg:col-span-8">
                  <motion.div initial={{
                  opacity: 0,
                  y: 30
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.6,
                  delay: 0.4
                }}>
                    <Card className="shadow-xl border border-primary-foreground/20 rounded-2xl overflow-hidden bg-primary-foreground/10 backdrop-blur-sm">
                      <CardContent className="p-6 sm:p-10 md:p-12">
                        <ConsultationForm />
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>;
};
export default ConsultationPage;