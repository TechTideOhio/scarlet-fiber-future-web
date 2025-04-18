
import React, { useState } from 'react';
import { FileUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import CTAButton from './CTAButton';
import { cn } from "@/lib/utils";

const QuoteWidget = () => {
  const [projectSize, setProjectSize] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const calculatePrice = () => {
    // Simple calculation for demo purposes
    const size = parseFloat(projectSize);
    if (!isNaN(size)) {
      // Base rate of $2.5 per sq ft
      const basePrice = size * 2.5;
      setEstimatedPrice(basePrice);
    }
  };

  return (
    <div className="bg-buckeye-scarlet rounded-lg p-8 max-w-xl mx-auto shadow-lg">
      <div className="space-y-6">
        <div className="relative">
          <Input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="floorplan"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="floorplan"
            className={cn(
              "flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white rounded-lg cursor-pointer",
              "text-white hover:bg-white/10 transition-colors"
            )}
          >
            <FileUp className="h-5 w-5" />
            {selectedFile ? selectedFile.name : "Upload Your Floorplan"}
          </label>
        </div>

        <div>
          <Input
            type="number"
            placeholder="Project Size (sq ft)"
            value={projectSize}
            onChange={(e) => setProjectSize(e.target.value)}
            className="bg-white text-buckeye-black placeholder:text-gray-500"
          />
        </div>

        <CTAButton
          onClick={calculatePrice}
          variant="outline"
          className="w-full bg-white text-buckeye-black hover:bg-gray-100"
        >
          Calculate My Cost
        </CTAButton>

        {estimatedPrice !== null && (
          <div className="text-center animate-fade-in">
            <p className="text-white text-sm mb-2">Estimated Cost:</p>
            <p className="text-4xl font-bold text-white">
              ${estimatedPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteWidget;
