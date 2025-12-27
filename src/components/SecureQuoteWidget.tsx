
import React, { useState, useRef } from 'react';
import { FileUp, Shield, AlertTriangle, Loader2, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validateFileType, validateFileSize, sanitizeInput } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  trackFormStart, 
  trackFormSubmission, 
  trackQuoteCalculate, 
  trackQuoteSubmit, 
  trackFileUpload 
} from '@/lib/analytics';

const SecureQuoteWidget = () => {
  const { toast } = useToast();
  const hasTrackedStart = useRef(false);
  
  const [projectSize, setProjectSize] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Additional form fields for quote request
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('');
  const [notes, setNotes] = useState('');

  const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];
  const maxFileSizeMB = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Track form start on first interaction
    if (!hasTrackedStart.current) {
      trackFormStart('quote_widget');
      hasTrackedStart.current = true;
    }

    // Validate file type
    if (!validateFileType(file, allowedFileTypes)) {
      setFileError('Invalid file type. Please upload PDF, JPEG, PNG, or WebP files only.');
      trackFileUpload(file.type, false);
      e.target.value = '';
      return;
    }

    // Validate file size
    if (!validateFileSize(file, maxFileSizeMB)) {
      setFileError(`File too large. Maximum size is ${maxFileSizeMB}MB.`);
      trackFileUpload(file.type, false);
      e.target.value = '';
      return;
    }

    // Additional security checks
    const fileName = file.name.toLowerCase();
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];
    const hasSuspiciousExtension = suspiciousExtensions.some(ext => fileName.endsWith(ext));
    
    if (hasSuspiciousExtension) {
      setFileError('This file type is not allowed for security reasons.');
      e.target.value = '';
      return;
    }

    // Check for double extensions (e.g., file.pdf.exe)
    const extensionCount = (fileName.match(/\./g) || []).length;
    if (extensionCount > 1) {
      setFileError('Files with multiple extensions are not allowed.');
      trackFileUpload(file.type, false);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    trackFileUpload(file.type, true);
    
    toast({
      title: "File uploaded securely",
      description: `${file.name} has been validated and uploaded safely.`,
      duration: 3000,
    });
  };

  const handleProjectSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = sanitizeInput(value);
    
    // Track form start on first interaction
    if (!hasTrackedStart.current) {
      trackFormStart('quote_widget');
      hasTrackedStart.current = true;
    }
    const numericValue = sanitizedValue.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    // Limit to reasonable size (max 1 million sq ft)
    const numValue = parseFloat(cleanValue);
    if (numValue > 1000000) {
      toast({
        title: "Value too large",
        description: "Please enter a project size under 1,000,000 sq ft.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setProjectSize(cleanValue);
  };

  const calculatePrice = () => {
    const size = parseFloat(projectSize);
    if (!size || size <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid project size.",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }

    if (size < 100) {
      toast({
        title: "Minimum project size",
        description: "Project size must be at least 100 sq ft.",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }

    // Secure calculation with bounds checking
    const baseRate = 2.5;
    const calculatedPrice = Math.round(size * baseRate * 100) / 100;
    
    // Set reasonable maximum
    const maxPrice = 2500000;
    const finalPrice = Math.min(calculatedPrice, maxPrice);
    
    // Track price calculation
    trackQuoteCalculate(size, finalPrice);
    
    setEstimatedPrice(finalPrice);
    return finalPrice;
  };

  const handleSubmitQuote = async () => {
    // Validate required fields
    if (!projectSize || parseFloat(projectSize) < 100) {
      toast({
        title: "Project size required",
        description: "Please enter a project size of at least 100 sq ft.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const calculatedPrice = calculatePrice();
    if (calculatedPrice === null) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          name: name.trim() || null,
          email: email.trim().toLowerCase() || null,
          phone: phone.trim() || null,
          project_type: projectType.trim() || null,
          project_size: parseFloat(projectSize),
          estimated_price: calculatedPrice,
          file_name: selectedFile?.name || null,
          additional_notes: notes.trim() || null,
        });

      if (error) {
        throw error;
      }

      // Send email notifications (don't block on failure)
      try {
        await supabase.functions.invoke('send-quote-email', {
          body: {
            name: name.trim() || null,
            email: email.trim().toLowerCase() || null,
            phone: phone.trim() || null,
            projectType: projectType.trim() || null,
            projectSize: parseFloat(projectSize),
            estimatedPrice: calculatedPrice,
            fileName: selectedFile?.name || null,
            notes: notes.trim() || null,
          },
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the submission if email fails
      }

      // Track successful quote submission
      trackQuoteSubmit(
        parseFloat(projectSize),
        projectType.trim() || 'not_specified',
        calculatedPrice
      );
      trackFormSubmission('quote_widget', true, {
        project_size: parseFloat(projectSize),
        has_file: !!selectedFile,
      });

      setIsSubmitted(true);
      hasTrackedStart.current = false; // Reset for next quote
      
      toast({
        title: "Quote request submitted!",
        description: "We'll review your request and contact you within 24 hours.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      
      // Track failed submission
      trackFormSubmission('quote_widget', false);
      
      toast({
        title: "Submission failed",
        description: "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProjectSize('');
    setSelectedFile(null);
    setEstimatedPrice(null);
    setName('');
    setEmail('');
    setPhone('');
    setProjectType('');
    setNotes('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-buckeye-scarlet rounded-lg p-8 max-w-xl mx-auto shadow-lg border border-buckeye-scarlet/20">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="text-white" size={32} />
          </div>
          <h3 className="text-white text-xl font-semibold">Quote Request Submitted!</h3>
          <p className="text-white/80">
            Thank you for your interest. We'll review your request and get back to you within 24 hours.
          </p>
          {estimatedPrice && (
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-white text-sm">Your Estimated Quote:</p>
              <p className="text-3xl font-bold text-white">${estimatedPrice.toLocaleString()}</p>
            </div>
          )}
          <Button
            onClick={resetForm}
            variant="outline"
            className="bg-white text-buckeye-scarlet hover:bg-gray-100"
          >
            Submit Another Quote
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-buckeye-scarlet rounded-lg p-8 max-w-xl mx-auto shadow-lg border border-buckeye-scarlet/20">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-white" size={20} />
        <h3 className="text-white font-semibold">Secure Quote Calculator</h3>
      </div>
      
      <div className="space-y-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quote-name" className="text-white text-sm">Name</Label>
            <Input
              id="quote-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(sanitizeInput(e.target.value))}
              className="bg-white text-buckeye-black placeholder:text-gray-500"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="quote-email" className="text-white text-sm">Email</Label>
            <Input
              id="quote-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(sanitizeInput(e.target.value))}
              className="bg-white text-buckeye-black placeholder:text-gray-500"
              maxLength={254}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quote-phone" className="text-white text-sm">Phone</Label>
            <Input
              id="quote-phone"
              type="tel"
              placeholder="Your phone"
              value={phone}
              onChange={(e) => setPhone(sanitizeInput(e.target.value))}
              className="bg-white text-buckeye-black placeholder:text-gray-500"
              maxLength={20}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="quote-type" className="text-white text-sm">Project Type</Label>
            <Input
              id="quote-type"
              type="text"
              placeholder="e.g., Commercial, Residential"
              value={projectType}
              onChange={(e) => setProjectType(sanitizeInput(e.target.value))}
              className="bg-white text-buckeye-black placeholder:text-gray-500"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="relative">
          <Label className="text-white text-sm">Floor Plan (Optional)</Label>
          <Input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="floorplan"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            aria-describedby="file-help"
            disabled={isSubmitting}
          />
          <label
            htmlFor="floorplan"
            className={cn(
              "flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white rounded-lg cursor-pointer mt-1",
              "text-white hover:bg-white/10 transition-colors",
              fileError ? "border-red-300 bg-red-50/10" : "",
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            <FileUp className="h-5 w-5" />
            {selectedFile ? selectedFile.name : "Upload Your Floorplan"}
          </label>
          
          <div id="file-help" className="text-xs text-white/80 mt-2">
            Accepted: PDF, JPEG, PNG, WebP (max {maxFileSizeMB}MB)
          </div>
          
          {fileError && (
            <div className="flex items-center gap-1 text-sm text-red-200 mt-2" role="alert">
              <AlertTriangle size={16} />
              <span>{fileError}</span>
            </div>
          )}
        </div>

        {/* Project Size */}
        <div>
          <Label htmlFor="project-size" className="text-white text-sm">Project Size (sq ft) *</Label>
          <Input
            id="project-size"
            type="text"
            placeholder="Enter project size"
            value={projectSize}
            onChange={handleProjectSizeChange}
            className="bg-white text-buckeye-black placeholder:text-gray-500"
            maxLength={10}
            aria-describedby="size-help"
            disabled={isSubmitting}
          />
          <div id="size-help" className="text-xs text-white/80 mt-1">
            Minimum 100 sq ft
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="quote-notes" className="text-white text-sm">Additional Notes</Label>
          <Input
            id="quote-notes"
            type="text"
            placeholder="Any special requirements?"
            value={notes}
            onChange={(e) => setNotes(sanitizeInput(e.target.value))}
            className="bg-white text-buckeye-black placeholder:text-gray-500"
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>

        {/* Estimated Price Display */}
        {estimatedPrice !== null && (
          <div className="text-center animate-fade-in bg-white/10 p-4 rounded-lg">
            <p className="text-white text-sm mb-2">Estimated Cost:</p>
            <p className="text-4xl font-bold text-white">
              ${estimatedPrice.toLocaleString()}
            </p>
            <p className="text-xs text-white/80 mt-2">
              * Estimate based on project size. Final pricing may vary.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={calculatePrice}
            variant="outline"
            className="flex-1 bg-white/10 text-white border-white hover:bg-white/20"
            disabled={!projectSize || parseFloat(projectSize) <= 0 || isSubmitting}
          >
            Calculate Estimate
          </Button>
          <Button
            onClick={handleSubmitQuote}
            className="flex-1 bg-white text-buckeye-scarlet hover:bg-gray-100"
            disabled={!projectSize || parseFloat(projectSize) < 100 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Quote Request'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecureQuoteWidget;
