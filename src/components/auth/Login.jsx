import React, { useState } from "react";
import { colors } from "../../utils/colors";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAuthUser} from "../../redux/slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Stethoscope,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {users} = useSelector((store) => store.auth);
  

  // Hardcoded users
  const HARDCODED_USERS = [
    {
      email: "john@entnt.in",
      password: "patient123",
      role: "user",
      name: "John Doe",
      id: 1,
      
      
      
    },

    {
      email: "admin@entnt.in",
      password: "admin123",
      role: "admin",
      name: "vishal kumar",
      id: 2,
    },
  ];

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!loginForm.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (loginForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    try {
      // simulate api delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user = HARDCODED_USERS.find(
        (user) =>
          user.email === loginForm.email && user.password === loginForm.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem("user-cred", JSON.stringify(userWithoutPassword));
        dispatch(setAuthUser(userWithoutPassword));
        
        // Navigate based on role
        if (user.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/dashboard");
        }
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        toast.error("Invalid email or password");
        setErrors({
          email: "Invalid credentials",
          password: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <Box className="flex justify-center mb-4">
            <Box className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-7 h-7 text-white" />
            </Box>
          </Box>
          <Typography variant="h4" className="font-bold text-slate-100 mb-2">
            Welcome Back
          </Typography>
          {/* <Typography variant="body1" className="text-slate-300">
            Join our dental care platform
          </Typography> */}
        </motion.div>

        {/*Login Form */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50"
            sx={{
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(71, 85, 105, 0.5)",
            }}
          >
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body2"
                  className="text-slate-200 mb-2 font-medium"
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  placeholder="Enter your email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      color: "#f1f5f9",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-error fieldset": {
                        borderColor: "#ef4444",
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#ef4444",
                    },
                  }}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body2"
                  className="text-slate-200 mb-2 font-medium"
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  placeholder="Enter your password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#94a3b8" }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      color: "#f1f5f9",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-error fieldset": {
                        borderColor: "#ef4444",
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
                    },
                    "& .MuiFormHelperText-root": {
                      color: errors.password ? "#ef4444" : "#94a3b8",
                    },
                  }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    background: "linear-gradient(to right, #3b82f6, #2563eb)",
                    color: "white",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(to right, #2563eb, #1d4ed8)",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                    "&:focus": {
                      outline: "2px solid #3b82f6",
                      outlineOffset: "2px",
                    },
                  }}
                  startIcon={
                    isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                    ) : null
                  }
                  endIcon={
                    !isLoading ? <ArrowRight className="w-5 h-5" /> : null
                  }
                >
                  {isLoading ? "Logging In..." : "Login"}
                </Button>
              </motion.div>
            </form>

            {/* SignUp Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <Typography variant="body2" className="text-slate-400">
                Don&apos;t have an account?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/signup")}
                  sx={{
                    color: "#60a5fa",
                    fontWeight: 600,
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#93c5fd",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up here
                </Button>
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center">
          <Typography variant="caption" className="text-slate-500">
            © 2025 ENTNT. All rights reserved.
          </Typography>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Login;
