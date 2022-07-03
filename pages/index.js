import businessService from "../services/BusinessService"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Badge } from '@mui/material';
import React, { useState } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import SearchBar from '../components/SearchBar';
import BusinessesGrid from '../components/BusinessesGrid';

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

  var favBusiness = businesses.filter(function (business) {
    return businessService.isFav(business.id);
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
          <SearchBar 
            defaultCategory={category}
            defaultLocation={location}
            onCategoryBlur={handleCategoryChange} 
            onCategoryKeyDown={handleCategoryKeyDown} 
            onLocationBlur={handleLocationChange} 
            onLocationKeyDown={handleLocationKeyDown}  />
          <BusinessesGrid businesses={businesses} onToggleFav={handleToggleFav} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BusinessesGrid businesses={favBusiness}onToggleFav={handleToggleFav} />
        </TabPanel>
      </Box>
    </div>
  )
}
