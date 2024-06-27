import { Card, CardBody, Input, Select, Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { memo, useMemo, useState } from 'react';

const candidatesData = [
  { "id": 1, "name": "John Doe", "position": "Software Engineer", "location": "New York" },
  { "id": 2, "name": "Jane Smith", "position": "Product Manager", "location": "Los Angeles" },
  { "id": 3, "name": "Michael Johnson", "position": "UI/UX Designer", "location": "San Francisco" },
  { "id": 4, "name": "Emily Davis", "position": "Data Scientist", "location": "Chicago" },
  { "id": 5, "name": "David Wilson", "position": "DevOps Engineer", "location": "Houston" },
  { "id": 6, "name": "Sarah Brown", "position": "Backend Developer", "location": "New York" },
  { "id": 7, "name": "James Williams", "position": "Frontend Developer", "location": "Los Angeles" },
  { "id": 8, "name": "Patricia Taylor", "position": "Business Analyst", "location": "San Francisco" },
  { "id": 9, "name": "Robert Miller", "position": "Systems Analyst", "location": "Chicago" },
  { "id": 10, "name": "Linda Anderson", "position": "Project Manager", "location": "Houston" },
  { "id": 11, "name": "Christopher Martinez", "position": "Security Analyst", "location": "New York" },
  { "id": 12, "name": "Susan Hernandez", "position": "Marketing Manager", "location": "Los Angeles" },
  { "id": 13, "name": "Joseph Clark", "position": "Sales Manager", "location": "San Francisco" },
  { "id": 14, "name": "Karen Lewis", "position": "Customer Support", "location": "Chicago" },
  { "id": 15, "name": "Daniel Robinson", "position": "HR Manager", "location": "Houston" },
  { "id": 16, "name": "Jessica Walker", "position": "Content Writer", "location": "New York" },
  { "id": 17, "name": "Matthew Hall", "position": "SEO Specialist", "location": "Los Angeles" },
  { "id": 18, "name": "Nancy Allen", "position": "Graphic Designer", "location": "San Francisco" },
  { "id": 19, "name": "Paul Young", "position": "IT Support", "location": "Chicago" },
  { "id": 20, "name": "Laura King", "position": "Finance Manager", "location": "Houston" }
];
const EditCandidate = () => {
  const [filters, setFilters] = useState({ name: '', location: '', position: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  const filteredCandidates = useMemo(
    () =>
      candidatesData.filter(
        (candidate) =>
          (filters.name === '' || candidate.name.toLowerCase().includes(filters.name.toLowerCase())) &&
          (filters.location === '' || candidate.location === filters.location) &&
          (filters.position === '' || candidate.position.toLowerCase().includes(filters.position.toLowerCase()))
      ),
    [filters.name, filters.location, filters.position]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  return (
    <div className="p-8">
      <Typography variant="h4" className="text-center mb-6">
        Candidate List
      </Typography>

      <FilterSection filters={filters} handleFilterChange={handleFilterChange} />

      <CandidateCards candidates={currentCandidates} />

      <div className="flex justify-center mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
      </div>
    </div>
  );
};

const FilterSection = memo(({ filters, handleFilterChange }) => (
  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <Typography color="black" className="font-medium mb-2">
        Name
      </Typography>
      <Input name="name" value={filters.name} onChange={handleFilterChange} className="w-full" />
    </div>
    <div>
      <Typography color="black" className="font-medium mb-2">
        Location
      </Typography>
      <Select name="location" value={filters.location} onChange={handleFilterChange} className="w-full">
        <option value="">All Locations</option>
        <option value="New York">New York</option>
        <option value="Los Angeles">Los Angeles</option>
        <option value="San Francisco">San Francisco</option>
        <option value="Chicago">Chicago</option>
        <option value="Houston">Houston</option>
      </Select>
    </div>
    <div>
      <Typography color="black" className="font-medium mb-2">
        Position
      </Typography>
      <Input name="position" value={filters.position} onChange={handleFilterChange} className="w-full" />
    </div>
  </div>
));

const CandidateCards = memo(({ candidates }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {candidates.map((candidate) => (
      <CandidateCard key={candidate.id} candidate={candidate} />
    ))}
  </div>
));

const CandidateCard = memo(({ candidate }) => (
  <motion.div className="bg-white shadow-md rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Card>
      <CardBody className="flex items-center space-x-4 p-4">
        <div>
          <Typography variant="h6" className="mb-1">
            {candidate.name}
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            {candidate.position}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            {candidate.location}
          </Typography>
        </div>
      </CardBody>
    </Card>
  </motion.div>
));

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center space-x-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
      <button
        key={pageNumber}
        className={`px-3 py-1 rounded-md ${
          pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => onPageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    ))}
  </div>
));

export default EditCandidate;