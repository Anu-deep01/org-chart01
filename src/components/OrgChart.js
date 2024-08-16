import React from 'react';
import Branch from './Branch';

const OrgChart = () => {
    return (
        <div>
            <Branch label="Director" isDirector={true} />
        </div>
    );
};

export default OrgChart;


