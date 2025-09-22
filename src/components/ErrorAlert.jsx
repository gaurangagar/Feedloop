import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const ErrorAlert=({ title, description, variant = "default" }) => {
  return (
    <Alert variant={variant}>
      <Terminal />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default ErrorAlert