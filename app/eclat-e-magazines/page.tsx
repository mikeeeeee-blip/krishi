'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BookOpen, Download, Calendar, Eye, Search } from 'lucide-react';

export default function EclatEMagazinesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const magazines = [
    {
      title: "Modern Farming Techniques - December 2024",
      description: "Explore the latest agricultural technologies and sustainable farming practices.",
      date: "Dec 2024",
      pages: 48,
      downloads: 1250,
      category: "Technology"
    },
    {
      title: "Organic Agriculture Guide - November 2024",
      description: "Complete guide to organic farming, certification, and market opportunities.",
      date: "Nov 2024",
      pages: 52,
      downloads: 980,
      category: "Organic"
    },
    {
      title: "Irrigation Innovations - October 2024",
      description: "Water conservation techniques and smart irrigation systems for modern farms.",
      date: "Oct 2024",
      pages: 40,
      downloads: 856,
      category: "Irrigation"
    },
    {
      title: "Seed Selection Guide - September 2024",
      description: "Choosing the right seeds for different crops and seasons.",
      date: "Sep 2024",
      pages: 36,
      downloads: 1100,
      category: "Seeds"
    },
    {
      title: "Pest Management Handbook - August 2024",
      description: "Integrated pest management strategies for healthier crops.",
      date: "Aug 2024",
      pages: 44,
      downloads: 920,
      category: "Crop Protection"
    },
    {
      title: "Farm Equipment Buyer's Guide - July 2024",
      description: "Everything you need to know before buying agricultural equipment.",
      date: "Jul 2024",
      pages: 56,
      downloads: 750,
      category: "Equipment"
    }
  ];

  const categories = ["All", "Technology", "Organic", "Seeds", "Irrigation", "Crop Protection", "Equipment"];

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-white">
      <TopBar />
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={closeMobileMenu} />
      
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-banner-content">
          <h1>ECLAT E-Magazines</h1>
          <p>Free Agricultural Knowledge at Your Fingertips</p>
        </div>
      </div>

      <div className="page-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="breadcrumbs-separator">/</span>
          <span>E-Magazines</span>
        </div>

        {/* Introduction */}
        <div className="info-box mb-8">
          <div className="flex items-center gap-4">
            <BookOpen className="w-12 h-12 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Free Agricultural E-Magazines</h3>
              <p className="text-gray-600">
                Access our collection of free e-magazines covering latest farming techniques, 
                market trends, and expert advice. Download and read anytime!
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search magazines..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {magazines.map((magazine, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
                <BookOpen className="w-20 h-20 text-green-400" />
                <span className="absolute top-3 right-3 text-xs font-medium text-white bg-green-600 px-2 py-1 rounded-full">
                  {magazine.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{magazine.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{magazine.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {magazine.date}
                  </span>
                  <span>{magazine.pages} pages</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" /> {magazine.downloads}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-grid mb-12">
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">E-Magazines</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Downloads</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free Access</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Monthly</div>
            <div className="stat-label">New Releases</div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="cta-banner">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3>Never Miss a New Edition!</h3>
          <p>Subscribe to get notified when new e-magazines are released.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
