
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';

export function ReserveDate() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [message, setMessage] = useState('');
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Get today's date to disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  // Get user session and fetch user ID
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        // Get session from API endpoint instead of direct call
        const sessionResponse = await fetch('/api/get-session');
        const sessionResult = await sessionResponse.json();
        
        if (!sessionResult.success || !sessionResult.user?.email) {
          setMessage('Please log in to make a reservation');
          setIsLoadingSession(false);
          return;
        }

        setUserEmail(sessionResult.user.email);

        // Fetch user ID from database using email
        const response = await fetch('/api/get-user-by-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: sessionResult.user.email,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          setUserId(result.user.id);
        } else {
          setMessage('Error: User not found');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        setMessage('Error loading user information');
      } finally {
        setIsLoadingSession(false);
      }
    };

    fetchUserSession();
  }, []);

  // Fetch reserved dates from database
  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await fetch('/api/get-reserved-dates');
        const result = await response.json();
        
        if (result.success) {
          // Convert ISO strings back to Date objects
          const dates = result.reservedDates.map((dateStr: string) => new Date(dateStr));
          setReservedDates(dates);
        } else {
          console.error('Failed to fetch reserved dates:', result.error);
        }
      } catch (error) {
        console.error('Error fetching reserved dates:', error);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    fetchReservedDates();
  }, []);

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < today) return true;
    
    // Disable already reserved dates
    return reservedDates.some(reservedDate => {
      const reserved = new Date(reservedDate);
      reserved.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return reserved.getTime() === checkDate.getTime();
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setMessage(''); // Clear any previous messages
  };

  const handleSubmitReservation = async () => {
    if (!selectedDate) {
      setMessage('Please select a date first');
      return;
    }

    if (!userId) {
      setMessage('User not authenticated. Please log in.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/reserve-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          userId: userId, // Include user ID in the request
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Date reserved successfully!');
        // Add the newly reserved date to the list
        setReservedDates(prev => [...prev, selectedDate]);
        setSelectedDate(undefined); // Clear selection after successful reservation
      } else {
        setMessage('Error: ' + (result.error || 'Failed to reserve date'));
      }
    } catch (error) {
      setMessage('Network error: Please try again');
      console.error('Reservation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSession || isLoadingReservations) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>
            {isLoadingSession ? 'Loading user session...' : 'Loading available dates...'}
          </span>
        </CardContent>
      </Card>
    );
  }

  if (!userId) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Authentication Required</p>
            <p className="text-sm text-muted-foreground">
              Please log in to make a reservation
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Reserve a Date
        </CardTitle>
        <CardDescription>
          Select a future date for your 3D printing reservation
        </CardDescription>
        {userEmail && (
          <div className="text-sm text-muted-foreground">
            Reserving for: {userEmail}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar Component */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled} // Use our custom disabled function
            className="rounded-md border"
          />
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">Selected Date:</span>
            </div>
            <p className="text-lg mt-1">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitReservation}
          disabled={!selectedDate || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Reserving...' : 'Reserve This Date'}
        </Button>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-md text-center ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}