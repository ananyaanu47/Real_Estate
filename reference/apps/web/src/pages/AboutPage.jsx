import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AboutPage = () => {
  const expertise = [{
    icon: Award,
    label: 'Licensed Professional',
    value: '15+ years'
  }, {
    icon: Users,
    label: 'Happy Clients',
    value: '847+'
  }, {
    icon: TrendingUp,
    label: 'Properties Sold',
    value: '$124M'
  }, {
    icon: Star,
    label: 'Client Satisfaction',
    value: '97.2%'
  }];
  const testimonials = [{
    name: 'Sofia Andersson',
    role: 'Home Buyer',
    content: 'Working with this team made our first home purchase smooth and stress-free. They guided us through every step and negotiated an excellent price.',
    rating: 5
  }, {
    name: 'Raj Patel',
    role: 'Property Investor',
    content: 'Their market knowledge is exceptional. They helped me identify undervalued properties and build a portfolio that exceeded my investment goals.',
    rating: 5
  }, {
    name: 'Maya Torres',
    role: 'Home Seller',
    content: 'Sold our property in just 18 days at full asking price. The marketing strategy and professional staging made all the difference.',
    rating: 5
  }];
  return <>
      <Helmet>
        <title>About Us - Prestige Properties</title>
        <meta name="description" content="Meet our experienced real estate professionals with over 15 years of expertise in residential and commercial property transactions." />
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
                  Your trusted real estate partner
                </h1>
                <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                  With over 15 years of experience in residential and commercial real estate, we bring deep market knowledge and unwavering commitment to every transaction.
                </p>
              </motion.div>
            </div>
          </section>

          {/* About Content Section */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6
              }} viewport={{
                once: true
              }}>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    Meet John Franko
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Our approach combines data-driven insights with personalized service to deliver results that exceed expectations. Whether you are buying your first home, selling an investment property, or searching for the perfect rental, we are here to guide you every step of the way.
                  </p>
                </motion.div>

                <motion.div initial={{
                opacity: 0,
                x: 20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6,
                delay: 0.2
              }} viewport={{
                once: true
              }}>
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a" alt="Professional real estate agent portrait" className="w-full h-auto rounded-2xl shadow-lg" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Expertise Section */}
          <section className="py-20 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {expertise.map((item, index) => {
                const Icon = item.icon;
                return <motion.div key={index} initial={{
                  opacity: 0,
                  y: 20
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }} viewport={{
                  once: true
                }}>
                      <Card className="text-center shadow-lg rounded-2xl">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-3xl font-bold text-foreground mb-2">{item.value}</p>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>;
              })}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            }} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Client testimonials
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Hear from those who have trusted us with their property needs
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: index * 0.1
              }} viewport={{
                once: true
              }}>
                    <Card className="shadow-lg rounded-2xl h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex mb-4">
                          {Array.from({
                        length: testimonial.rating
                      }).map((_, i) => <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />)}
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                          "{testimonial.content}"
                        </p>
                        <div className="mt-auto">
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>)}
              </div>
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
export default AboutPage;