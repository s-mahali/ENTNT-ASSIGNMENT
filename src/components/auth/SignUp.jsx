import React, { useState } from 'react'
import { colors } from '../../utils/colors'; 

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [signupForm, setSignUpForm] = useState({
        name: "",
        email: "",
        password: "",
        userType:"patient"
    });

    const handleInputChange = (e) => {
        setSignUpForm({
            ...signupForm,
            [e.target.name]: e.target.value,
        });
    };

    const validateSignUpForm = () => {
        const newErrors = {};

        if (!signupForm.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!signupForm.email) {
            newErrors.email = "Email is required";
        }
            
        if (!signupForm.password) {
            newErrors.password = "Password is required";
        }
            
        setErrors(newErrors);
    }

  return (
    <div>SignUp</div>
  )
}

export default SignUp