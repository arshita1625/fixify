import React from 'react';
import Footer from '../components/Footer/footer';
import Hero from '../components/Hero/hero';
import HowItWorks from '../components/howitworks/howworks';
import Navbar from '../components/Navbar/Navbar';
import ReadyToGetStarted from '../components/getstarted/getstarted';
import ServicesSection from '../components/serviceSection/serviceSection';
import WorkerManagementForm from "./serviceProviderSignup";
import { useEffect, useState } from "react";
import { getTopReviews } from '../api/reviewApi';
import { Container, Grid, Typography } from "@mui/material";
import ReviewCard from "../components/ReviewCard.jsx";



function Home() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    getTopReviews().then((data) => {
      setReviews(data);
    });
  }, []);
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ServicesSection />
      <ReadyToGetStarted />
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          ⭐ Customer Reviews ⭐
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {reviews.slice(0, 4).map((review, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <ReviewCard review={review} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  )
}

export default Home