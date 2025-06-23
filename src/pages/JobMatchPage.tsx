
import JobSuggestions from '../components/JobSuggestions';

const JobMatchPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Job Matching</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover personalized job recommendations and career guidance
        </p>
      </div>
      <JobSuggestions />
    </div>
  );
};

export default JobMatchPage;
