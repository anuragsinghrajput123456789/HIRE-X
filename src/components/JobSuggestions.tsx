

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, MapPin, Globe, Briefcase, Users, DollarSign } from 'lucide-react';

interface Website {
  name: string;
  url: string;
  description: string;
  features: string[];
  stats: string;
  categories?: string[];
}

const realWorldBootcamps = [
  {
    name: "General Assembly",
    url: "https://generalassemb.ly/",
    description: "Immersive bootcamps in web development, data science, and UX design.",
    features: ["Career coaching", "Project-based learning", "Industry-recognized certificate"],
    stats: "90%+ job placement rate"
  },
  {
    name: "Flatiron School",
    url: "https://flatironschool.com/",
    description: "Intensive coding bootcamps with a focus on software engineering and data science.",
    features: ["Money-back guarantee", "Personalized career support", "Alumni network"],
    stats: "86% job placement rate"
  },
  {
    name: "App Academy",
    url: "https://www.appacademy.com/",
    description: "Full-stack web development bootcamps with a deferred tuition option.",
    features: ["Deferred tuition", "Pair programming", "Real-world projects"],
    stats: "81% job placement rate"
  }
];

const onlineLearningPlatforms = [
  {
    name: "Coursera",
    url: "https://www.coursera.org/",
    description: "Online courses, Specializations, and degrees from top universities and institutions.",
    features: ["University-backed courses", "Certificates", "Flexible learning"],
    stats: "77M+ learners worldwide"
  },
  {
    name: "edX",
    url: "https://www.edx.org/",
    description: "Online courses from the world's best universities.",
    features: ["Verified certificates", "Degree programs", "Self-paced learning"],
    stats: "39M+ learners globally"
  },
  {
    name: "Udemy",
    url: "https://www.udemy.com/",
    description: "Largest selection of online courses for learning and upskilling.",
    features: ["Lifetime access", "Affordable pricing", "Wide range of topics"],
    stats: "54M+ learners worldwide"
  }
];

const codingChallengeWebsites = [
  {
    name: "LeetCode",
    url: "https://leetcode.com/",
    description: "Platform for improving coding skills with challenges and competitions.",
    features: ["Coding challenges", "Mock interviews", "Community support"],
    stats: "1M+ active users"
  },
  {
    name: "HackerRank",
    url: "https://www.hackerrank.com/",
    description: "Competitive programming platform for assessing coding skills.",
    features: ["Coding contests", "Skill certifications", "Company challenges"],
    stats: "18M+ developers worldwide"
  },
  {
    name: "CodeSignal",
    url: "https://codesignal.com/",
    description: "Skills-based assessment platform for technical recruiting.",
    features: ["Coding assessments", "Tech screening", "Interview practice"],
    stats: "5M+ candidates assessed"
  }
];

const openSourceProjects = [
  {
    name: "React",
    url: "https://reactjs.org/",
    description: "A JavaScript library for building user interfaces.",
    features: ["Component-based", "Virtual DOM", "Large community"],
    stats: "170K+ stars on GitHub"
  },
  {
    name: "Angular",
    url: "https://angular.io/",
    description: "A platform for building mobile and desktop web applications.",
    features: ["TypeScript-based", "Dependency injection", "Comprehensive framework"],
    stats: "70K+ stars on GitHub"
  },
  {
    name: "Vue.js",
    url: "https://vuejs.org/",
    description: "A progressive JavaScript framework for building user interfaces.",
    features: ["Easy to learn", "Flexible", "Reactive components"],
    stats: "180K+ stars on GitHub"
  }
];

const internshipWebsites = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities",
    features: ["Work from home options", "Stipend guaranteed", "Certificate provided"],
    stats: "10M+ students registered",
    categories: ["Engineering", "Business", "Design", "Marketing"]
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs/internship-jobs/",
    description: "Professional network with extensive internship opportunities worldwide",
    features: ["Industry connections", "Company insights", "Professional networking"],
    stats: "900M+ members globally",
    categories: ["All Industries", "Remote Work", "Entry Level"]
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com/internship-jobs",
    description: "India's leading job portal with dedicated internship section",
    features: ["Indian market focus", "Resume building", "Company reviews"],
    stats: "70M+ registered jobseekers",
    categories: ["IT", "Finance", "Sales", "HR"]
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com/q-internship-jobs.html",
    description: "Global job search engine with comprehensive internship listings",
    features: ["Salary insights", "Company reviews", "Application tracking"],
    stats: "250M+ monthly visitors",
    categories: ["Global Opportunities", "Remote", "Part-time"]
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/internship-jobs-SRCH_KO0,10.htm",
    description: "Job search platform with company insights and internship opportunities",
    features: ["Company reviews", "Salary transparency", "Interview insights"],
    stats: "59M+ monthly users",
    categories: ["Tech", "Finance", "Consulting", "Healthcare"]
  },
  {
    name: "AngelList (Wellfound)",
    url: "https://wellfound.com/jobs",
    description: "Startup internships and early career opportunities worldwide",
    features: ["Equity compensation", "Direct founder contact", "Remote friendly"],
    stats: "130,000+ startups",
    categories: ["Startups", "Tech", "Remote", "Equity"]
  }
];

const freelancingWebsites = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Global freelancing platform with diverse project opportunities",
    features: ["Payment protection", "Time tracking", "Skill tests"],
    stats: "18M+ freelancers worldwide",
    categories: ["Web Development", "Design", "Writing", "Marketing"]
  },
  {
    name: "Fiverr",
    url: "https://www.fiverr.com",
    description: "Marketplace for digital services starting at $5",
    features: ["Gig-based system", "Quick turnaround", "Level progression"],
    stats: "4M+ active sellers",
    categories: ["Graphics & Design", "Programming", "Video & Animation", "Music"]
  },
  {
    name: "Freelancer",
    url: "https://www.freelancer.com",
    description: "Contest-based and project-based freelancing platform",
    features: ["Milestone payments", "Contest opportunities", "Mobile app"],
    stats: "50M+ users globally",
    categories: ["Programming", "Design", "Data Entry", "Marketing"]
  },
  {
    name: "Toptal",
    url: "https://www.toptal.com",
    description: "Elite network of top 3% freelance talent",
    features: ["Rigorous screening", "Premium rates", "Direct client matching"],
    stats: "Top 3% talent acceptance rate",
    categories: ["Software Development", "Design", "Finance", "Project Management"]
  },
  {
    name: "99designs",
    url: "https://99designs.com",
    description: "Design-focused freelancing platform with contest model",
    features: ["Design contests", "1-to-1 projects", "Design guarantee"],
    stats: "1M+ designers worldwide",
    categories: ["Logo Design", "Web Design", "Print Design", "Packaging"]
  },
  {
    name: "Guru",
    url: "https://www.guru.com",
    description: "Professional freelancing platform with work room collaboration",
    features: ["SafePay protection", "Work room tools", "Invoice management"],
    stats: "3M+ members worldwide",
    categories: ["Programming", "Design", "Writing", "Administrative"]
  }
];

const jobSearchWebsites = [
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description: "Professional networking platform with extensive job opportunities",
    features: ["AI-powered matching", "Company insights", "Professional networking"],
    stats: "900M+ members, 25M+ jobs",
    categories: ["All Industries", "Remote Work", "Executive Roles"]
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com",
    description: "World's largest job search engine with millions of listings",
    features: ["Resume upload", "Salary insights", "Company reviews"],
    stats: "250M+ monthly visitors",
    categories: ["Global Jobs", "Remote", "Part-time", "Full-time"]
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com",
    description: "Job search with company reviews and salary transparency",
    features: ["Company reviews", "Salary data", "Interview preparation"],
    stats: "59M+ monthly users",
    categories: ["Tech", "Finance", "Healthcare", "Consulting"]
  },
  {
    name: "Monster",
    url: "https://www.monster.com",
    description: "Global employment website for job seekers and employers",
    features: ["Career advice", "Resume services", "Job alerts"],
    stats: "6M+ job seekers monthly",
    categories: ["Entry Level", "Mid-Career", "Senior Roles"]
  },
  {
    name: "ZipRecruiter",
    url: "https://www.ziprecruiter.com",
    description: "AI-powered job matching platform for quick applications",
    features: ["One-click applications", "Mobile app", "Instant matching"],
    stats: "2.8M+ employers",
    categories: ["Quick Apply", "Local Jobs", "Remote Work"]
  },
  {
    name: "CareerBuilder",
    url: "https://www.careerbuilder.com",
    description: "Comprehensive job search platform with career resources",
    features: ["Resume builder", "Career advice", "Skills assessment"],
    stats: "24M+ job seekers",
    categories: ["Corporate", "Government", "Healthcare", "Retail"]
  }
];

const JobSuggestions = () => {
  return (
    <div className="container mx-auto py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Real-World Bootcamps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realWorldBootcamps.map((bootcamp, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{bootcamp.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{bootcamp.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {bootcamp.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {bootcamp.stats}</p>
                <Button asChild>
                  <a href={bootcamp.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Online Learning Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineLearningPlatforms.map((platform, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{platform.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{platform.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {platform.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {platform.stats}</p>
                <Button asChild>
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Coding Challenge Websites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codingChallengeWebsites.map((challenge, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{challenge.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{challenge.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {challenge.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {challenge.stats}</p>
                <Button asChild>
                  <a href={challenge.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Open Source Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openSourceProjects.map((project, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{project.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {project.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {project.stats}</p>
                <Button asChild>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Internship Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internshipWebsites.map((website, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  {website.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{website.description}</CardDescription>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-gray-700">Features:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {website.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm"><strong>Stats:</strong> {website.stats}</p>
                  {website.categories && (
                    <div>
                      <strong className="text-sm text-gray-700">Categories:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {website.categories.map((category, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button asChild className="w-full mt-3">
                    <a href={website.url} target="_blank" rel="noopener noreferrer">
                      Find Internships <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-green-600" />
          Freelancing Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancingWebsites.map((website, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  {website.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{website.description}</CardDescription>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-gray-700">Features:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {website.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm"><strong>Stats:</strong> {website.stats}</p>
                  {website.categories && (
                    <div>
                      <strong className="text-sm text-gray-700">Categories:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {website.categories.map((category, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button asChild className="w-full mt-3">
                    <a href={website.url} target="_blank" rel="noopener noreferrer">
                      Start Freelancing <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-red-600" />
          Job Search Websites
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobSearchWebsites.map((website, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  {website.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{website.description}</CardDescription>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-gray-700">Features:</strong>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {website.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm"><strong>Stats:</strong> {website.stats}</p>
                  {website.categories && (
                    <div>
                      <strong className="text-sm text-gray-700">Categories:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {website.categories.map((category, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button asChild className="w-full mt-3">
                    <a href={website.url} target="_blank" rel="noopener noreferrer">
                      Search Jobs <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JobSuggestions;

