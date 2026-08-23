import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
const HomePage = () => {
  const featuredProperties = [{
    id: 1,
    image: 'https://images.unsplash.com/photo-1621819412756-6a4173cb905c',
    price: '$487,500',
    bedrooms: 3,
    bathrooms: 2,
    location: 'Downtown District',
    type: 'For Sale'
  }, {
    id: 2,
    image: 'https://images.unsplash.com/photo-1694678924843-708990017372',
    price: '$625,000',
    bedrooms: 4,
    bathrooms: 3,
    location: 'Riverside Heights',
    type: 'For Sale'
  }];
  const testimonials = [{
    name: 'Sarah Johnson',
    rating: 5,
    quote: 'Working with this agent made all the difference. They found us the perfect home in just two weeks!'
  }, {
    name: 'Michael Chen',
    rating: 5,
    quote: 'Professional, responsive, and truly cares about their clients. Highly recommended!'
  }, {
    name: 'Emily Rodriguez',
    rating: 4,
    quote: 'Great experience from start to finish. Made the selling process smooth and stress-free.'
  }];
  return <>
      <Helmet>
        <title>Prestige Properties - Find Your Dream Property</title>
        <meta name="description" content="Discover exceptional residential and commercial properties in prime locations. Expert guidance for buying, selling, and renting real estate." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[100dvh] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1700074788751-34099265f014" alt="Luxury modern home exterior with pool and landscaping" className="w-full h-full object-cover" />
              <div className="hero-overlay"></div>
            </div>
            
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{
              letterSpacing: '-0.02em'
            }}>
                Find your dream property
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                Discover exceptional homes and investment opportunities in prime locations with personalized guidance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/listings">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98]">
                    View Listings
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/consultation">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 active:scale-[0.98]">
                    Schedule Consultation
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* About Me Section */}
          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
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
              }} className="relative">
                  <div className="aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a" alt="Professional real estate agent portrait" className="w-full h-full object-cover" />
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full -z-10 blur-2xl"></div>
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    About me
                  </h2>
                  <div className="space-y-6 text-lg text-muted-foreground mb-10 leading-relaxed">
                    <p>
                      With a deep understanding of the local market and a commitment to personalized service, I help clients navigate their real estate journey with confidence and clarity.
                    </p>
                    <p>
                      Whether you are buying your first home, selling a cherished family property, or expanding your investment portfolio, my goal is to deliver exceptional results tailored to your unique needs and timeline.
                    </p>
                  </div>
                  <Link to="/about">
                    <Button size="lg" className="text-base px-8 py-6 transition-all duration-200 active:scale-[0.98]">
                      Learn more
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Featured Properties Section */}
          <section className="py-20 bg-muted/30">
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
                  Featured properties
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Handpicked selections from our premium portfolio
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredProperties.map((property, index) => <motion.div key={property.id} initial={{
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
                    <PropertyCard property={property} />
                  </motion.div>)}
              </div>

              <div className="text-center mt-12">
                <Link to="/listings">
                  <Button variant="outline" size="lg" className="transition-all duration-200 active:scale-[0.98]">
                    View All Properties
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24 bg-background">
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
            }} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  What my clients say
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Real stories from people who found their perfect property with us
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
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border-border/50 bg-card">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex mb-6">
                          {Array.from({
                        length: 5
                      }).map((_, i) => <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-secondary fill-secondary' : 'text-muted fill-muted'}`} />)}
                        </div>
                        <blockquote className="flex-1 mb-8">
                          <p className="text-muted-foreground italic leading-relaxed text-lg">
                            "{testimonial.quote}"
                          </p>
                        </blockquote>
                        <div className="mt-auto">
                          <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>)}
              </div>
            </div>
          </section>

          {/* Call-to-Action Section */}
          <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.7
            }} viewport={{
              once: true
            }}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Ready to transform yourspace?
                </h2>
                <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Take the next step in your real estate journey. Let's discuss your goals and how we can make them a reality together.
                </p>
                <Link to="/consultation">
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-1 shadow-xl hover:shadow-2xl text-lg px-10 py-7 transition-all duration-300 active:scale-95 rounded-full">
                    Book a Free Consultation
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>;
};
export default HomePage;