import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const ReviewCard = ({ review }) => {
  const rating = review?.rating ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <Card sx={{ maxWidth: 350, m: 2, p: 2, borderRadius: 3, boxShadow: 5 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 56, height: 56 }} />
          <Typography variant="h6" fontWeight="bold">
            {review?.customerName}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mt={1} gap={0.5}>

          {Array.from({ length: fullStars }).map((_, i) => (
            <StarIcon key={`full-${i}`} sx={{ color: "#FFD700" }} />
          ))}

          {hasHalfStar && (
            <StarHalfIcon key="half" sx={{ color: "#FFD700" }} />
          )}
        </Box>

        <Typography variant="body1" color="text.secondary" mt={1}>
          "{review?.description}"
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;