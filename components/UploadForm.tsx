'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Upload, FileText, DollarSign, Clock, CalendarIcon, Loader2, Calculator } from 'lucide-react';
import processSTLFile from '@/lib/stl_calculator';

export default function UploadForm() {
  const router = useRouter();
  
  // File upload states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Calculated values from STL file
  const [calculatedValues, setCalculatedValues] = useState<{
    dimensions: { x: number; y: number; z: number } | null;
    printTime: number | null;
    price: number | null;
    weight: number | null;
    volume: number | null;
  }>({
    dimensions: null,
    printTime: null,
    price: null,
    weight: null,
    volume: null,
  });
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Reservation states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [reservationMessage, setReservationMessage] = useState('');
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);

  // Get today's date to disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  // File upload handler with STL calculation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.stl')) {
        setSelectedFile(file);
        setMessage('');
        
        // Calculate STL properties
        setIsCalculating(true);
        try {
          const arrayBuffer = await file.arrayBuffer();
          
          // STL calculation parameters (you can adjust these)
          const params = {
            density: 1.25,           // PLA density in g/cm³
            layerHeight: 0.2,        // mm
            printSpeed: 50,          // mm/s
            nozzleDiameter: 0.4,     // mm
            infillPercentage: 0.2,   // 20%
            wallThickness: 0.8,      // mm
            topBottomThickness: 0.8  // mm
          };
          
          const result = await processSTLFile(arrayBuffer, params);
          
          // Calculate price based on weight (example: $0.05 per gram)
          const pricePerGram = 0.05;
          const calculatedPrice = result.weight * pricePerGram;
          
          // Format print time
          const hours = Math.floor(result.printTime / 3600);
          const minutes = Math.floor((result.printTime % 3600) / 60);
          
          setCalculatedValues({
            dimensions: result.dimensions,
            printTime: result.printTime,
            price: calculatedPrice,
            weight: result.weight,
            volume: result.printedVolume,
          });
          
          setMessage(`✅ STL analyzed successfully! Estimated print time: ${hours}h ${minutes}m, Weight: ${result.weight.toFixed(1)}g, Price: $${calculatedPrice.toFixed(2)}`);
        } catch (error) {
          console.error('STL calculation error:', error);
          setMessage('⚠️ Error analyzing STL file. Please ensure it\'s a valid STL file.');
          setCalculatedValues({
            dimensions: null,
            printTime: null,
            price: null,
            weight: null,
            volume: null,
          });
        } finally {
          setIsCalculating(false);
        }
      } else {
        setMessage('Please select a valid .STL file');
        setSelectedFile(null);
      }
    }
  };

  // Get user session and fetch user ID
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        // Get session from API endpoint instead of direct call
        const sessionResponse = await fetch('/api/get-session');
        const sessionResult = await sessionResponse.json();
        
        console.log('Session response:', sessionResult); // Debug log
        
        if (!sessionResult.success || !sessionResult.user?.email) {
          setReservationMessage('Please log in to make a reservation');
          console.log('Session not found or no email'); // Debug log
          setIsLoadingSession(false);
          return;
        }

        setUserEmail(sessionResult.user.email);
        console.log('User email set:', sessionResult.user.email); // Debug log

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
        console.log('User lookup result:', result); // Debug log
        
        if (result.success) {
          setUserId(result.user.id);
          console.log('User ID set:', result.user.id); // Debug log
        } else {
          setReservationMessage('Error: User not found');
          console.log('User not found in database'); // Debug log
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        setReservationMessage('Error loading user information');
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
    setReservationMessage(''); // Clear any previous messages
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Capture the form element at the beginning
    const form = e.currentTarget;

    // Validate that we have calculated values
    if (!calculatedValues.dimensions || calculatedValues.printTime === null || calculatedValues.price === null) {
      setMessage('Please wait for STL file analysis to complete before submitting.');
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated for any operation
    if (!userId) {
      setMessage('User authentication error. Please refresh the page and try again.');
      setIsLoading(false);
      return;
    }

    try {
      let currentReservationId = reservationId;

      // Step 1: Create reservation if date is selected and no reservation exists yet
      if (selectedDate && !reservationId) {
        console.log('Attempting to create reservation with userId:', userId); // Debug log
        
        if (!userId) {
          console.log('userId is null/undefined:', userId); // Debug log
          setMessage('User not authenticated. Please log in.');
          setIsLoading(false);
          return;
        }

        setMessage('Creating reservation...');
        
        const reservationResponse = await fetch('/api/reserve-date', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: selectedDate.toISOString(),
            userId: userId,
          }),
        });

        const reservationResult = await reservationResponse.json();

        if (reservationResult.success) {
          currentReservationId = reservationResult.reservation.id;
          setReservationId(currentReservationId);
          setReservedDates(prev => [...prev, selectedDate]);
          setMessage('Reservation created, now uploading file...');
        } else {
          setMessage('Error creating reservation: ' + (reservationResult.error || 'Failed to reserve date'));
          setIsLoading(false);
          return;
        }
      }

      // Step 2: Upload file and create order
      const formData = new FormData(form);
      
      // Add calculated values to form data
      if (calculatedValues.dimensions) {
        formData.append('sizeX', calculatedValues.dimensions.x.toFixed(2));
        formData.append('sizeY', calculatedValues.dimensions.y.toFixed(2));
        formData.append('sizeZ', calculatedValues.dimensions.z.toFixed(2));
      }
      
      if (calculatedValues.printTime !== null) {
        const hours = Math.floor(calculatedValues.printTime / 3600);
        const minutes = Math.floor((calculatedValues.printTime % 3600) / 60);
        formData.append('printTime', `${hours}h ${minutes}m`);
      }
      
      if (calculatedValues.price !== null) {
        formData.append('price', calculatedValues.price.toFixed(2));
      }
      
      // Add the reservation ID if one was created or already existed
      if (currentReservationId) {
        formData.append('reservationId', currentReservationId.toString());
        console.log('Adding reservationId to formData:', currentReservationId);
      }
      
      // Add the reservation date to the order data
      if (selectedDate) {
        formData.append('reservationDate', selectedDate.toISOString());
        console.log('Adding reservationDate to formData:', selectedDate.toISOString());
      }
      
      // Add the user ID from session
      if (userId) {
        formData.set('userId', userId.toString());
      }
      
      setMessage('Uploading file and creating order...');
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.success) {
        let successMessage = `Order created successfully! Order ID: ${uploadResult.orderId}`;
        
        if (uploadResult.reservationId && uploadResult.reservationDate) {
          const reservationDateFormatted = new Date(uploadResult.reservationDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          successMessage += `\nReservation: ${reservationDateFormatted} (ID: ${uploadResult.reservationId})`;
        }
        
        setMessage(successMessage);
        // Reset form
        form.reset();
        setSelectedFile(null);
        setSelectedDate(undefined);
        setReservationId(null);
        
        // Redirect to myorder page after successful upload
        setTimeout(() => {
          router.push('/myorder');
        }, 2000); // Wait 2 seconds to show success message
      } else {
        setMessage('Error creating order: ' + (uploadResult.error || 'Upload failed'));
      }
    } catch (error) {
      setMessage('Network error: Please try again');
      console.error('Combined submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSession) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading user session...</span>
        </CardContent>
      </Card>
    );
  }

  if (!userId && !isLoadingSession) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Authentication Required</p>
            <p className="text-sm text-muted-foreground mb-4">
              Please log in to create orders. User ID: {userId || 'Not found'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Complete 3D Print Order
        </CardTitle>
        <CardDescription>
          Select a date, upload your .STL file, and create your order in one simple step
        </CardDescription>
        {userEmail && (
          <div className="text-sm text-muted-foreground">
            User: {userEmail} (ID: {userId || 'Loading...'})
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Print Date (Optional)
              </h3>
              <p className="text-muted-foreground mb-4">
                Choose a date for your 3D printing reservation, or leave blank for immediate processing
              </p>
            </div>

            {isLoadingReservations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading available dates...</span>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                {/* Calendar Component */}
                <div className="flex justify-center mb-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    className="rounded-md border"
                  />
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2">
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
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload & Order Details
            </h3>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                STL File *
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".stl"
                required
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>
              )}
              {isCalculating && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing STL file...
                </div>
              )}
            </div>

            {/* User ID (hidden since we get it from session) */}
            <input type="hidden" name="userId" value={userId || ''} />

            {/* Optional Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="review">Special Instructions (Optional)</Label>
                <Textarea
                  id="review"
                  name="review"
                  placeholder="Add any special instructions or notes"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stars">Rating (Optional)</Label>
                <Input
                  id="stars"
                  name="stars"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rate 1-5 stars"
                />
              </div>
            </div>
          </div>

          {/* Single Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading || !selectedFile || !calculatedValues.dimensions || isCalculating}
            className="w-full h-12 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : isCalculating ? (
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 animate-spin" />
                Analyzing STL...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <Upload className="h-4 w-4" />
                {selectedDate ? 'Reserve Date & Create Order' : 'Create Order'}
              </div>
            )}
          </Button>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-md whitespace-pre-line ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
