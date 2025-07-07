import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Info, Check, AlertTriangle } from "lucide-react";

export default function Setup() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    // TODO: Implement Hebrew document processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-text-primary">
            Setup Inspection Template
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>One-Time Setup:</strong> Upload your Hebrew inspection document to auto-generate form fields. 
              This only needs to be done once to configure your inspection template.
            </AlertDescription>
          </Alert>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="text-4xl text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Upload Inspection Template
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Upload your Hebrew Word or PDF document to automatically generate inspection form fields
            </p>
            
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild className="cursor-pointer">
                  <span>Choose Document</span>
                </Button>
              </label>
              
              {uploadedFile && (
                <div className="text-sm text-text-secondary">
                  Selected: {uploadedFile.name}
                </div>
              )}
            </div>
            
            <p className="text-xs text-text-secondary mt-2">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>

          {uploadedFile && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-text-primary mb-3">
                  Document Processing
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    <span className="text-sm text-text-secondary">
                      Automatic Hebrew to English translation
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    <span className="text-sm text-text-secondary">
                      Form field generation based on document structure
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    <span className="text-sm text-text-secondary">
                      PDF report template matching original layout
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full mt-4"
                >
                  {isProcessing ? "Processing..." : "Process Document"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Current Status:</strong> Using pre-built template based on your Hebrew inspection document. 
              The form structure has been configured according to kosher factory inspection requirements.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
