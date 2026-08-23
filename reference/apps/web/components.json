import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, MapPin } from 'lucide-react';

const PropertyCard = ({ property }) => {
  // Ensure we have an ID to link to, fallback to 1 for mock data
  const propertyId = property.id || '1';

  return (
    <Card className="property-card-hover shadow-lg rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={property.image} 
          alt={`${property.bedrooms} bedroom ${property.type} in ${property.location}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {property.type}
        </Badge>
      </div>
      <CardContent className="p-6 flex-1">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-2xl font-bold text-foreground">
            {property.price}
          </h3>
          {property.frequency && (
            <span className="text-sm text-muted-foreground">{property.frequency}</span>
          )}
        </div>
        <div className="flex items-center gap-4 mb-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="text-sm font-medium">{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm font-medium">{property.bathrooms} Bath</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{property.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-3 mt-auto">
        <Button variant="default" className="flex-1 transition-all duration-200 active:scale-[0.98]" asChild>
          <Link to={`/property/${propertyId}`}>
            View Details
          </Link>
        </Button>
        <Button variant="outline" className="flex-1 transition-all duration-200 active:scale-[0.98]" asChild>
          <Link to="/consultation">
            Schedule Viewing
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;