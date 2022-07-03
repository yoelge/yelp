import React from 'react';
import { Grid, Card, CardContent, IconButton } from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import businessService from "../services/BusinessService"

function BusinessesGrid({ businesses, onToggleFav }) {

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} style={{ marginTop: 10 }}>
      {businesses.map((elem) => (
        <Grid item xs={2} sm={3} md={3} key={businesses.indexOf(elem)}>
          <Card>
            <div className="header" style={{ background: 'url(background.jpg) no-repeat', height: 214, Width: 328, backgroundSize: '100% 100%' }}>
              <div className={businessService.isFav(elem.id) ? "fav-wrapper-active" : "fav-wrapper-inactive"}>
                <IconButton aria-label="delete" onClick={() => { onToggleFav(elem.id); }}>
                  <StarOutlineIcon className={businessService.isFav(elem.id) ? "fav-active" : "fav-inactive"} />
                </IconButton>
              </div>
            </div>
            <div className="rate-wrapper">
              <div className="rate-signal">
                {elem.price}
              </div>
              <div className="price-label">Price Level</div>
            </div>
            <CardContent>
              <div className="rest-details">
                <div className="rest-details-addr">
                  <div className="addr-title">{elem.location.address1}</div>
                  <div className="addr-sub-title">{elem.location.city}, {elem.location.state} {elem.location.postal_code}, {elem.location.country}</div>
                </div>
                <div className={elem.rating > 4 ? "rest-details-rate" : "rest-details-rate-low"}>
                  <div className="rest-details-rate-label">{elem.rating}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default BusinessesGrid;
