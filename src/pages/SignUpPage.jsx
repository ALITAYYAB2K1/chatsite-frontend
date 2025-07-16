import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signup, isSignUp] = useAuthStore();
  const validateForm = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    }
  };

  return <div>SignUpPage</div>;
}

export default SignUpPage;
