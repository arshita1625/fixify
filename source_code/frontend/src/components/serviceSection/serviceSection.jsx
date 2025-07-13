// import React from "react";
// import { Container, Typography, Card, CardContent, Avatar } from "@mui/material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules"; // Fixed import issue
// import Plumbing from "@mui/icons-material/Plumbing";
// import Bolt from "@mui/icons-material/Bolt";
// import CleaningServices from "@mui/icons-material/CleaningServices";
// import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

// // Define the services provided
// const services = [
//   { icon: <Plumbing fontSize="large" sx={{ color: "black" }} />, title: "Plumbing" },
//   { icon: <Bolt fontSize="large" sx={{ color: "black" }} />, title: "Electrician" },
//   { icon: <CleaningServices fontSize="large" sx={{ color: "black" }} />, title: "Cleaning Services" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" },
//   { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Satisfied Clients" }

// ];

// const ServicesSection = () => {
//   return (
//     <Container sx={{ textAlign: "center", py: 8 }}>
//       <Typography variant="h4" fontWeight={600} gutterBottom>
//         Services we provide
//       </Typography>
//       <Swiper
//         modules={[Navigation]}
//         navigation
//         spaceBetween={3}
//         slidesPerView={6}
//         breakpoints={{
//           320: { slidesPerView: 1 },
//           600: { slidesPerView: 3 },
//           960: { slidesPerView: 4 }
//         }}
//         style={{ padding: "20px 0" }}
//       >
//         {services.map((service, index) => (
//           <SwiperSlide key={index}>
//             <Card elevation={1} sx={{ width: 150, height: 140, bgcolor: "#edf1f1", textAlign: "center", p: 3, borderRadius: 2 }}>
//               <Avatar sx={{ bgcolor: "#f5f5f5", width: 30, height: 30, mx: "auto", mb: 2 }}>
//                 {service.icon}
//               </Avatar>
//               <CardContent>
//                 <Typography variant="h6" fontWeight={600}>
//                   {service.title}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </Container>
//   );
// };

// export default ServicesSection;

import React from "react";
import { Container, Typography, Card, CardContent, Avatar } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Plumbing from "@mui/icons-material/Plumbing";
import Bolt from "@mui/icons-material/Bolt";
import CleaningServices from "@mui/icons-material/CleaningServices";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

// Define the services provided
const services = [
  { icon: <Plumbing fontSize="large" sx={{ color: "black" }} />, title: "Plumbing" },
  { icon: <Bolt fontSize="large" sx={{ color: "black" }} />, title: "Electrician" },
  { icon: <CleaningServices fontSize="large" sx={{ color: "black" }} />, title: "Cleaning" },
  { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Clients" },
  { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Maintenance" },
  { icon: <SentimentSatisfiedAltIcon fontSize="large" sx={{ color: "black" }} />, title: "Repairs" },
];

const ServicesSection = () => {
  return (
    <Container id="servicesection" sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Services We Provide
      </Typography>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={4}
        slidesPerView={5} // Default view for large screens
        breakpoints={{
          320: { slidesPerView: 2 },
          600: { slidesPerView: 2 },
          960: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
          1600: { slidesPerView: 5 },
        }}
        style={{ padding: "22px 0" }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <Card
              elevation={3}
              sx={{
                width: "100%",
                maxWidth: 120,
                height: 120,
                bgcolor: "#edf1f1",
                textAlign: "center",
                p: 2,
                borderRadius: 6,
              }}
            >
              <Avatar sx={{ bgcolor: "#f5f5f5", width: 50, height: 50, mx: "auto", mb: 2 }}>
                {service.icon}
              </Avatar>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ fontSize: "15px" }}>
                  {service.title}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default ServicesSection;

