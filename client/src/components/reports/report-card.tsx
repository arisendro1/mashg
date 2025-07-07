import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Eye, Download, Mail } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Inspection } from "@shared/schema";

interface ReportCardProps {
  inspection: Inspection;
}

export function ReportCard({ inspection }: ReportCardProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    // TODO: Implement PDF download
    toast({
      title: "Download",
      description: "PDF download functionality will be implemented",
    });
  };

  const handleEmail = () => {
    // TODO: Implement email functionality
    toast({
      title: "Email",
      description: "Email functionality will be implemented",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Building className="text-white text-sm" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-text-primary">
                {inspection.factoryName}
              </h3>
              <p className="text-xs text-text-secondary">
                {inspection.inspector}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(inspection.status)}>
            {inspection.status}
          </Badge>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-1">Inspection Date</p>
          <p className="text-sm font-medium text-text-primary">
            {new Date(inspection.gregorianDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-1">Location</p>
          <p className="text-sm font-medium text-text-primary">
            {inspection.factoryAddress}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Link href={`/inspection/${inspection.id}`}>
              <Button variant="ghost" size="sm" title="View Report">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEmail}
              title="Email Report"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-text-secondary">
            {inspection.createdAt ? new Date(inspection.createdAt).toLocaleDateString() : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
