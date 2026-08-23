import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ServiceCard = ({ icon: Icon, title, description, reverse = false }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className={`${reverse ? 'md:order-2' : ''}`}>
        <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className={`${reverse ? 'md:order-1' : ''}`}>
        <Card className="bg-muted rounded-2xl overflow-hidden">
          <CardContent className="p-0 h-80">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Icon className="w-32 h-32 text-primary/40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceCard;