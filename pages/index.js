import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import businessService from "../services/BusinessService"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Grid, Card, CardHeader, CardContent, CardMedia, Badge, TextField, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export async function getServerSideProps() {


  const business = await businessService.getBusiness("miami", "pizza");

  console.log(business);
  return {
    props: {
      initialBusinesses: business,
    },
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} alignItems="center">
          {children}
        </Box>
      )}
    </div>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function favCount(businesses) {

  var favBusiness = businesses.filter(function (value, index, businesses) {
    return businessService.isFav(value.id);
  });
  return favBusiness.length;
}

export default function Home({ initialBusinesses }) {

  const [businesses, setBusinesses] = React.useState(initialBusinesses);
  const [favCounts, setFavCounts] = React.useState(0);
  const [location, setLocation] = React.useState("miami");
  const [category, setCategory] = React.useState("pizza");
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleToggleFav = (businessId) => {
    businessService.togglefav(businessId);
    var newFavCounts = businessService.favCount();
    setFavCounts(newFavCounts);
  };


  const handleLocationKeyDown = async (event) => {
    if (event.keyCode == 13) {
      await handleLocationChange(event);
    }
  };

  const handleLocationChange = async (event) => {

    var newLocation = event.target.value;
    var newBusinesses = await businessService.getBusiness(newLocation, category);
    setLocation(newLocation);
    setBusinesses(newBusinesses);

  };

  const handleCategoryKeyDown = async (event) => {
    if (event.keyCode == 13) {
      await handleCategoryChange(event);
    }
  };

  const handleCategoryChange = async (event) => {

    var newCategory = event.target.value;
    var newBusinesses = await businessService.getBusiness(location, newCategory);
    setCategory(newCategory);
    setBusinesses(newBusinesses);

  };

  var favBusiness = businesses.filter(function (value, index, businesses) {
    return businessService.isFav(value.id);
  });


  return (
    <div >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="Search" {...a11yProps(0)} />
            <Tab label="Saved" {...a11yProps(1)} icon={<Badge badgeContent={favCount(businesses)} color="success" />} iconPosition="end" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <TextField id="outlined-basic" label="Term" variant="outlined" defaultValue={category} style={{ width: 397, marginRight: 10 }} onBlur={handleCategoryChange} onKeyDown={handleCategoryKeyDown} />
          <TextField id="outlined-basic" label="Location" variant="outlined" defaultValue={location} style={{ width: 397 }} onBlur={handleLocationChange} onKeyDown={handleLocationKeyDown} />
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} style={{ marginTop: 10 }}>
            {businesses.map((elem) => (
              <Grid item xs={2} sm={3} md={3} key={businesses.indexOf(elem)}>

                <Card>
                  <div className="header" style={{ background: 'url(background.jpg) no-repeat', height: 214, Width: 328, backgroundSize: '100% 100%' }}>
                    <div className={businessService.isFav(elem.id) ? "fav-wrapper-active" : "fav-wrapper-inactive"}>
                      <IconButton aria-label="delete" onClick={() => { handleToggleFav(elem.id); }}>
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} style={{ marginTop: 10 }}>
            {favBusiness.map((elem) => (
              <Grid item xs={2} sm={3} md={3} key={favBusiness.indexOf(elem)}>

                <Card>
                  <div className="header" style={{ background: 'url(background.jpg) no-repeat', height: 214, Width: 328, backgroundSize: '100% 100%' }}>
                    <div className={businessService.isFav(elem.id) ? "fav-wrapper-active" : "fav-wrapper-inactive"}>
                      <IconButton aria-label="delete" onClick={() => { handleToggleFav(elem.id); }}>

                        <StarOutlineIcon className={businessService.isFav(elem.id) ? "fav-active" : "fav-inactive"} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="rate-wrapper">
                    <div className="rate-signal">
                      $$$
                    </div>
                    <div className="price-label">Price Level</div>


                  </div>
                  <CardContent>
                    <div className="rest-details">
                      <div className="rest-details-addr">
                        <div className="addr-title">{elem.location.address1}</div>
                        <div className="addr-sub-title">{elem.location.city}, {elem.location.state} {elem.location.postal_code}, {elem.location.country}</div>
                      </div>
                      <div className="rest-details-rate">
                        <div className="rest-details-rate-label">{elem.rating}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </Grid>
            ))}
          </Grid>

        </TabPanel>
      </Box>
    </div>


  )
}
