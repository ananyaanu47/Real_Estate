import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, TrendingUp, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
const ServicesPage = () => {
  const services = [{
    icon: Home,
    title: 'Buying properties',
    description: 'Navigate the purchase process with confidence. Our experienced team provides comprehensive market analysis, property evaluation, and negotiation support to help you secure the right property at the best price.',
    reverse: false
  }, {
    icon: TrendingUp,
    title: 'Selling properties',
    description: 'Maximize your return with strategic marketing and expert pricing. We leverage cutting-edge technology and our extensive network to showcase your property to qualified buyers and close deals efficiently.',
    reverse: true
  }, {
    icon: Key,
    title: 'Renting properties',
    description: 'Find your ideal rental or connect with quality tenants. Whether you are searching for a temporary home or managing investment properties, we handle tenant screening, lease agreements, and ongoing support.',
    reverse: false
  }];
  return <>
      <Helmet>
        <title>Our Services - Prestige Properties</title>
        <meta name="description" content="Comprehensive real estate services including property buying, selling, and rental management with expert guidance and personalized support." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-primary text-primary-foreground">
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{
                letterSpacing: '-0.02em'
              }}>
                  Professional real estate services
                </h1>
                <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                  Full-service solutions for every stage of your property journey
                </p>
              </motion.div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
              {services.map((service, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} viewport={{
              once: true
            }}>
                  <ServiceCard {...service} />
                </motion.div>)}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} viewport={{
              once: true
            }}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{
                letterSpacing: '-0.02em'
              }}>
                  Ready to transform your property?
                </h2>
                <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Book a free consultation with our expert team to discuss your real estate goals and discover how we can help you succeed.
                </p>
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <Link to="/consultation">
                    Book a Free Consultation
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>;
};
export default ServicesPage;