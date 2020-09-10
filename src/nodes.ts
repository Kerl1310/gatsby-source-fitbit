import createNodeHelpers from 'gatsby-node-helpers';

const { createNodeFactory } = createNodeHelpers({
    typePrefix: 'Fitbit',
});

export const FitbitNode = createNodeFactory('Fitbit');
