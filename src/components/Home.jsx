import React from 'react';
import CompanyList from '../CompanyList';
import RateCalculation from '../RateCalculation';
import FreightCalculation from '../FreightCalculation';

const Home = ({ inputData, InputTextArea }) => {
  return (
    <div className="home-container">
      <InputTextArea />
      <div className="output-container">
        <CompanyList companies={inputData} />
        <div className="rate-freight-container">
          <RateCalculation />
          <FreightCalculation />
        </div>
      </div>
    </div>
  );
};

export default Home;
