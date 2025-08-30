import React, { useState, useRef } from 'react';

const CropAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton', 
    'Potato', 'Tomato', 'Apple', 'Grape', 'Other'
  ];

  const seasons = [
    'Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please upload an image under 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setError(null); // Clear any previous errors
      };
      reader.onerror = () => {
        setError('Failed to read the image file. Please try another image.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedCrop || !selectedSeason) {
      setError("Please upload an image, select crop type, and season first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // Create form data to send to the backend
      const formData = new FormData();
      
      // Convert data URL to blob for proper file upload
      const blob = await fetch(selectedImage).then(r => r.blob());
      formData.append('image', blob, 'crop_image.jpg');
      formData.append('crop', selectedCrop);
      formData.append('season', selectedSeason);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      // Set the analysis result from the backend
      setAnalysisResult(data);
      
    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.message || "Error analyzing crop. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedCrop('');
    setSelectedSeason('');
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-green-200 opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-emerald-300 opacity-15 animate-bounce"></div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-green-400 opacity-10"
          style={{
            width: `${Math.random() * 12 + 4}px`,
            height: `${Math.random() * 12 + 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        ></div>
      ))}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Crop Health Analysis</h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Upload an image of your crop, select the crop type and season for AI-powered disease detection and treatment recommendations.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left side - Upload and form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Upload Crop Image</h3>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  selectedImage 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-green-300 hover:border-green-500 hover:bg-green-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {selectedImage ? (
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden border border-green-200">
                      <img 
                        src={selectedImage} 
                        alt="Uploaded crop" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-green-700 font-medium">Image uploaded successfully!</p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        fileInputRef.current.value = '';
                      }}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 mx-auto mb-4 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-green-700 font-medium">Click to upload an image</p>
                    <p className="text-green-500 text-sm mt-1">JPG, PNG or GIF (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Crop Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {cropTypes.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                        selectedCrop === crop
                          ? 'bg-green-100 border-green-600 text-green-800 font-medium shadow-sm'
                          : 'bg-white border-green-200 text-green-600 hover:border-green-400'
                      }`}
                      onClick={() => setSelectedCrop(crop)}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Season</label>
                <div className="flex flex-wrap gap-3">
                  {seasons.map((season) => (
                    <button
                      key={season}
                      type="button"
                      className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                        selectedSeason === season
                          ? 'bg-green-100 border-green-600 text-green-800 font-medium shadow-sm'
                          : 'bg-white border-green-200 text-green-600 hover:border-green-400'
                      }`}
                      onClick={() => setSelectedSeason(season)}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !selectedImage || !selectedCrop || !selectedSeason}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    isAnalyzing || !selectedImage || !selectedCrop || !selectedSeason
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Crop Health'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-6 rounded-lg font-semibold border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Results or placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 h-full">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Analysis Results</h3>
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 mb-6 text-green-600">
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-green-700 font-medium">Analyzing your crop image...</p>
                <p className="text-green-500 mt-2">This may take a few moments</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Detection Result</h4>
                  <p className="text-green-700">
                    <span className="font-medium">Disease: </span>
                    {analysisResult.disease_name} ({(analysisResult.confidence * 100).toFixed(2)}% confidence)
                  </p>
                  <p className="text-green-700 mt-1">
                    <span className="font-medium">Crop Type: </span>
                    {analysisResult.crop_type || 'Not specified'}
                  </p>
                  <p className="text-green-700 mt-1">
                    <span className="font-medium">Season: </span>
                    {analysisResult.season || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Description</h4>
                  <p className="text-green-700">{analysisResult.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Recommended Treatment</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-2 pl-4">
                    {analysisResult.treatment && analysisResult.treatment.map((solution, index) => (
                      <li key={index}>{solution}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                  <p className="text-yellow-700 text-sm">
                    This analysis is provided for informational purposes only. For accurate diagnosis and treatment recommendations, consult with agricultural experts.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 mb-6 text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-green-700 font-medium">Analysis results will appear here</p>
                <p className="text-green-500 mt-2">Upload an image and select crop details to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default CropAnalysis;