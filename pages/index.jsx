import businessService from "../services/BusinessService"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Badge } from '@mui/material';
import React, { useState } from 'react';
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Home({ initialBusinesses }) {

  const [businesses, setBusinesses] = React.useState(initialBusinesses);
  const [favCounts, setFavCounts] = React.useState(0);
  const [location, setLocation] = React.useState("miami");
  const [category, setCategory] = React.useState("pizza");
  const [currentTab, setCurrentTab] = React.useState(0);
  const [favBusinesses, setFavBusinesses] = React.useState([]);

  const handleTabChange = (event, newTabValue) => {
    setCurrentTab(newTabValue);
  };

  const handleToggleFav = (business) => {
    businessService.togglefavBusiness(business);
    var newFavBusinesses = businessService.favBusinesses;
    setFavBusinesses(newFavBusinesses);
    updateFavCount();

  };

  const updateFavCount = (businesses) => {
    setFavCounts(businessService.favBusinesses.length);
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

  return (
    <div >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="yelp app tabs" centered>
            <Tab label="Search" {...a11yProps(0)} />
            <Tab label="Saved" {...a11yProps(1)} icon={<Badge badgeContent={favCounts} color="success" />} iconPosition="end" />
          </Tabs>
        </Box>
        <TabPanel value={currentTab} index={0}>
          <SearchBar
            defaultCategory={category}
            defaultLocation={location}
            onCategoryBlur={handleCategoryChange}
            onCategoryKeyDown={handleCategoryKeyDown}
            onLocationBlur={handleLocationChange}
            onLocationKeyDown={handleLocationKeyDown} />
          <BusinessesGrid businesses={businesses} onToggleFav={handleToggleFav} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <BusinessesGrid businesses={favBusinesses} onToggleFav={handleToggleFav} />
        </TabPanel>
      </Box>
    </div>
  )
}
