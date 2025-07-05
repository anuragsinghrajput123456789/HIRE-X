
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

const realInternshipWebsites = [
  {
    name: "Internshala",
    url: "https://internshala.com",
    description: "India's largest internship platform with 300,000+ opportunities",
    features: ["Work from home options", "Stipend guaranteed", "Certificate provided"],
    stats: "10M+ students registered"
  },
  {
    name: "AngelList (Wellfound)",
    url: "https://wellfound.com",
    description: "Startup internships and early career opportunities worldwide",
    features: ["Equity compensation", "Direct founder contact", "Remote friendly"],
    stats: "130,000+ startups"
  },
  {
    name: "Forage",
    url: "https://www.theforage.com",
    description: "Virtual work experiences from top companies",
    features: ["Free virtual internships", "Self-paced learning", "Industry insights"],
    stats: "3M+ participants globally"
  }
];

const internationalFreelancingWebsites = [
  {
    name: "Upwork",
    url: "https://www.upwork.com",
    description: "Global freelancing platform with diverse project opportunities",
    features: ["Payment protection", "Time tracking", "Skill tests"],
    stats: "18M+ freelancers worldwide",
    categories: ["Web Development", "Design", "Writing", "Marketing"]
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
  }
];

const nationalFreelancingWebsites = [
  {
    name: "Truelancer",
    url: "https://www.truelancer.com",
    description: "Indian freelancing platform with local payment options",
    features: ["INR payments", "Local support", "Escrow protection"],
    stats: "1M+ freelancers in India",
    categories: ["Web Development", "Content Writing", "Digital Marketing"]
  },
  {
    name: "WorknHire",
    url: "https://www.worknhire.com",
    description: "Indian platform connecting freelancers with businesses",
    features: ["Zero commission model", "Direct communication", "Local focus"],
    stats: "500K+ registered users",
    categories: ["IT Services", "Content Creation", "Business Services"]
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
        <h2 className="text-2xl font-semibold mb-4">Real Internship Websites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realInternshipWebsites.map((website, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{website.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{website.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {website.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {website.stats}</p>
                <Button asChild>
                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">International Freelancing Websites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internationalFreelancingWebsites.map((website, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{website.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{website.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {website.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {website.stats}</p>
                {website.categories && (
                  <div className="mt-2">
                    <strong>Categories:</strong>
                    {website.categories.map((category, i) => (
                      <Badge key={i} className="mr-1">{category}</Badge>
                    ))}
                  </div>
                )}
                <Button asChild>
                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">National Freelancing Websites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nationalFreelancingWebsites.map((website, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{website.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{website.description}</CardDescription>
                <ul className="list-disc pl-5 mt-2">
                  {website.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Stats:</strong> {website.stats}</p>
                {website.categories && (
                  <div className="mt-2">
                    <strong>Categories:</strong>
                    {website.categories.map((category, i) => (
                      <Badge key={i} className="mr-1">{category}</Badge>
                    ))}
                  </div>
                )}
                <Button asChild>
                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JobSuggestions;
