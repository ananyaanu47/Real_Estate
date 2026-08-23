import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Bed, Bath, Square, Calendar, CheckCircle2, ArrowLeft, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ImageGallery from '@/components/ImageGallery.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Architectural Masterpiece',
    location: '1234 Skyline Boulevard, Beverly Hills, CA 90210',
    price: '$4,250,000',
    type: 'Single Family Home',
    status: 'Active',
    bedrooms: 5,
    bathrooms: 6.5,
    squareFeet: '6,200',
    yearBuilt: '2023',
    description: 'Experience unparalleled luxury in this newly constructed architectural masterpiece. Featuring floor-to-ceiling glass walls that seamlessly blend indoor and outdoor living, this home offers panoramic city and ocean views. The chef\'s kitchen is equipped with top-of-the-line Wolf and Sub-Zero appliances, custom Italian cabinetry, and a massive waterfall edge island. The primary suite is a true sanctuary with a private terrace, dual walk-in closets, and a spa-like bathroom featuring a soaking tub with skyline views.',
    neighborhood: 'Located in the prestigious Trousdale Estates, this property offers ultimate privacy while being just minutes away from world-class dining, shopping on Rodeo Drive, and top-rated schools. The neighborhood is known for its mid-century modern architecture and celebrity residents.',
    images: [
      'https://images.unsplash.com/photo-1678575326996-a1bf09b86158',
      'https://images.unsplash.com/photo-1703023428152-133db49ad592',
      'https://images.unsplash.com/photo-1626249893783-cc4a9f66880a',
      'https://images.unsplash.com/photo-1565621430539-8a273055fab5',
      'https://images.unsplash.com/photo-1650103690657-95e964260e9e',
      'https://images.unsplash.com/photo-1635517477292-84f5cbec3c63',
      'https://images.unsplash.com/photo-1673465494328-677778df874d',
      'https://images.unsplash.com/photo-1616594092403-fb65629b0a46',
      'https://images.unsplash.com/photo-1663811396038-7a21d4eef49e',
    ],
    features: ['Smart Home System', 'Multi-zone HVAC', '3-Car Garage', 'Landscaped Garden', 'Security System', 'Infinity Pool', 'Wine Cellar', 'Home Theater'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '2',
    title: 'Downtown Luxury Penthouse',
    location: '888 Metro Way, Apt 4500, Los Angeles, CA 90015',
    price: '$2,850,000',
    type: 'Penthouse',
    status: 'Active',
    bedrooms: 3,
    bathrooms: 3.5,
    squareFeet: '3,100',
    yearBuilt: '2019',
    description: 'Soar above the city in this spectacular corner penthouse. Boasting 14-foot ceilings and wrap-around floor-to-ceiling windows, the natural light and unobstructed skyline views are truly breathtaking. The open-concept living area flows into a state-of-the-art kitchen with Miele appliances and quartz countertops. Residents enjoy exclusive access to five-star building amenities including a rooftop pool, private helipad, and 24/7 concierge service.',
    neighborhood: 'Situated in the heart of South Park, you are steps away from the Crypto.com Arena, LA Live, and some of the city\'s finest dining and entertainment venues.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      'https://images.unsplash.com/photo-1562188208-a02e9abcda84',
    ],
    features: ['Wrap-around Balcony', '14ft Ceilings', 'Motorized Shades', 'Rooftop Pool Access', '24/7 Concierge', 'Valet Parking', 'Fitness Center'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '3',
    title: 'Serene Coastal Retreat',
    location: '45 Ocean Breeze Drive, Malibu, CA 90265',
    price: '$8,900,000',
    type: 'Estate',
    status: 'Pending',
    bedrooms: 6,
    bathrooms: 8,
    squareFeet: '8,500',
    yearBuilt: '2015',
    description: 'A rare opportunity to own a slice of paradise. This magnificent coastal estate offers direct beach access and sweeping ocean views from almost every room. The property features a resort-style backyard with a zero-edge pool, outdoor kitchen, and sunken fire pit. Inside, the coastal-chic design incorporates natural materials, vaulted beamed ceilings, and a spectacular double-height great room.',
    neighborhood: 'Located on a private, gated street in Malibu, offering the perfect blend of seclusion and accessibility to the Pacific Coast Highway.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
    ],
    features: ['Direct Beach Access', 'Zero-edge Pool', 'Outdoor Kitchen', 'Guest House', 'Tennis Court', 'Spa/Sauna', 'Ocean Views'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '4',
    title: 'Historic Craftsman Bungalow',
    location: '1122 Maple Street, Pasadena, CA 91106',
    price: '$1,450,000',
    type: 'Single Family Home',
    status: 'Active',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: '2,100',
    yearBuilt: '1918',
    description: 'Meticulously restored to its original glory, this 1918 Craftsman bungalow blends historic charm with modern convenience. Original details include rich mahogany woodwork, built-in cabinetry, stained glass windows, and a classic Batchelder tile fireplace. The updated kitchen features custom period-appropriate cabinetry and modern stainless steel appliances. The lush backyard is an entertainer\'s dream with a large deck and mature fruit trees.',
    neighborhood: 'Nestled in the historic Bungalow Heaven district, known for its tree-lined streets, strong community feel, and proximity to Old Pasadena.',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b',
    ],
    features: ['Original Woodwork', 'Batchelder Fireplace', 'Updated Kitchen', 'Large Deck', 'Mature Fruit Trees', 'Detached Studio', 'Historic Designation'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '5',
    title: 'Sleek Urban Loft',
    location: '500 Arts District Blvd, Unit 302, Los Angeles, CA 90013',
    price: '$985,000',
    type: 'Loft',
    status: 'Active',
    bedrooms: 1,
    bathrooms: 1.5,
    squareFeet: '1,450',
    yearBuilt: '2008',
    description: 'Embrace industrial-chic living in this stunning Arts District loft. Featuring exposed brick walls, polished concrete floors, and massive industrial windows that flood the space with natural light. The open floor plan allows for flexible living arrangements, while the modern kitchen boasts stainless steel countertops and high-end appliances. Includes one secure underground parking space.',
    neighborhood: 'Located in the vibrant Arts District, surrounded by trendy galleries, hip coffee shops, acclaimed breweries, and some of the city\'s most innovative restaurants.',
    images: [
      'https://images.unsplash.com/photo-1600607686527-6fb886090705',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
    ],
    features: ['Exposed Brick', 'Concrete Floors', 'Industrial Windows', 'In-unit Laundry', 'Secure Parking', 'Rooftop Deck', 'Pet Friendly'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '6',
    title: 'Modern Downtown Loft',
    location: '1000 1st Avenue, Unit 405, Seattle, WA 98104',
    price: '$850,000',
    type: 'Loft',
    status: 'Active',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: '1,200',
    yearBuilt: '2015',
    description: 'Experience the ultimate urban lifestyle in this contemporary downtown loft. Featuring soaring 15-foot ceilings, exposed ductwork, and floor-to-ceiling windows that offer stunning city views. The chef-inspired kitchen boasts quartz countertops, custom cabinetry, and premium stainless steel appliances. The primary suite includes a custom walk-in closet and a spa-like bathroom with a glass-enclosed rain shower.',
    neighborhood: 'Located in the heart of downtown, just steps away from world-class dining, shopping, and entertainment. Enjoy easy access to public transit and major tech hubs in a vibrant urban setting.',
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
      'https://images.unsplash.com/photo-1497366216548-37526070297c',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    ],
    features: ['15-foot Ceilings', 'Exposed Ductwork', 'Floor-to-Ceiling Windows', 'Quartz Countertops', 'In-unit Laundry', 'Fitness Center Access', 'Secure Parking'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '7',
    title: 'Suburban Family Home',
    location: '456 Meadow Lane, Austin, TX 78759',
    price: '$650,000',
    type: 'Single Family Home',
    status: 'Active',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: '2,500',
    yearBuilt: '2005',
    description: 'This beautifully updated family home offers the perfect blend of comfort and style. The open-concept main floor features a spacious living room with a cozy fireplace, leading into a modern kitchen with a large center island and walk-in pantry. The expansive backyard is an entertainer\'s dream, complete with a covered patio, built-in BBQ, and plenty of room for a pool. Upstairs, you\'ll find a versatile bonus room and four generously sized bedrooms.',
    neighborhood: 'Nestled in a quiet, tree-lined suburban neighborhood known for its excellent schools, community parks, family-friendly atmosphere, and convenient access to local shopping centers.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
    ],
    features: ['Open-concept Layout', 'Kitchen Island', 'Walk-in Pantry', 'Covered Patio', 'Built-in BBQ', 'Bonus Room', 'Two-car Garage'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  },
  {
    id: '8',
    title: 'Waterfront Cottage',
    location: '321 Bayview Drive, Portland, ME 04101',
    price: '$1,200,000',
    type: 'Cottage',
    status: 'Active',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: '1,800',
    yearBuilt: '1985',
    description: 'Wake up to the sound of waves in this charming waterfront cottage. Offering panoramic views of the bay, this home features a wrap-around deck perfect for enjoying spectacular sunsets. Inside, the open living area is highlighted by a stone fireplace, vaulted ceilings, and large picture windows. The updated kitchen includes custom shaker cabinets and butcher block countertops. A private dock provides direct water access for boating and kayaking.',
    neighborhood: 'A serene coastal community offering a peaceful retreat while being just a short scenic drive from local seafood restaurants, boutique shops, and historical landmarks.',
    images: [
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607',
    ],
    features: ['Private Dock', 'Wrap-around Deck', 'Stone Fireplace', 'Panoramic Water Views', 'Vaulted Ceilings', 'Butcher Block Counters', 'Outdoor Shower'],
    agent: {
      name: 'John Franko',
      phone: '(555) 876-5432',
      email: 'john.franko@prestigeproperties.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
    }
  }
];

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    const timer = setTimeout(() => {
      const foundProperty = MOCK_PROPERTIES.find(p => p.id === id);
      setProperty(foundProperty || null);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [id]);

  const handleContactAgent = () => {
    toast.success('Message sent!', {
      description: `We've notified ${property.agent.name}. They will contact you shortly.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-3/4 md:w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <Skeleton className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-4xl font-bold text-foreground">Property Not Found</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              We couldn't find the property you're looking for. It may have been removed or the URL is incorrect.
            </p>
            <Button asChild size="lg">
              <Link to="/listings">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Listings
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{`${property.title} | Prestige Properties`}</title>
        <meta name="description" content={`View details for ${property.location}. ${property.bedrooms} beds, ${property.bathrooms} baths, ${property.price}.`} />
      </Helmet>

      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-primary text-primary-foreground">{property.status}</Badge>
                <Badge variant="outline">{property.type}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight" style={{ textWrap: 'balance' }}>
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
              {property.price}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <ImageGallery images={property.images} title={property.title} />
              </section>

              {/* Key Stats Bar */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted rounded-2xl">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Bed className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold tabular-nums">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground font-medium">Bedrooms</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Bath className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold tabular-nums">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground font-medium">Bathrooms</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Square className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold tabular-nums">{property.squareFeet}</div>
                    <div className="text-sm text-muted-foreground font-medium">Square Feet</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold tabular-nums">{property.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground font-medium">Year Built</div>
                  </div>
                </div>
              </section>

              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">About This Property</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="leading-relaxed">{property.description}</p>
                </div>
              </section>

              <Separator />

              {/* Features */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Features & Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Neighborhood */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Neighborhood</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {property.neighborhood}
                </p>
              </section>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="shadow-lg border-0 ring-1 ring-border/50 overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Listed Price</p>
                      <div className="text-4xl font-bold text-foreground tabular-nums">{property.price}</div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button className="w-full text-lg h-14 transition-all duration-200 active:scale-[0.98]" asChild>
                        <Link to="/consultation">
                          Schedule Viewing
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-lg h-14 transition-all duration-200 active:scale-[0.98]"
                        onClick={handleContactAgent}
                      >
                        Contact Agent
                      </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                          <img 
                            src={property.agent.image} 
                            alt={`Agent ${property.agent.name}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-foreground">{property.agent.name}</h4>
                          <p className="text-sm text-muted-foreground">Listing Agent</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <a href={`tel:${property.agent.phone.replace(/\D/g,'')}`} className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-4 h-4" />
                          {property.agent.phone}
                        </a>
                        <a href={`mailto:${property.agent.email}`} className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors break-all">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          {property.agent.email}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Info Card */}
                <Card className="bg-muted border-0">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 text-foreground">Prestige Properties</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      123 Market Street, Suite 500<br />
                      Beverly Hills, CA 90210
                    </p>
                    <p className="text-sm text-muted-foreground">
                      DRE #01234567
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;