import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar.jsx';
import WorkerContactModal from '../components/UserModal/WorkerContactModal.jsx';
import { getVerifiedServiceProviders } from '../api/serviceProviderApi';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import FilterNavbar from './FilterNavbar.jsx';

const FindService = () => {

  const [profileData, setProfileData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [sortedProfiles, setSortedProfiles] = useState([]);

  useEffect(() => {
    // Fetch profile data from backend API
    getVerifiedServiceProviders()
      .then((response) => {
        if (response.status === 200) {
          response.data.data.forEach((profile) => {
            profile.photo = `photo.png`;
            profile.rate = profile.hourly_rate;
          });
          setProfileData([...response.data.data]);
          setSortedProfiles([...response.data.data]);
          setFilteredProfiles([...response.data.data]);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, []);

  const handleContactClick = (worker) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWorker(null);
  };

  const filterProfiles = (skills) => {
    if (!skills) {
      // If no skill is selected, reset to show all profiles
      setFilteredProfiles(profileData);
      setSortedProfiles(profileData);
      return;
    }

    const filtered = profileData.filter((profile) => {
      // Ensure case-insensitive comparison
      return profile.services.some((service) =>
        service.toLowerCase() === skills.toLowerCase()
      );
    });

    setFilteredProfiles(filtered);
    setSortedProfiles(filtered); // Update sortedProfiles to reflect the filtered data
    console.log("Filtered profiles:", filtered);
  };



  const sortProfiles = (category, order) => {
    let sortedData = [...filteredProfiles]; // Sort filteredProfiles, not profileData

    if (category === 'rating') {
      sortedData.sort((a, b) => order === 'asc' ? a.ratings - b.ratings : b.ratings - a.ratings);
    } else if (category === 'price') {
      sortedData.sort((a, b) => {
        const priceA = a.rate;
        const priceB = b.rate;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    setSortedProfiles(sortedData);
  };

  const getNameString = (firstName, lastName) => {
    if (!firstName || !lastName) {
      return "Unknown";
    }
    return `${firstName} ${lastName}`;
  };

  const getLocationString = (address) => {
    if (!address
      || !address.line1
      || !address.postal_code
      || !address.province
      || !address.country) {
      return "Unknown";
    }
    return `${address.line1}, ${address.postal_code}, ${address.province}, ${address.country}`.toUpperCase();
  };

  return (
    <div>
      <Navbar />
      <FilterNavbar onFilter={filterProfiles} onSort={sortProfiles} />
      <div className="profile-container">
        {sortedProfiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            <div className="card-inner">
              {/* Front side of the card */}
              <div className="card-front">
                <img src={profile.photo} alt={getNameString(profile.userDetails.first_name, profile.userDetails.last_name)} className="profile-photo" />
                <h3>{getNameString(profile.userDetails.first_name, profile.userDetails.last_name)}</h3>
                <h3>${profile.rate}/hr</h3>
                <p>
                  <img src="star.png" alt="star" className="rating-star" />
                  {profile.ratings} / 5
                </p>
              </div>

              {/* Back side of the card */}
              <div className="card-back">
                {/* <p><strong>Location:</strong> {getLocationString(profile.userDetails.address)} </p> */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="body1">
                    {getLocationString(profile.userDetails.address)}
                  </Typography>
                </Stack>
                {/* <p><strong>Location:</strong> {getLocationString(profile.userDetails.address)} </p> */}
                {/* <p><strong>Services:</strong> {profile.services.join(", ")}</p> */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {profile.services.map((service, index) => (
                    <Chip key={index} label={service} />
                  ))}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PhoneIcon color="primary" />
                  <Typography variant="body1">
                    {profile.userDetails.phone}
                  </Typography>
                </Stack>                <button
                  className="contact-btn"
                  onClick={() => handleContactClick(profile)}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Render WorkerContactModal */}
      <WorkerContactModal
        open={modalOpen}
        handleClose={handleCloseModal}
        worker={selectedWorker}
      />

      <style jsx>{`
        /* Styles as before */
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-image: url('se18.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-position: center center;
        }

        .navbar {
          background-color: #333;
          color: #fff;
          padding: 15px;
          text-align: center;
        }

        /* Updated Navbar2 styles */
        .navbar2 {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 50%;
          max-width: 600px;
          background-color: white;
          padding: 10px 0;
          border-radius: 40px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          margin: 100px auto 20px;
        }


        .nav-btn {
          padding: 10px 20px;
          font-size: 18px;
          color: black;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: bold;
          position: relative;
        }
        
        .nav-btn:hover {
          color: #007bff; /* Change color on hover */
        }

        .nav-btn:focus {
          outline: none;
        }

        .nav-btn:hover {
          color: #007bff;
        }

        /* Dropdown Container */
        .dropdown {
          position: relative;
        }

        /* Dropdown List */
        .dropdown-list {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          width: 140px;
          text-align: center;
          z-index: 1000;
        }

        /* Dropdown Buttons */
        .dropdown-list button {
          padding: 10px;
          font-size: 16px;
          color: black;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          font-weight: bold;

        }

        .dropdown-list button:hover {
          background-color:rgb(0, 0, 0);
          color: white;
          font-width: bold;
        }
        
        .profile-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 120px;
          padding: 40px 20px;
          margin: 45px auto 0;
          max-width: 1200px;
        }
          @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
            gap: 60px;
            padding: 20px;
          }
        }

        .profile-card {
          width: 90%;
          height: 400px;
          perspective: 1000px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .profile-card:hover .card-inner {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
        }

        .card-front {
          background-color: #fff;
          padding: 20px;
        }

        .card-back {
          background-color: #f5f5f5;
          padding: 20px;
          transform: rotateY(180deg);
        }

        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
        }

        h3 {
          font-size: 18px;
          margin: 10px 0;
        }

        p {
          font-size: 16px;
        }

        .contact-btn {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .rating-star {
          width: 18px;
          height: 18px;
          margin-right: 5px;
        }

        .contact-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default FindService;