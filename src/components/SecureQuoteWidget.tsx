
import React, { useState } from 'react';
import { FileUp, Shield, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import CTAButton from './CTAButton';
import { cn } from "@/lib/utils";
import { validateFileType, validateFileSize, sanitizeInput } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

const SecureQuoteWidget = () => {
  const { toast } = useToast();
  const [projectSize, setProjectSize] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string>('');

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

    // Validate file type
    if (!validateFileType(file, allowedFileTypes)) {
      setFileError('Invalid file type. Please upload PDF, JPEG, PNG, or WebP files only.');
      e.target.value = '';
      return;
    }

    // Validate file size
    if (!validateFileSize(file, maxFileSizeMB)) {
      setFileError(`File too large. Maximum size is ${maxFileSizeMB}MB.`);
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
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    toast({
      title: "File uploaded securely",
      description: `${file.name} has been validated and uploaded safely.`,
      duration: 3000,
    });
  };

  const handleProjectSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = sanitizeInput(value);
    
    // Only allow numbers and decimal points
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
      return;
    }

    if (size < 100) {
      toast({
        title: "Minimum project size",
        description: "Project size must be at least 100 sq ft.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Secure calculation with bounds checking
    const baseRate = 2.5;
    const calculatedPrice = Math.round(size * baseRate * 100) / 100; // Round to 2 decimal places
    
    // Set reasonable maximum
    const maxPrice = 2500000; // $2.5M max
    const finalPrice = Math.min(calculatedPrice, maxPrice);
    
    setEstimatedPrice(finalPrice);
    
    toast({
      title: "Quote calculated securely",
      description: "Your estimate has been calculated using validated inputs.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-buckeye-scarlet rounded-lg p-8 max-w-xl mx-auto shadow-lg border border-buckeye-scarlet/20">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-white" size={20} />
        <h3 className="text-white font-semibold">Secure Quote Calculator</h3>
      </div>
      
      <div className="space-y-6">
        <div className="relative">
          <Input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="floorplan"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            aria-describedby="file-help"
          />
          <label
            htmlFor="floorplan"
            className={cn(
              "flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white rounded-lg cursor-pointer",
              "text-white hover:bg-white/10 transition-colors",
              fileError ? "border-red-300 bg-red-50/10" : ""
            )}
          >
            <FileUp className="h-5 w-5" />
            {selectedFile ? selectedFile.name : "Upload Your Floorplan (Secure)"}
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

        <div>
          <Input
            type="text"
            placeholder="Project Size (sq ft)"
            value={projectSize}
            onChange={handleProjectSizeChange}
            className="bg-white text-buckeye-black placeholder:text-gray-500"
            maxLength={10}
            aria-describedby="size-help"
          />
          <div id="size-help" className="text-xs text-white/80 mt-1">
            Enter numeric value only (minimum 100 sq ft)
          </div>
        </div>

        <CTAButton
          onClick={calculatePrice}
          variant="outline"
          className="w-full bg-white text-buckeye-black hover:bg-gray-100 disabled:opacity-50"
          disabled={!projectSize || parseFloat(projectSize) <= 0}
        >
          Calculate Secure Estimate
        </CTAButton>

        {estimatedPrice !== null && (
          <div className="text-center animate-fade-in bg-white/10 p-4 rounded-lg">
            <p className="text-white text-sm mb-2">Estimated Cost:</p>
            <p className="text-4xl font-bold text-white">
              ${estimatedPrice.toLocaleString()}
            </p>
            <p className="text-xs text-white/80 mt-2">
              * Estimate based on validated inputs. Final pricing may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureQuoteWidget;
