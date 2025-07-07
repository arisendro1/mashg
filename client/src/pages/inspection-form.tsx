import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BasicInfoForm } from "@/components/inspection/basic-info-form";
import { ContactForm } from "@/components/inspection/contact-form";
import { BackgroundForm } from "@/components/inspection/background-form";
import { DocumentsForm } from "@/components/inspection/documents-form";
import { CategoryForm } from "@/components/inspection/category-form";
import { PhotoUpload } from "@/components/inspection/photo-upload";
import { ChevronLeft, ChevronRight } from "lucide-react";

const steps = [
  { id: 1, title: "Basic Info", component: BasicInfoForm },
  { id: 2, title: "Contact", component: ContactForm },
  { id: 3, title: "Background", component: BackgroundForm },
  { id: 4, title: "Documents", component: DocumentsForm },
  { id: 5, title: "Category", component: CategoryForm },
  { id: 6, title: "Photos", component: PhotoUpload },
];

export default function InspectionForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const { data: inspection, isLoading } = useQuery({
    queryKey: ["/api/inspections", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-text-primary">
            {id ? "Edit Inspection" : "New Factory Inspection"}
          </CardTitle>
          
          {/* Step Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className="flex items-center"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        step.id === currentStep
                          ? "bg-primary text-white"
                          : step.id < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-text-secondary"
                      }`}>
                        {step.id}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        step.id === currentStep ? "text-primary" : "text-text-secondary"
                      }`}>
                        {step.title}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={inspection || formData}
              onUpdate={setFormData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-3">
              <Button variant="outline">
                Save as Draft
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setLocation("/reports")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete Inspection
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
