import React, { useState, useRef, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Target, 
  Award, 
  ChevronRight, 
  FileText, 
  Zap, 
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

const queryClient = new QueryClient();

function Home() {
  // Upload and Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx')) {
        setFile(droppedFile);
        setShowResults(false);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setShowResults(false);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setShowResults(false);
    
    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <Zap className="w-5 h-5 fill-primary" />
            ResumeAI
          </div>
          <nav>
            <Button variant="secondary" className="font-semibold" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        {/* 2. Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold border border-primary/10 shadow-sm"
          >
            <Target className="w-4 h-4" /> AI-Powered Analysis
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
          >
            Perfect your resume in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">seconds.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Upload your resume and let our intelligent engine identify strengths, 
            fix weaknesses, and optimize for Applicant Tracking Systems.
          </motion.p>
        </section>

        {/* 3. Upload Section */}
        <section className="max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`
              relative group border-2 border-dashed rounded-2xl p-10 transition-all duration-200 ease-in-out text-center bg-card
              ${isDragging ? 'border-primary bg-secondary/50 scale-[1.02] shadow-xl' : 'border-border hover:border-primary/50 hover:bg-secondary/20 shadow-md hover:shadow-lg'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf,.docx" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileInput}
              aria-label="Upload resume"
            />
            <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
              <div className={`p-4 rounded-full transition-colors ${file ? 'bg-primary/10 text-primary' : 'bg-muted/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {file ? file.name : "Drag & drop your resume"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {file ? "Ready to analyze" : "Supports PDF and DOCX formats"}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-12 h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
              disabled={!file || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* 4. Results Section */}
        {showResults && (
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-5xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px bg-border flex-1"></div>
              <h2 className="text-2xl font-bold tracking-tight">Analysis Results</h2>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score Card */}
              <motion.div variants={itemVariants} className="md:col-span-1">
                <Card className="h-full border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-indigo-400 w-full" />
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-4 pb-8">
                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-secondary">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                          cx="72" cy="72" r="64" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="transparent" 
                          className="text-primary"
                          strokeDasharray="402"
                          strokeDashoffset="72" // represents 82%
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-5xl font-black text-foreground tracking-tighter">82</span>
                        <span className="text-lg text-muted-foreground font-bold">/100</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-6 text-primary border-primary/30 bg-primary/5 px-3 py-1 font-bold text-sm">
                      Good Candidate
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Strengths & Weaknesses */}
              <motion.div variants={itemVariants} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <Card className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {[
                        "Strong action verbs used",
                        "Quantified achievements",
                        "Clear work history timeline",
                        "Relevant skills section"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-1.5 rounded-md bg-destructive/10 text-destructive">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      To Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {[
                        "Missing professional summary",
                        "No LinkedIn URL included",
                        "Some formatting inconsistencies"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                          <AlertCircle className="w-4 h-4 text-destructive/80 shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Suggested Skills */}
              <motion.div variants={itemVariants}>
                <Card className="h-full border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="w-5 h-5 text-primary" />
                      Suggested Keywords
                    </CardTitle>
                    <CardDescription>Add these to improve your match rate for related roles.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["TypeScript", "Docker", "CI/CD", "AWS", "Agile", "REST APIs", "GraphQL", "React"].map((skill, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ATS Tips */}
              <motion.div variants={itemVariants}>
                <Card className="h-full border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      ATS Compatibility
                    </CardTitle>
                    <CardDescription>Tips to ensure robots can read your resume properly.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        "Use standard section headings like 'Work Experience'",
                        "Avoid tables and columns in layout",
                        "Include exact keywords from job descriptions",
                        "Save final file as .pdf for best compatibility"
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold text-muted-foreground shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm font-medium text-foreground/90 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </motion.section>
        )}
      </main>

      {/* 5. Footer */}
      <footer className="mt-auto py-8 border-t border-border/40 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © 2025 ResumeAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
