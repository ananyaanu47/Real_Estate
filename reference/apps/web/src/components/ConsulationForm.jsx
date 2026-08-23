import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "11:00 AM - 11:30 AM",
  "01:00 PM - 01:30 PM",
  "02:00 PM - 02:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM"
];

const ConsultationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  const onSubmit = async (data) => {
    if (!selectedDate) {
      toast.error('Please select a date for your consultation');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const submissionData = {
      ...data,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      timestamp: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('consultations') || '[]');
    submissions.push(submissionData);
    localStorage.setItem('consultations', JSON.stringify(submissions));
    
    toast.success("Thank you! Your consultation has been scheduled. We'll contact you shortly to confirm.");
    
    reset();
    setSelectedDate(null);
    setSelectedTime(null);
    setIsSubmitting(false);
  };

  // Disable dates before 7 days from now
  const disabledDays = (date) => {
    const minDate = addDays(new Date(), 6); // 6 because today + 6 = 7th day
    minDate.setHours(0, 0, 0, 0);
    return date < minDate;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="border-b border-primary-foreground/20 pb-4">
          <h3 className="text-xl font-semibold text-primary-foreground">Personal Details</h3>
          <p className="text-sm text-primary-foreground/80">Please provide your contact information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-primary-foreground font-medium">
              First Name <span className="text-red-300">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="Jane"
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && <p className="text-sm text-red-300">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-primary-foreground font-medium">
              Last Name <span className="text-red-300">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && <p className="text-sm text-red-300">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary-foreground font-medium">
              Email Address <span className="text-red-300">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane.doe@example.com"
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-primary-foreground font-medium">
              Phone Number <span className="text-red-300">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[0-9\s\-\(\)]+$/,
                  message: 'Invalid phone format'
                },
                minLength: {
                  value: 10,
                  message: 'Phone number must be at least 10 digits'
                }
              })}
            />
            {errors.phone && <p className="text-sm text-red-300">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service" className="text-primary-foreground font-medium">
            Service Needed <span className="text-red-300">*</span>
          </Label>
          <Select onValueChange={(value) => setValue('service', value)}>
            <SelectTrigger className="bg-background text-foreground border-border">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buying">Buying</SelectItem>
              <SelectItem value="selling">Selling</SelectItem>
              <SelectItem value="renting">Renting</SelectItem>
              <SelectItem value="valuation">Property Valuation</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register('service', { required: 'Please select a service' })} />
          {errors.service && <p className="text-sm text-red-300">{errors.service.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-primary-foreground font-medium">
            Message <span className="text-red-300">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us a bit about your goals..."
            className="min-h-[120px] bg-background text-foreground border-border placeholder:text-muted-foreground"
            {...register('message', { 
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters'
              }
            })}
          />
          {errors.message && <p className="text-sm text-red-300">{errors.message.message}</p>}
        </div>
      </div>

      {/* Scheduling Section */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-primary-foreground/20 pb-4">
          <h3 className="text-xl font-semibold text-primary-foreground">Schedule Your Call</h3>
          <p className="text-sm text-primary-foreground/80">Select a date and time for our consultation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-primary-foreground font-medium">
              <CalendarIcon className="w-4 h-4 text-primary-foreground" />
              Select Date
            </Label>
            <div className="border border-border rounded-xl p-3 bg-background text-foreground inline-block w-full max-w-[350px] mx-auto lg:mx-0 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                disabled={disabledDays}
                className="w-full"
              />
            </div>
            {!selectedDate && (
              <p className="text-sm text-primary-foreground/80 mt-2">
                * Appointments must be booked at least 7 days in advance.
              </p>
            )}
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-primary-foreground font-medium">
              <Clock className="w-4 h-4 text-primary-foreground" />
              Select Time
            </Label>
            
            {selectedDate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border text-center",
                      selectedTime === slot 
                        ? "bg-secondary text-secondary-foreground border-secondary shadow-md scale-[1.02]" 
                        : "bg-background text-foreground border-border hover:border-primary hover:bg-muted"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-primary-foreground/20 rounded-xl bg-primary-foreground/5 p-6 text-center">
                <CalendarIcon className="w-8 h-8 text-primary-foreground/50 mb-3" />
                <p className="text-primary-foreground/80">Please select a date first to view available time slots.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-primary-foreground/20">
        <Button 
          type="submit" 
          size="lg"
          className="w-full md:w-auto md:min-w-[250px] text-lg py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Call'}
        </Button>
      </div>
    </form>
  );
};

export default ConsultationForm;