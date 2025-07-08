import React, { useEffect, useState } from "react";
import {ChevronRight, Calendar, Menu, Stethoscope, X } from "lucide-react";
import { Link } from "react-router-dom";

const InitialLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
   
 useEffect(() => {
   const handleScroll = () => setScrollY(window.scrollY);
   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll)
 },[]) 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-slate-100">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transitions-all duration-300 ${
          scrollY > 50
            ? "bg-slate-900/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-100">ENTNT</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/login">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Login
              </button>
              </Link>
              <Link to='/signup'>
               <button className="border border-blue-400 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-200">
                Sign Up
              </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className=" w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-800/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-4">
              <div className="flex space-x-2 pt-2">
                <Link to="/login">
                 <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Login
                </button>
                </Link>
                <Link to="/signup">
                  <button className="border border-blue-400 text-blue-400 px-4 py-2 rounded-lg text-sm">
                  Sign Up
                </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto ">
          <div className="grid lg:flex lg:justify-center lg:items-center lg:text-center gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Modern Dental
                  </span>
                  <br />
                  <span className="text-slate-100">Practice Management</span>
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Streamline your dental practice with our comprehensive
                  management system. From patient scheduling to analytics, we've
                  got everything covered.
                </p>
              </div>

              <div className="flex flex-col lg:items-center lg:justify-center sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center group">
                  Start Free Trial
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-200">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center md:justify-start lg:justify-center sm:justify-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">500+</div>
                  <div className="text-sm text-slate-400">Happy Practices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">24/7</div>
                  <div className="text-sm text-slate-400">Support</div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/20 to-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span className="text-slate-300">
                            Today's Schedule
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-blue-500/20 p-3 rounded border-l-4 border-blue-400">
                            <div className="text-sm font-medium">
                              Dr. Smith - Cleaning
                            </div>
                            <div className="text-xs text-slate-400">
                              10:00 AM - Room 2
                            </div>
                          </div>
                          <div className="bg-green-500/20 p-3 rounded border-l-4 border-green-400">
                            <div className="text-sm font-medium">
                              Dr. Johnson - Consultation
                            </div>
                            <div className="text-xs text-slate-400">
                              2:30 PM - Room 1
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            23
                          </div>
                          <div className="text-xs text-slate-400">
                            Patients Today
                          </div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            $4.2k
                          </div>
                          <div className="text-xs text-slate-400">
                            Today's Revenue
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InitialLanding;
