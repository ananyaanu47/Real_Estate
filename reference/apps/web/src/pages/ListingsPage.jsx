import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ListingsPage = () => {
  const buyProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1621819412756-6a4173cb905c',
      price: '$487,500',
      bedrooms: 3,
      bathrooms: 2,
      location: 'Downtown District',
      type: 'House'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1694678924843-708990017372',
      price: '$625,000',
      bedrooms: 4,
      bathrooms: 3,
      location: 'Riverside Heights',
      type: 'Villa'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324',
      price: '$342,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Parkside Commons',
      type: 'Condo'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1529405730888-1e9ce6b74bc3',
      price: '$895,000',
      bedrooms: 5,
      bathrooms: 4,
      location: 'Lakefront Estates',
      type: 'Estate'
    }
  ];

  const rentProperties = [
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1621819412756-6a4173cb905c',
      price: '$2,450',
      frequency: '/month',
      bedrooms: 2,
      bathrooms: 2,
      location: 'City Center',
      type: 'Apartment'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1694678924843-708990017372',
      price: '$3,200',
      frequency: '/month',
      bedrooms: 3,
      bathrooms: 2,
      location: 'Marina District',
      type: 'Townhouse'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324',
      price: '$1,875',
      frequency: '/month',
      bedrooms: 1,
      bathrooms: 1,
      location: 'Arts Quarter',
      type: 'Studio'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1529405730888-1e9ce6b74bc3',
      price: '$4,100',
      frequency: '/month',
      bedrooms: 4,
      bathrooms: 3,
      location: 'Suburban Grove',
      type: 'House'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Property Listings - Prestige Properties</title>
        <meta name="description" content="Browse our current portfolio of properties available for purchase and rent. Find your next home or investment opportunity." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{letterSpacing: '-0.02em'}}>
                  Available properties
                </h1>
                <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                  Discover your next home from our curated selection of premium properties
                </p>
              </motion.div>
            </div>
          </section>

          {/* Properties for Buy Section */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Properties for buy
                </h2>
                <p className="text-lg text-muted-foreground">
                  Investment opportunities and dream homes ready for purchase
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {buyProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Properties for Rent Section */}
          <section className="py-20 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Properties for rent
                </h2>
                <p className="text-lg text-muted-foreground">
                  Flexible rental options for every lifestyle and budget
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rentProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ListingsPage;